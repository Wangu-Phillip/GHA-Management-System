import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import makeWASocket, {
  DisconnectReason,
  initAuthCreds,
  BufferJSON,
  AuthenticationCreds
} from '@whiskeysockets/baileys';
import * as QRCode from 'qrcode';
import { Boom } from '@hapi/boom';
import pino from 'pino';

admin.initializeApp();
const db = admin.firestore();

// ── CUSTOM FIRESTORE AUTH STATE PROVIDER ─────────────────────────────────────
// Serializes and stores Baileys connection credentials and keys inside a single
// Firestore document to reduce database operations and fit within serverless execution.
async function useFirestoreAuthState(guesthouseId: string) {
  const docRef = db.collection('whatsapp_sessions').doc(guesthouseId);

  const getSessionData = async () => {
    const snap = await docRef.get();
    if (!snap.exists) return { creds: null, keys: {} };
    const data = snap.data() || {};
    
    const parsedCreds = data.credsJson ? JSON.parse(data.credsJson, BufferJSON.reviver) : null;
    const parsedKeys = data.keysJson ? JSON.parse(data.keysJson, BufferJSON.reviver) : {};
    return { creds: parsedCreds, keys: parsedKeys };
  };

  const { creds: initialCreds, keys } = await getSessionData();
  const creds: AuthenticationCreds = initialCreds || initAuthCreds();

  if (!initialCreds) {
    await docRef.set({
      credsJson: JSON.stringify(creds, BufferJSON.replacer),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  const saveCreds = async () => {
    await docRef.set({
      credsJson: JSON.stringify(creds, BufferJSON.replacer),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  };

  return {
    state: {
      creds,
      keys: {
        get: (type: string, ids: string[]) => {
          const dict: { [id: string]: any } = {};
          for (const id of ids) {
            const key = `${type}-${id}`;
            if (keys[key]) {
              dict[id] = keys[key];
            }
          }
          return dict;
        },
        set: async (data: any) => {
          for (const type in data) {
            for (const id in data[type]) {
              const val = data[type][id];
              const key = `${type}-${id}`;
              if (val) {
                keys[key] = val;
              } else {
                delete keys[key];
              }
            }
          }
          await docRef.set({
            keysJson: JSON.stringify(keys, BufferJSON.replacer),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }
    },
    saveCreds
  };
}

// ── API 1: GENERATE/GET QR CODE FOR ONBOARDING ──────────────────────────────
export const getQrCode = onRequest({ cors: true }, async (req, res) => {
  const guesthouseId = req.query.guesthouseId as string || req.body.guesthouseId as string;
  if (!guesthouseId) {
    res.status(400).json({ error: 'guesthouseId is required' });
    return;
  }

  try {
    const { state, saveCreds } = await useFirestoreAuthState(guesthouseId);
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'info' }),
      browser: ['macOS', 'Chrome', '125.0.0.3'],
      printQRInTerminal: false
    });

    let qrSent = false;

    // Timeout safety net (25 seconds)
    const timeoutId = setTimeout(() => {
      if (!qrSent && !res.headersSent) {
        qrSent = true;
        try { sock.end(undefined); } catch {}
        res.status(504).json({ error: 'Timeout waiting for WhatsApp QR generation. Please try again.' });
      }
    }, 25000);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (res.headersSent) return;

      if (qr && !qrSent) {
        qrSent = true;
        clearTimeout(timeoutId);
        try {
          const qrDataUrl = await QRCode.toDataURL(qr);
          
          await db.collection('whatsapp_sessions').doc(guesthouseId).set({
            status: 'AWAITING_SCAN',
            qrCodeDataUrl: qrDataUrl,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          res.status(200).json({ qrCodeDataUrl: qrDataUrl, status: 'AWAITING_SCAN' });
          try { sock.end(undefined); } catch {}
        } catch (err: any) {
          res.status(500).json({ error: 'Failed to generate QR code image data', details: err.message });
        }
      }

      if (connection === 'open') {
        clearTimeout(timeoutId);
        await db.collection('whatsapp_sessions').doc(guesthouseId).set({
          status: 'LINKED',
          qrCodeDataUrl: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        res.status(200).json({ status: 'LINKED', message: 'Device successfully linked' });
        try { sock.end(undefined); } catch {}
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isConnectionFailure = lastDisconnect?.error?.message?.includes('Connection Failure') || 
                                    lastDisconnect?.error?.message?.includes('handshake') ||
                                    statusCode === 500;

        if ((isLoggedOut || isConnectionFailure) && !qrSent) {
          clearTimeout(timeoutId);
          try {
            await db.collection('whatsapp_sessions').doc(guesthouseId).delete();
          } catch (dbErr) {
            console.error('Error deleting session document:', dbErr);
          }
          res.status(401).json({ 
            error: 'WhatsApp connection failure. Session cleared. Please click connect again.',
            details: lastDisconnect?.error?.message 
          });
          try { sock.end(undefined); } catch {}
        }
      }
    });

  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

// ── API 2: DISPATCH OUTBOUND MESSAGE ─────────────────────────────────────────
export const sendMessage = onRequest({ cors: true }, async (req, res) => {
  const { guesthouseId, phone, content } = req.body;
  if (!guesthouseId || !phone || !content) {
    res.status(400).json({ error: 'guesthouseId, phone, and content are required' });
    return;
  }

  // Format phone number to WhatsApp JID standard
  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const jid = `${formattedPhone}@s.whatsapp.net`;

  try {
    const { state, saveCreds } = await useFirestoreAuthState(guesthouseId);
    
    // Check if credentials exist and have keys initialized
    const doc = await db.collection('whatsapp_sessions').doc(guesthouseId).get();
    const data = doc.data() || {};
    if (data.status !== 'LINKED' && !data.credsJson) {
      res.status(400).json({ error: 'Device not linked. Scan QR code first.' });
      return;
    }

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'info' }),
      browser: ['macOS', 'Chrome', '125.0.0.3'],
      printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'open') {
        try {
          // Send message
          const sentMsg = await sock.sendMessage(jid, { text: content });
          
          res.status(200).json({ 
            success: true, 
            messageId: sentMsg?.key?.id,
            status: 'SENT'
          });

          // Close connection cleanly
          sock.end(undefined);
        } catch (sendErr: any) {
          res.status(500).json({ error: 'Failed to transmit message', details: sendErr.message });
          sock.end(undefined);
        }
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        if (statusCode === DisconnectReason.loggedOut) {
          await db.collection('whatsapp_sessions').doc(guesthouseId).set({
            status: 'UNLINKED',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── API 3: CHECK SESSION CONNECTION STATUS ───────────────────────────────────
export const getSessionStatus = onRequest({ cors: true }, async (req, res) => {
  const guesthouseId = req.query.guesthouseId as string;
  if (!guesthouseId) {
    res.status(400).json({ error: 'guesthouseId is required' });
    return;
  }

  try {
    const doc = await db.collection('whatsapp_sessions').doc(guesthouseId).get();
    if (!doc.exists) {
      res.status(200).json({ status: 'UNLINKED' });
      return;
    }

    const data = doc.data() || {};
    res.status(200).json({
      status: data.status || 'UNLINKED',
      qrCodeDataUrl: data.qrCodeDataUrl || null,
      pairingCode: data.pairingCode || null,
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : null
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── API 4: REQUEST PHONE OTP PAIRING CODE ────────────────────────────────────
export const getPairingCode = onRequest({ cors: true }, async (req, res) => {
  const guesthouseId = req.query.guesthouseId as string || req.body.guesthouseId as string;
  const phone = req.query.phone as string || req.body.phone as string;

  if (!guesthouseId || !phone) {
    res.status(400).json({ error: 'guesthouseId and phone are required' });
    return;
  }

  const normalizedPhone = phone.replace(/[^0-9]/g, '');

  try {
    const { state, saveCreds } = await useFirestoreAuthState(guesthouseId);
    
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'info' }),
      browser: ['macOS', 'Chrome', '125.0.0.3'],
      printQRInTerminal: false
    });

    let codeSent = false;

    // Timeout safety net (25 seconds)
    const timeoutId = setTimeout(() => {
      if (!codeSent && !res.headersSent) {
        codeSent = true;
        try { sock.end(undefined); } catch {}
        res.status(504).json({ error: 'Timeout generating OTP pairing code. Please try again.' });
      }
    }, 25000);

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (res.headersSent) return;

      if (connection === 'open') {
        clearTimeout(timeoutId);
        await db.collection('whatsapp_sessions').doc(guesthouseId).set({
          status: 'LINKED',
          pairingCode: null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        
        try { sock.end(undefined); } catch {}
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isConnectionFailure = lastDisconnect?.error?.message?.includes('Connection Failure') || 
                                    lastDisconnect?.error?.message?.includes('handshake') ||
                                    statusCode === 500;

        if ((isLoggedOut || isConnectionFailure) && !codeSent) {
          clearTimeout(timeoutId);
          try { await db.collection('whatsapp_sessions').doc(guesthouseId).delete(); } catch {}
          res.status(401).json({ error: 'Connection failure setting up pairing session. Please retry.' });
          try { sock.end(undefined); } catch {}
        }
      }
    });

    // Wait 1.5 seconds to load credentials and issue pairing request
    setTimeout(async () => {
      if (res.headersSent) return;
      try {
        const code = await sock.requestPairingCode(normalizedPhone);
        codeSent = true;
        clearTimeout(timeoutId);

        await db.collection('whatsapp_sessions').doc(guesthouseId).set({
          status: 'AWAITING_SCAN',
          pairingCode: code,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        res.status(200).json({ pairingCode: code, status: 'AWAITING_SCAN' });
      } catch (err: any) {
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to request WhatsApp pairing code', details: err.message });
        }
      }
    }, 1500);

  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});
