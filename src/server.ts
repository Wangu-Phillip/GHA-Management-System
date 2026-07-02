import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';
import { generateFuturePredictions } from './services/ai';
import {
  sendWhatsAppMessage,
  runCheckoutReviewAutomation,
  executeMarketingCampaign,
} from './services/whatsapp';
import { compileReportData, convertToCSV } from './services/reports';
import {
  fetchAdInsights,
  fetchCampaigns,
  createCampaign,
  updateCampaignBudget,
  generateMockInsights,
  generateMockCampaigns,
} from './services/facebook';
import { getOrGenerateAdvisorAdvice } from './services/facebook_ai';


export type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY?: string;
  WHATSAPP_VERIFY_TOKEN?: string;
  ASSETS?: Fetcher;
};

export type Variables = {
  tenantId: string;
  prisma: PrismaClient;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ---- API middleware: tenant + prisma ----
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  let tenantId = 'tenant-1';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const match = token.match(/tenant-[a-zA-Z0-9-]+/);
    if (match) tenantId = match[0];
  }
  c.set('tenantId', tenantId);

  if (!c.env?.DB) {
    return c.json({ error: 'D1 database binding (DB) is not configured' }, 500);
  }
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  c.set('prisma', prisma);

  await next();
});

// ==========================================
// Health
// ==========================================
app.get('/api/health', async (c) => {
  let dbConnected = false;
  try {
    await c.var.prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }
  return c.json({
    status: 'ok',
    dbConnected,
    mode: dbConnected ? 'SQLITE_D1_EDGE' : 'LOCAL_DEMO_STATE',
    timestamp: new Date().toISOString(),
    contextTenantId: c.var.tenantId,
  });
});

// ==========================================
// Auth
// ==========================================
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Email and password are required' }, 400);

    const user = await c.var.prisma.user.findUnique({ where: { email } });
    if (!user || user.passwordHash !== password) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const guesthouse = user.guesthouseId
      ? await c.var.prisma.guesthouse.findUnique({ where: { id: user.guesthouseId } })
      : null;

    const tenantId = user.guesthouseId || 'tenant-1';

    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        guesthouseId: user.guesthouseId,
      },
      guesthouse,
      token: `mock-jwt-token-for-${user.id}-${tenantId}-${Date.now()}`,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/auth/register', async (c) => {
  try {
    const { email, password, name, guesthouseName } = await c.req.json();
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    const existing = await c.var.prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: 'User already exists' }, 400);

    let guesthouseId: string | null = null;
    if (guesthouseName) {
      const gh = await c.var.prisma.guesthouse.create({
        data: { name: guesthouseName, subscriptionStatus: 'ACTIVE' },
      });
      guesthouseId = gh.id;
    }

    const user = await c.var.prisma.user.create({
      data: {
        email,
        passwordHash: password,
        name,
        role: guesthouseId ? 'TENANT_ADMIN' : 'SUPER_ADMIN',
        guesthouseId,
      },
    });

    return c.json(
      {
        message: 'Account registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          guesthouseId: user.guesthouseId,
        },
      },
      201
    );
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// Super admin
// ==========================================
app.get('/api/super/guesthouses', async (c) => {
  try {
    const list = await c.var.prisma.guesthouse.findMany();
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/super/guesthouses', async (c) => {
  try {
    const { name, subscriptionStatus, subscriptionEndsAt } = await c.req.json();
    if (!name) return c.json({ error: 'Guesthouse name is required' }, 400);
    const gh = await c.var.prisma.guesthouse.create({
      data: {
        name,
        subscriptionStatus: subscriptionStatus || 'ACTIVE',
        subscriptionEndsAt: subscriptionEndsAt ? new Date(subscriptionEndsAt) : undefined,
      },
    });
    return c.json(gh, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/super/guesthouses/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    if (body.subscriptionEndsAt) body.subscriptionEndsAt = new Date(body.subscriptionEndsAt);
    if (body.rooms && Array.isArray(body.rooms)) body.rooms = JSON.stringify(body.rooms);
    const gh = await c.var.prisma.guesthouse.update({ where: { id }, data: body });
    return c.json(gh);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/super/guesthouses/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await c.var.prisma.guesthouse.delete({ where: { id } });
    return c.json({ message: 'Guesthouse suspended successfully', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/super/stats', async (c) => {
  try {
    const [guesthouses, bookings, users] = await Promise.all([
      c.var.prisma.guesthouse.findMany(),
      c.var.prisma.booking.findMany(),
      c.var.prisma.user.findMany(),
    ]);
    const totalRevenue = bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const activeTenants = guesthouses.filter((g) => g.subscriptionStatus === 'ACTIVE').length;
    return c.json({
      totalGuesthouses: guesthouses.length,
      activeSubscriptions: activeTenants,
      totalGlobalRevenue: totalRevenue,
      totalUsersCount: users.length,
      totalBookingsCount: bookings.length,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// Bookings
// ==========================================
app.get('/api/bookings', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);
  try {
    const list = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/bookings', async (c) => {
  try {
    const body = await c.req.json();
    const {
      guesthouseId,
      customerName,
      customerPhone,
      customerEmail,
      customerCountry,
      roomName,
      checkIn,
      checkOut,
      totalAmount,
      status,
    } = body;
    if (
      !guesthouseId ||
      !customerName ||
      !customerPhone ||
      !roomName ||
      !checkIn ||
      !checkOut ||
      totalAmount === undefined
    ) {
      return c.json({ error: 'All booking fields are required' }, 400);
    }

    const created = await c.var.prisma.booking.create({
      data: {
        guesthouseId,
        customerName,
        customerEmail,
        customerPhone,
        customerCountry: customerCountry || 'Botswana (local)',
        roomName,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalAmount: Number(totalAmount),
        status: status || 'CONFIRMED',
      },
    });

    // Upsert customer.
    const phoneClean = customerPhone.trim();
    await c.var.prisma.customer.upsert({
      where: { guesthouseId_phone: { guesthouseId, phone: phoneClean } },
      create: {
        guesthouseId,
        name: customerName,
        email: customerEmail,
        phone: phoneClean,
        customerCountry: customerCountry || 'Botswana (local)',
        optInPromo: false,
      },
      update: {
        name: customerName,
        ...(customerEmail ? { email: customerEmail } : {}),
        ...(customerCountry ? { customerCountry } : {}),
      },
    });

    return c.json(created, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    if (body.checkIn) body.checkIn = new Date(body.checkIn);
    if (body.checkOut) body.checkOut = new Date(body.checkOut);
    if (body.totalAmount !== undefined) body.totalAmount = Number(body.totalAmount);
    const updated = await c.var.prisma.booking.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await c.var.prisma.booking.delete({ where: { id } });
    return c.json({ message: 'Booking deleted successfully', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/bookings/import', async (c) => {
  try {
    const { guesthouseId, bookings } = await c.req.json();
    if (!guesthouseId || !Array.isArray(bookings)) {
      return c.json({ error: 'guesthouseId and bookings list array are required' }, 400);
    }

    const imported: any[] = [];
    for (const b of bookings) {
      if (!b.customerName || !b.customerPhone || !b.roomName || !b.checkIn || !b.checkOut) continue;
      const created = await c.var.prisma.booking.create({
        data: {
          guesthouseId,
          customerName: b.customerName,
          customerEmail: b.customerEmail,
          customerPhone: b.customerPhone,
          customerCountry: b.customerCountry || 'Botswana (local)',
          roomName: b.roomName,
          checkIn: new Date(b.checkIn),
          checkOut: new Date(b.checkOut),
          totalAmount: Number(b.totalAmount || 150),
          status: b.status || 'CONFIRMED',
        },
      });
      imported.push(created);
    }
    return c.json({ message: `Successfully imported ${imported.length} bookings`, imported }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// Customers
// ==========================================
app.get('/api/customers', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);
  try {
    const list = await c.var.prisma.customer.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/customers', async (c) => {
  try {
    const body = await c.req.json();
    const { guesthouseId, name, email, phone, customerCountry, optInPromo, gender, ageGroup, groupStyle } = body;
    if (!guesthouseId || !name || !phone) {
      return c.json({ error: 'guesthouseId, name, and phone are required' }, 400);
    }
    const phoneClean = phone.trim();
    const customer = await c.var.prisma.customer.upsert({
      where: { guesthouseId_phone: { guesthouseId, phone: phoneClean } },
      create: {
        guesthouseId,
        name,
        email,
        phone: phoneClean,
        customerCountry: customerCountry || 'Botswana (local)',
        optInPromo: !!optInPromo,
        gender,
        ageGroup,
        groupStyle,
      },
      update: {
        name,
        ...(email ? { email } : {}),
        ...(customerCountry ? { customerCountry } : {}),
        ...(gender ? { gender } : {}),
        ...(ageGroup ? { ageGroup } : {}),
        ...(groupStyle ? { groupStyle } : {}),
        optInPromo: !!optInPromo,
      },
    });
    return c.json(customer, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/customers/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const { name, email, phone, customerCountry, optInPromo, gender, ageGroup, groupStyle } = body;

    // Load current customer profile to get their guesthouseId and current phone
    const currentCustomer = await c.var.prisma.customer.findUnique({ where: { id } });
    if (!currentCustomer) {
      return c.json({ error: 'Customer profile not found' }, 404);
    }

    const guesthouseId = currentCustomer.guesthouseId;
    const cleanPhone = phone ? phone.trim() : currentCustomer.phone;

    // If the phone is being changed, check for duplicates in this guesthouse
    if (phone && cleanPhone !== currentCustomer.phone) {
      const duplicate = await c.var.prisma.customer.findFirst({
        where: {
          guesthouseId,
          phone: cleanPhone,
          NOT: { id },
        },
      });

      if (duplicate) {
        return c.json({ error: `A profile with phone number "${cleanPhone}" already exists in this registry.` }, 400);
      }
    }

    const updated = await c.var.prisma.customer.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        email,
        phone: cleanPhone,
        customerCountry: customerCountry || 'Botswana (local)',
        optInPromo: typeof optInPromo === 'boolean' ? optInPromo : undefined,
        gender,
        ageGroup,
        groupStyle,
      },
    });
    return c.json(updated);
  } catch (err: any) {
    if (err.code === 'P2002') {
      return c.json({ error: 'Another customer with this phone number is already registered under this guesthouse.' }, 400);
    }
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/customers/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await c.var.prisma.customer.delete({ where: { id } });
    return c.json({ message: 'Customer registry entry deleted', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// Marketing
// ==========================================
app.get('/api/marketing/campaigns', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
  try {
    const list = await c.var.prisma.campaign.findMany({ where: { guesthouseId } });
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/marketing/whatsapp-logs', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
  try {
    const logs = await c.var.prisma.messageLog.findMany({ where: { guesthouseId } });
    return c.json(logs);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/marketing/campaigns', async (c) => {
  try {
    const { guesthouseId, campaignName, messageTemplate, customerIds } = await c.req.json();
    if (!guesthouseId || !campaignName || !messageTemplate) {
      return c.json({ error: 'guesthouseId, campaignName, and messageTemplate are required' }, 400);
    }
    const report = await executeMarketingCampaign(
      c.var.prisma,
      guesthouseId,
      campaignName,
      messageTemplate,
      customerIds
    );
    return c.json({
      message: `Campaign dispatch completed. Transmitted ${report.sent} messages of ${report.totalOptIn} opted-in subscribers.`,
      report,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/marketing/whatsapp-send', async (c) => {
  try {
    const { guesthouseId, phone, content, messageType, bookingId } = await c.req.json();
    if (!guesthouseId || !phone || !content) {
      return c.json({ error: 'guesthouseId, phone, and content are required' }, 400);
    }
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    const waConfig =
      gh?.whatsappPhoneId && gh?.whatsappToken
        ? {
            phoneId: gh.whatsappPhoneId,
            token: gh.whatsappToken,
            businessId: gh.whatsappBusinessId || undefined,
          }
        : undefined;
    const result = await sendWhatsAppMessage(c.var.prisma, {
      guesthouseId,
      phone,
      content,
      messageType: messageType || 'GENERAL',
      bookingId,
      config: waConfig,
    });
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/marketing/whatsapp-settings', async (c) => {
  try {
    const { guesthouseId, whatsappPhoneId, whatsappToken, whatsappBusinessId, rooms, reviewTriggerTime } =
      await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
    const data: any = {
      whatsappPhoneId,
      whatsappToken,
      whatsappBusinessId,
    };
    if (rooms) data.rooms = Array.isArray(rooms) ? JSON.stringify(rooms) : rooms;
    if (reviewTriggerTime) data.reviewTriggerTime = reviewTriggerTime;
    const updated = await c.var.prisma.guesthouse.update({ where: { id: guesthouseId }, data });
    return c.json({
      message: 'Guesthouse marketing settings and custom properties updated successfully',
      guesthouse: updated,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/marketing/whatsapp-automations/trigger-review', async (c) => {
  try {
    const { guesthouseId } = await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
    const outcome = await runCheckoutReviewAutomation(c.var.prisma, guesthouseId);
    return c.json({
      message: `Daily checkout review scanner completed successfully for today.`,
      processedCheckoutsTodayCount: outcome.processed,
      messagesSuccessfullyDispatchedCount: outcome.sent,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// WhatsApp Webhook — Meta Cloud API
// ==========================================

// GET /api/webhooks/whatsapp — Meta challenge verification handshake
app.get('/api/webhooks/whatsapp', (c) => {
  const mode = c.req.query('hub.mode');
  const token = c.req.query('hub.verify_token');
  const challenge = c.req.query('hub.challenge');
  const verifyToken = c.env?.WHATSAPP_VERIFY_TOKEN || 'gha-whatsapp-verify-2026';

  if (mode === 'subscribe' && token === verifyToken) {
    return new Response(challenge || '', { status: 200 });
  }
  return c.json({ error: 'Verification token mismatch' }, 403);
});

// POST /api/webhooks/whatsapp — Incoming status updates & inbound messages
app.post('/api/webhooks/whatsapp', async (c) => {
  try {
    // Set up DB access manually (webhook is outside /api/* middleware auth)
    if (!c.env?.DB) return c.json({ error: 'DB not configured' }, 500);
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });

    const body: any = await c.req.json();

    if (body.object !== 'whatsapp_business_account') {
      return c.json({ status: 'ignored' }, 200);
    }

    const entries = body.entry || [];
    for (const entry of entries) {
      const changes = entry.changes || [];
      for (const change of changes) {
        const value = change.value || {};
        const phoneNumberId: string = value.metadata?.phone_number_id || '';

        // ── 1. Status update events (sent / delivered / read / failed) ─────────
        const statuses: any[] = value.statuses || [];
        for (const st of statuses) {
          const wamid: string = st.id || '';
          const newStatus: string = (st.status || '').toUpperCase(); // SENT | DELIVERED | READ | FAILED
          const recipientPhone: string = (st.recipient_id || '').replace(/\D/g, '');

          if (!newStatus) continue;

          // Step 1: try to find by exact wamid
          let matchingLog: any = null;
          if (wamid) {
            matchingLog = await (prisma as any).messageLog.findFirst({
              where: { wamid, direction: 'OUTBOUND' },
              orderBy: { createdAt: 'desc' },
            });
          }

          // Step 2: fallback — find most recent OUTBOUND log to this phone number
          if (!matchingLog && recipientPhone) {
            // Get all recent outbound logs and match by stripping non-digits
            const recentLogs: any[] = await (prisma as any).messageLog.findMany({
              where: { direction: 'OUTBOUND' },
              orderBy: { createdAt: 'desc' },
              take: 200,
            });
            matchingLog = recentLogs.find(
              (l: any) => l.phone.replace(/\D/g, '').endsWith(recipientPhone.slice(-9))
            ) || null;
          }

          if (matchingLog) {
            const statusPriority: Record<string, number> = {
              PENDING: 0, SENT: 1, DELIVERED: 2, READ: 3, FAILED: -1,
            };
            const currentPriority = statusPriority[matchingLog.status] ?? 0;
            const incomingPriority = statusPriority[newStatus] ?? 0;
            // Only upgrade status (never downgrade READ → SENT, etc.)
            if (incomingPriority > currentPriority || newStatus === 'FAILED') {
              await (prisma as any).messageLog.update({
                where: { id: matchingLog.id },
                data: { status: newStatus, ...(wamid ? { wamid } : {}) },
              });
            }
          }
        }

        // ── 2. Inbound customer message events ────────────────────────────────
        const messages: any[] = value.messages || [];
        const contacts: any[] = value.contacts || [];

        for (const msg of messages) {
          if (msg.type !== 'text') continue;

          const fromPhone: string = msg.from || '';
          const msgText: string = msg.text?.body || '';
          const wamid: string = msg.id || '';
          const senderName: string =
            contacts.find((c: any) => c.wa_id === fromPhone)?.profile?.name || 'Customer';

          // Look up guesthouseId from any outbound message log to this phone
          const outboundRef = await (prisma as any).messageLog.findFirst({
            where: {
              phone: { contains: fromPhone.slice(-8) },
              direction: 'OUTBOUND',
            },
            orderBy: { createdAt: 'desc' },
          });

          const guesthouseId: string = outboundRef?.guesthouseId || 'tenant-1';

          // Log the inbound reply
          await (prisma as any).messageLog.create({
            data: {
              guesthouseId,
              phone: fromPhone,
              wamid,
              direction: 'INBOUND',
              messageType: 'GENERAL',
              content: msgText,
              status: 'READ',
            },
          });

          // ── 3. Showed Up / Conversion detection ────────────────────────────
          // Detect positive intent keywords in the reply
          const positiveKeywords = [
            'book', 'booking', 'reserve', 'reservation', 'yes', 'interested',
            'confirm', 'coming', 'sounds great', 'perfect', 'count me in',
            'great offer', 'we will come', 'see you', 'noted', 'i will',
          ];
          const lowerMsg = msgText.toLowerCase();
          const isPositive = positiveKeywords.some((kw) => lowerMsg.includes(kw));

          if (isPositive) {
            // Find or create the customer record
            let customer = await (prisma as any).customer.findFirst({
              where: { guesthouseId, phone: { contains: fromPhone.slice(-8) } },
            });
            if (!customer) {
              customer = await (prisma as any).customer.create({
                data: {
                  guesthouseId,
                  name: senderName,
                  phone: fromPhone,
                  email: '',
                  optInPromo: true,
                },
              });
            }

            // Check if booking already exists for this phone in the near-future
            const upcomingBooking = await (prisma as any).booking.findFirst({
              where: {
                guesthouseId,
                customerPhone: { contains: fromPhone.slice(-8) },
                checkIn: { gte: new Date() },
              },
            });

            // Create a CONFIRMED follow-up booking if none found
            if (!upcomingBooking) {
              const checkIn = new Date();
              checkIn.setDate(checkIn.getDate() + 3);
              const checkOut = new Date(checkIn);
              checkOut.setDate(checkOut.getDate() + 2);
              await (prisma as any).booking.create({
                data: {
                  guesthouseId,
                  customerName: senderName,
                  customerEmail: customer.email || 'guest@example.com',
                  customerPhone: fromPhone,
                  roomName: 'TBC — Awaiting Guest Confirmation',
                  checkIn,
                  checkOut,
                  status: 'CONFIRMED',
                  totalAmount: 0,
                  notes: `Auto-created from WhatsApp inbound reply: "${msgText.substring(0, 120)}"`,
                },
              });
            }
          }
        }
      }
    }

    return c.json({ status: 'ok' }, 200);
  } catch (err: any) {
    console.error('WhatsApp webhook processing error:', err.message);
    // Always return 200 to prevent Meta from disabling the webhook
    return c.json({ status: 'ok' }, 200);
  }
});

// ==========================================
// Employees / Guesthouse settings
// ==========================================
app.get('/api/employees', async (c) => {
  try {
    const guesthouseId = c.req.query('guesthouseId');
    if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);
    const users = await c.var.prisma.user.findMany({
      where: { guesthouseId, NOT: { role: 'SUPER_ADMIN' } },
    });
    return c.json(users);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/employees', async (c) => {
  try {
    const { name, email, role, password, guesthouseId } = await c.req.json();
    if (!name || !email || !role || !guesthouseId) {
      return c.json({ error: 'name, email, role, and guesthouseId are required' }, 400);
    }
    const existing = await c.var.prisma.user.findUnique({ where: { email } });
    if (existing) return c.json({ error: 'A user with this email already exists' }, 400);
    const created = await c.var.prisma.user.create({
      data: {
        name,
        email,
        role,
        passwordHash: password || 'sales123',
        guesthouseId,
      },
    });
    return c.json(created, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/employees/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const updated = await c.var.prisma.user.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/employees/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await c.var.prisma.user.delete({ where: { id } });
    return c.json({ message: 'Employee deleted successfully', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/guesthouse/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    if (body.rooms && Array.isArray(body.rooms)) body.rooms = JSON.stringify(body.rooms);
    if (body.subscriptionEndsAt) body.subscriptionEndsAt = new Date(body.subscriptionEndsAt);
    const updated = await c.var.prisma.guesthouse.update({ where: { id }, data: body });
    return c.json({ message: 'Guesthouse details updated successfully', guesthouse: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/guesthouse/:id', async (c) => {
  const id = c.req.param('id');
  try {
    // onDelete: Cascade in schema handles dependents.
    const deleted = await c.var.prisma.guesthouse.delete({ where: { id } });
    return c.json({
      message: 'Guesthouse and all associated data deleted successfully',
      deleted,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// AI forecast
// ==========================================
app.get('/api/analytics/ai-forecast', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);
  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);
    const bookings = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    const forecast = await generateFuturePredictions(bookings as any, gh.name, c.env?.GEMINI_API_KEY);
    return c.json(forecast);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ==========================================
// Reports
// ==========================================
app.get('/api/reports/compiled', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  const days = c.req.query('days');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);
  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);
    const [bookings, customers, logs] = await Promise.all([
      c.var.prisma.booking.findMany({ where: { guesthouseId } }),
      c.var.prisma.customer.findMany({ where: { guesthouseId } }),
      c.var.prisma.messageLog.findMany({ where: { guesthouseId } }),
    ]);
    const report = compileReportData({
      guesthouseName: gh.name,
      bookings: bookings as any,
      customers: customers as any,
      logs: logs as any,
      days: days ? Number(days) : 30,
    });
    return c.json(report);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/reports/download-csv', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) {
    c.status(400);
    return c.text('guesthouseId is required');
  }
  try {
    const bookings = await c.var.prisma.booking.findMany({ where: { guesthouseId } });
    const rows = bookings.map((b) => ({
      id: b.id,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      roomName: b.roomName,
      checkIn: b.checkIn.toISOString().split('T')[0],
      checkOut: b.checkOut.toISOString().split('T')[0],
      totalAmount: b.totalAmount,
      status: b.status,
    }));
    const csv = convertToCSV(
      ['Booking ID', 'Customer Name', 'Phone Number', 'Room Assigned', 'Check-In Date', 'Check-Out Date', 'Price Collected', 'Status'],
      ['id', 'customerName', 'customerPhone', 'roomName', 'checkIn', 'checkOut', 'totalAmount', 'status'],
      rows
    );
    c.header('Content-Type', 'text/csv');
    c.header('Content-Disposition', 'attachment; filename="guesthouse_bookings_report.csv"');
    return c.text(csv, 200);
  } catch (err: any) {
    c.status(500);
    return c.text(err.message);
  }
});

// ==========================================
// Facebook Ads Integration
// ==========================================

// Helper: resolve date range string to since/until YYYY-MM-DD
function getDateRange(days: number): { since: string; until: string } {
  const until = new Date();
  const since = new Date();
  since.setDate(since.getDate() - days);
  return {
    since: since.toISOString().split('T')[0],
    until: until.toISOString().split('T')[0],
  };
}

// GET /api/facebook/account — get connected Ad Account for this guesthouse
app.get('/api/facebook/account', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
  try {
    const account = await (c.var.prisma as any).facebookAdAccount.findUnique({
      where: { guesthouseId },
    });
    return c.json(account || null);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PUT /api/facebook/account — save / update Ad Account credentials
app.put('/api/facebook/account', async (c) => {
  try {
    const { guesthouseId, adAccountId, accessToken, pageId, accountName, currency, timezone } =
      await c.req.json();
    if (!guesthouseId || !adAccountId || !accessToken) {
      return c.json({ error: 'guesthouseId, adAccountId, and accessToken are required' }, 400);
    }
    const account = await (c.var.prisma as any).facebookAdAccount.upsert({
      where: { guesthouseId },
      create: { guesthouseId, adAccountId, accessToken, pageId, accountName, currency, timezone },
      update: { adAccountId, accessToken, pageId, accountName, currency, timezone, updatedAt: new Date() },
    });
    return c.json({ message: 'Ad account connected successfully', account });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/facebook/sync — pull latest data from Graph API → normalise → upsert to D1
app.post('/api/facebook/sync', async (c) => {
  try {
    const { guesthouseId, days = 30 } = await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

    const account = await (c.var.prisma as any).facebookAdAccount.findUnique({
      where: { guesthouseId },
    });

    const { since, until } = getDateRange(Number(days));
    let insights: any[];
    let campaigns: any[];
    const isMockMode = !account || !account.accessToken || account.accessToken === 'DEMO_MODE';

    if (isMockMode) {
      // Use synthetic data when no real credentials are configured
      insights = generateMockInsights(account?.adAccountId || 'act_demo');
      campaigns = generateMockCampaigns();
    } else {
      // Real Graph API calls
      insights = await fetchAdInsights(account.accessToken, account.adAccountId, {
        since,
        until,
        level: 'campaign',
      });
      campaigns = await fetchCampaigns(account.accessToken, account.adAccountId);
    }

    // Upsert campaigns into D1
    for (const camp of campaigns) {
      await (c.var.prisma as any).facebookCampaign.upsert({
        where: { id: camp.id },
        create: {
          id: camp.id,
          guesthouseId,
          adAccountId: account?.adAccountId || 'act_demo',
          name: camp.name,
          status: camp.status,
          objective: camp.objective,
          dailyBudget: camp.daily_budget ? Number(camp.daily_budget) / 100 : null,
          lifetimeBudget: camp.lifetime_budget ? Number(camp.lifetime_budget) / 100 : null,
          startTime: camp.start_time ? new Date(camp.start_time) : null,
          stopTime: camp.stop_time ? new Date(camp.stop_time) : null,
        },
        update: {
          name: camp.name,
          status: camp.status,
          dailyBudget: camp.daily_budget ? Number(camp.daily_budget) / 100 : null,
          syncedAt: new Date(),
        },
      });
    }

    // Upsert normalised insights into D1
    let upsertedCount = 0;
    for (const ins of insights) {
      await (c.var.prisma as any).facebookInsight.upsert({
        where: {
          adAccountId_objectId_objectLevel_date: {
            adAccountId: account?.adAccountId || 'act_demo',
            objectId: ins.objectId,
            objectLevel: ins.objectLevel,
            date: ins.date,
          },
        },
        create: {
          guesthouseId,
          adAccountId: account?.adAccountId || 'act_demo',
          objectId: ins.objectId,
          objectLevel: ins.objectLevel,
          objectName: ins.objectName,
          date: ins.date,
          impressions: ins.impressions,
          clicks: ins.clicks,
          spend: ins.spend,
          reach: ins.reach,
          conversions: ins.conversions,
          cpm: ins.cpm,
          ctr: ins.ctr,
          cpc: ins.cpc,
          roas: ins.roas,
        },
        update: {
          impressions: ins.impressions,
          clicks: ins.clicks,
          spend: ins.spend,
          reach: ins.reach,
          conversions: ins.conversions,
          cpm: ins.cpm,
          ctr: ins.ctr,
          cpc: ins.cpc,
          roas: ins.roas,
          syncedAt: new Date(),
        },
      });
      upsertedCount++;
    }

    return c.json({
      message: `Sync complete. Upserted ${upsertedCount} insight rows and ${campaigns.length} campaigns.`,
      mode: isMockMode ? 'DEMO_MOCK' : 'LIVE_GRAPH_API',
      insightCount: upsertedCount,
      campaignCount: campaigns.length,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/facebook/campaigns — list campaigns from D1
app.get('/api/facebook/campaigns', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);
  try {
    const campaigns = await (c.var.prisma as any).facebookCampaign.findMany({
      where: { guesthouseId },
      orderBy: { createdAt: 'desc' },
    });
    return c.json(campaigns);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/facebook/campaigns — create a new campaign via Graph API (or demo mode)
app.post('/api/facebook/campaigns', async (c) => {
  try {
    const { guesthouseId, name, objective, dailyBudget, lifetimeBudget, startTime, stopTime } =
      await c.req.json();
    if (!guesthouseId || !name || !objective) {
      return c.json({ error: 'guesthouseId, name, and objective are required' }, 400);
    }

    const account = await (c.var.prisma as any).facebookAdAccount.findUnique({
      where: { guesthouseId },
    });

    const isMockMode = !account || !account.accessToken || account.accessToken === 'DEMO_MODE';
    const campaignId = isMockMode
      ? `mock-camp-${Date.now()}`
      : (await createCampaign(account.accessToken, account.adAccountId, {
          name,
          objective,
          dailyBudget,
          lifetimeBudget,
          startTime,
          stopTime,
        })).id;

    const created = await (c.var.prisma as any).facebookCampaign.create({
      data: {
        id: campaignId,
        guesthouseId,
        adAccountId: account?.adAccountId || 'act_demo',
        name,
        status: 'PAUSED',
        objective,
        dailyBudget: dailyBudget ? Number(dailyBudget) : null,
        lifetimeBudget: lifetimeBudget ? Number(lifetimeBudget) : null,
        startTime: startTime ? new Date(startTime) : null,
        stopTime: stopTime ? new Date(stopTime) : null,
      },
    });

    return c.json({ message: 'Campaign created successfully', campaign: created, mode: isMockMode ? 'DEMO' : 'LIVE' }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// PATCH /api/facebook/campaigns/:id/budget — update campaign daily budget
app.patch('/api/facebook/campaigns/:id/budget', async (c) => {
  const id = c.req.param('id');
  try {
    const { guesthouseId, dailyBudget } = await c.req.json();
    if (!guesthouseId || dailyBudget === undefined) {
      return c.json({ error: 'guesthouseId and dailyBudget are required' }, 400);
    }

    const account = await (c.var.prisma as any).facebookAdAccount.findUnique({
      where: { guesthouseId },
    });

    const isMockMode = !account || !account.accessToken || account.accessToken === 'DEMO_MODE';
    if (!isMockMode) {
      await updateCampaignBudget(account.accessToken, id, Math.round(Number(dailyBudget) * 100));
    }

    const updated = await (c.var.prisma as any).facebookCampaign.update({
      where: { id },
      data: { dailyBudget: Number(dailyBudget), syncedAt: new Date() },
    });

    return c.json({ message: 'Budget updated successfully', campaign: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/facebook/insights — query insight rows with optional filters
app.get('/api/facebook/insights', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  const days = c.req.query('days') || '30';
  const level = c.req.query('level') || 'CAMPAIGN';
  const campaignId = c.req.query('campaignId');

  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

  try {
    const { since } = getDateRange(Number(days));
    const where: any = {
      guesthouseId,
      objectLevel: level.toUpperCase(),
      date: { gte: since },
    };
    if (campaignId) where.objectId = campaignId;

    const rows = await (c.var.prisma as any).facebookInsight.findMany({
      where,
      orderBy: { date: 'asc' },
    });
    return c.json(rows);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// GET /api/facebook/ai-advisor — return cached (or freshly generated) AI advice
app.get('/api/facebook/ai-advisor', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  const windowDays = Number(c.req.query('windowDays') || '30');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

  try {
    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);

    const advice = await getOrGenerateAdvisorAdvice(
      c.var.prisma,
      guesthouseId,
      windowDays,
      gh.name,
      c.env?.GEMINI_API_KEY,
      false
    );
    return c.json(advice);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// POST /api/facebook/ai-advisor/regenerate — force-invalidate cache and regenerate
app.post('/api/facebook/ai-advisor/regenerate', async (c) => {
  try {
    const { guesthouseId, windowDays = 30 } = await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

    const gh = await c.var.prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);

    const advice = await getOrGenerateAdvisorAdvice(
      c.var.prisma,
      guesthouseId,
      Number(windowDays),
      gh.name,
      c.env?.GEMINI_API_KEY,
      true // forceRegenerate
    );
    return c.json(advice);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;
