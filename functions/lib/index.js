"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPairingCode = exports.getSessionStatus = exports.sendMessage = exports.getQrCode = void 0;
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const QRCode = __importStar(require("qrcode"));
const pino_1 = __importDefault(require("pino"));
admin.initializeApp();
const db = admin.firestore();
// ── CUSTOM FIRESTORE AUTH STATE PROVIDER ─────────────────────────────────────
// Serializes and stores Baileys connection credentials and keys inside a single
// Firestore document to reduce database operations and fit within serverless execution.
async function useFirestoreAuthState(guesthouseId) {
    const docRef = db.collection('whatsapp_sessions').doc(guesthouseId);
    const getSessionData = async () => {
        const snap = await docRef.get();
        if (!snap.exists)
            return { creds: null, keys: {} };
        const data = snap.data() || {};
        const parsedCreds = data.credsJson ? JSON.parse(data.credsJson, baileys_1.BufferJSON.reviver) : null;
        const parsedKeys = data.keysJson ? JSON.parse(data.keysJson, baileys_1.BufferJSON.reviver) : {};
        return { creds: parsedCreds, keys: parsedKeys };
    };
    const { creds: initialCreds, keys } = await getSessionData();
    const creds = initialCreds || (0, baileys_1.initAuthCreds)();
    if (!initialCreds) {
        await docRef.set({
            credsJson: JSON.stringify(creds, baileys_1.BufferJSON.replacer),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }
    const saveCreds = async () => {
        await docRef.set({
            credsJson: JSON.stringify(creds, baileys_1.BufferJSON.replacer),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    };
    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    const dict = {};
                    for (const id of ids) {
                        const key = `${type}-${id}`;
                        if (keys[key]) {
                            dict[id] = keys[key];
                        }
                    }
                    return dict;
                },
                set: async (data) => {
                    for (const type in data) {
                        for (const id in data[type]) {
                            const val = data[type][id];
                            const key = `${type}-${id}`;
                            if (val) {
                                keys[key] = val;
                            }
                            else {
                                delete keys[key];
                            }
                        }
                    }
                    await docRef.set({
                        keysJson: JSON.stringify(keys, baileys_1.BufferJSON.replacer),
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
            }
        },
        saveCreds
    };
}
// ── API 1: GENERATE/GET QR CODE FOR ONBOARDING ──────────────────────────────
exports.getQrCode = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    const guesthouseId = req.query.guesthouseId || req.body.guesthouseId;
    if (!guesthouseId) {
        res.status(400).json({ error: 'guesthouseId is required' });
        return;
    }
    try {
        const { state, saveCreds } = await useFirestoreAuthState(guesthouseId);
        const sock = (0, baileys_1.default)({
            auth: state,
            logger: (0, pino_1.default)({ level: 'info' }),
            browser: ['macOS', 'Chrome', '125.0.0.3'],
            printQRInTerminal: false
        });
        let qrSent = false;
        // Timeout safety net (25 seconds)
        const timeoutId = setTimeout(() => {
            if (!qrSent && !res.headersSent) {
                qrSent = true;
                try {
                    sock.end(undefined);
                }
                catch { }
                res.status(504).json({ error: 'Timeout waiting for WhatsApp QR generation. Please try again.' });
            }
        }, 25000);
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (res.headersSent)
                return;
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
                    try {
                        sock.end(undefined);
                    }
                    catch { }
                }
                catch (err) {
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
                try {
                    sock.end(undefined);
                }
                catch { }
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const isLoggedOut = statusCode === baileys_1.DisconnectReason.loggedOut;
                const isConnectionFailure = lastDisconnect?.error?.message?.includes('Connection Failure') ||
                    lastDisconnect?.error?.message?.includes('handshake') ||
                    statusCode === 500;
                if ((isLoggedOut || isConnectionFailure) && !qrSent) {
                    clearTimeout(timeoutId);
                    try {
                        await db.collection('whatsapp_sessions').doc(guesthouseId).delete();
                    }
                    catch (dbErr) {
                        console.error('Error deleting session document:', dbErr);
                    }
                    res.status(401).json({
                        error: 'WhatsApp connection failure. Session cleared. Please click connect again.',
                        details: lastDisconnect?.error?.message
                    });
                    try {
                        sock.end(undefined);
                    }
                    catch { }
                }
            }
        });
    }
    catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});
// ── API 2: DISPATCH OUTBOUND MESSAGE ─────────────────────────────────────────
exports.sendMessage = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
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
        const sock = (0, baileys_1.default)({
            auth: state,
            logger: (0, pino_1.default)({ level: 'info' }),
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
                }
                catch (sendErr) {
                    res.status(500).json({ error: 'Failed to transmit message', details: sendErr.message });
                    sock.end(undefined);
                }
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                if (statusCode === baileys_1.DisconnectReason.loggedOut) {
                    await db.collection('whatsapp_sessions').doc(guesthouseId).set({
                        status: 'UNLINKED',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                }
            }
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ── API 3: CHECK SESSION CONNECTION STATUS ───────────────────────────────────
exports.getSessionStatus = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    const guesthouseId = req.query.guesthouseId;
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
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// ── API 4: REQUEST PHONE OTP PAIRING CODE ────────────────────────────────────
exports.getPairingCode = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    const guesthouseId = req.query.guesthouseId || req.body.guesthouseId;
    const phone = req.query.phone || req.body.phone;
    if (!guesthouseId || !phone) {
        res.status(400).json({ error: 'guesthouseId and phone are required' });
        return;
    }
    const normalizedPhone = phone.replace(/[^0-9]/g, '');
    try {
        const { state, saveCreds } = await useFirestoreAuthState(guesthouseId);
        const sock = (0, baileys_1.default)({
            auth: state,
            logger: (0, pino_1.default)({ level: 'info' }),
            browser: ['macOS', 'Chrome', '125.0.0.3'],
            printQRInTerminal: false
        });
        let codeSent = false;
        // Timeout safety net (25 seconds)
        const timeoutId = setTimeout(() => {
            if (!codeSent && !res.headersSent) {
                codeSent = true;
                try {
                    sock.end(undefined);
                }
                catch { }
                res.status(504).json({ error: 'Timeout generating OTP pairing code. Please try again.' });
            }
        }, 25000);
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (res.headersSent)
                return;
            if (connection === 'open') {
                clearTimeout(timeoutId);
                await db.collection('whatsapp_sessions').doc(guesthouseId).set({
                    status: 'LINKED',
                    pairingCode: null,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                try {
                    sock.end(undefined);
                }
                catch { }
            }
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const isLoggedOut = statusCode === baileys_1.DisconnectReason.loggedOut;
                const isConnectionFailure = lastDisconnect?.error?.message?.includes('Connection Failure') ||
                    lastDisconnect?.error?.message?.includes('handshake') ||
                    statusCode === 500;
                if ((isLoggedOut || isConnectionFailure) && !codeSent) {
                    clearTimeout(timeoutId);
                    try {
                        await db.collection('whatsapp_sessions').doc(guesthouseId).delete();
                    }
                    catch { }
                    res.status(401).json({ error: 'Connection failure setting up pairing session. Please retry.' });
                    try {
                        sock.end(undefined);
                    }
                    catch { }
                }
            }
        });
        // Wait 1.5 seconds to load credentials and issue pairing request
        setTimeout(async () => {
            if (res.headersSent)
                return;
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
            }
            catch (err) {
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to request WhatsApp pairing code', details: err.message });
                }
            }
        }, 1500);
    }
    catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});
//# sourceMappingURL=index.js.map