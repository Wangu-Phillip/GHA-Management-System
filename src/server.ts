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

export type Bindings = {
  DB: D1Database;
  GEMINI_API_KEY?: string;
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
    const updated = await c.var.prisma.customer.update({ where: { id }, data: body });
    return c.json(updated);
  } catch (err: any) {
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

export default app;
