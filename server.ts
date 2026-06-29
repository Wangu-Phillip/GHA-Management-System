import http from 'http';
import path from 'path';
import fs from 'fs';
import { Hono } from 'hono';
import { getRequestListener } from '@hono/node-server';
import { createServer as createViteServer } from 'vite';
import { memoryDb, getPrismaClient, getD1PrismaClient, checkDbConnection } from './src/db/prisma';
import { generateFuturePredictions } from './src/services/ai';
import { sendWhatsAppMessage, runCheckoutReviewAutomation, executeMarketingCampaign } from './src/services/whatsapp';
import { compileReportData, convertToCSV } from './src/services/reports';
import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

type Bindings = {
  DB: any;
  GEMINI_API_KEY: string;
};

type Variables = {
  tenantId: string;
  prisma?: PrismaClient;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ------------------------------------------
// MIDDLEWARES
// ------------------------------------------

// 5. Context Enforcements Middleware: Extracts tenantId from JWT tokens
app.use('/api/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  let tenantId = 'tenant-1'; // Fallback tenant ID

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Extract tenant identifier if present in token (e.g. mock-jwt-token-for-user-tenant-1)
    if (token.includes('tenant-')) {
      const match = token.match(/tenant-[a-zA-Z0-9-]+/);
      if (match) {
        tenantId = match[0];
      }
    }
  }

  // Bind tenantId to context
  c.set('tenantId', tenantId);

  // 3. Database Initialization: instantiate dynamically via Cloudflare D1 adapter syntax
  if (c.env && c.env.DB) {
    const adapter = new PrismaD1(c.env.DB);
    const prisma = new PrismaClient({ adapter });
    c.set('prisma', prisma);
  }

  await next();
});

// ==========================================
// API Routes
// ==========================================

// System Diagnostics
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    dbConnected: checkDbConnection(),
    mode: checkDbConnection() ? 'SQLITE_D1_EDGE' : 'LOCAL_DEMO_STATE',
    timestamp: new Date().toISOString(),
    contextTenantId: c.var.tenantId, // Demonstrates c.var.tenantId usage
  });
});

// ------------------------------------------
// AUTHENTICATION ENDPOINTS
// ------------------------------------------
app.post('/api/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const user = await memoryDb.user.findUnique(email);
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Direct password check for mock simplicity
    if (user.passwordHash !== password) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    let guesthouse = null;
    if (user.guesthouseId) {
      guesthouse = await memoryDb.guesthouse.findUnique(user.guesthouseId);
    }

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
      // Pass the tenant ID in the token to allow the JWT middleware to extract it dynamically
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

    const existing = await memoryDb.user.findUnique(email);
    if (existing) {
      return c.json({ error: 'User already exists' }, 400);
    }

    let guesthouseId = null;

    if (guesthouseName) {
      const gh = await memoryDb.guesthouse.create({
        name: guesthouseName,
        subscriptionStatus: 'ACTIVE',
      });
      guesthouseId = gh.id;
    }

    const user = await memoryDb.user.create({
      email,
      passwordHash: password,
      name,
      role: guesthouseId ? 'TENANT_ADMIN' : 'SUPER_ADMIN',
      guesthouseId,
    });

    return c.json({
      message: 'Account registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        guesthouseId: user.guesthouseId,
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ------------------------------------------
// SUPER ADMIN OVERSEER ENDPOINTS
// ------------------------------------------
app.get('/api/super/guesthouses', async (c) => {
  try {
    const list = await memoryDb.guesthouse.findMany();
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/super/guesthouses', async (c) => {
  try {
    const { name, subscriptionStatus, subscriptionEndsAt } = await c.req.json();
    if (!name) return c.json({ error: 'Guesthouse name is required' }, 400);

    const gh = await memoryDb.guesthouse.create({
      name,
      subscriptionStatus: subscriptionStatus || 'ACTIVE',
      subscriptionEndsAt: subscriptionEndsAt ? new Date(subscriptionEndsAt) : undefined,
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
    const gh = await memoryDb.guesthouse.update(id, body);
    return c.json(gh);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/super/guesthouses/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await memoryDb.guesthouse.delete(id);
    return c.json({ message: 'Guesthouse suspended successfully', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/super/stats', async (c) => {
  try {
    const guesthouses = await memoryDb.guesthouse.findMany();
    const bookings = await memoryDb.booking.findMany();
    const users = await memoryDb.user.findMany();

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

// ------------------------------------------
// BOOKINGS MANAGEMENT
// ------------------------------------------
app.get('/api/bookings', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);

  try {
    const list = await memoryDb.booking.findMany(guesthouseId);
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/bookings', async (c) => {
  try {
    const { guesthouseId, customerName, customerPhone, roomName, checkIn, checkOut, totalAmount, status } = await c.req.json();
    if (!guesthouseId || !customerName || !customerPhone || !roomName || !checkIn || !checkOut || totalAmount === undefined) {
      return c.json({ error: 'All booking fields are required' }, 400);
    }

    const b = await memoryDb.booking.create({
      guesthouseId,
      customerName,
      customerPhone,
      roomName,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalAmount: Number(totalAmount),
      status: status || 'CONFIRMED',
    });
    return c.json(b, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.put('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const updated = await memoryDb.booking.update(id, body);
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await memoryDb.booking.delete(id);
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
      if (!b.customerName || !b.customerPhone || !b.roomName || !b.checkIn || !b.checkOut) {
        continue;
      }
      const created = await memoryDb.booking.create({
        guesthouseId,
        customerName: b.customerName,
        customerEmail: b.customerEmail,
        customerPhone: b.customerPhone,
        roomName: b.roomName,
        checkIn: new Date(b.checkIn),
        checkOut: new Date(b.checkOut),
        totalAmount: Number(b.totalAmount || 150),
        status: b.status || 'CONFIRMED',
      });
      imported.push(created);
    }
    return c.json({ message: `Successfully imported ${imported.length} bookings`, imported }, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ------------------------------------------
// CUSTOMER DATABASE ENDPOINTS
// ------------------------------------------
app.get('/api/customers', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);

  try {
    const list = await memoryDb.customer.findMany(guesthouseId);
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/customers', async (c) => {
  try {
    const { guesthouseId, name, email, phone, optInPromo, gender, ageGroup, groupStyle } = await c.req.json();
    if (!guesthouseId || !name || !phone) {
      return c.json({ error: 'guesthouseId, name, and phone are required' }, 400);
    }

    const customer = await memoryDb.customer.create({
      guesthouseId,
      name,
      email,
      phone,
      optInPromo: !!optInPromo,
      gender,
      ageGroup,
      groupStyle
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
    const updated = await memoryDb.customer.update(id, body);
    return c.json(updated);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete('/api/customers/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const deleted = await memoryDb.customer.delete(id);
    return c.json({ message: 'Customer registry entry deleted', deleted });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ------------------------------------------
// WHATSAPP MARKETING & AUTOMATIONS
// ------------------------------------------
app.get('/api/marketing/campaigns', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

  try {
    const list = await memoryDb.campaign.findMany(guesthouseId);
    return c.json(list);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.get('/api/marketing/whatsapp-logs', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

  try {
    const logs = await memoryDb.messageLog.findMany(guesthouseId);
    return c.json(logs);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/marketing/campaigns', async (c) => {
  try {
    const { guesthouseId, campaignName, messageTemplate } = await c.req.json();
    if (!guesthouseId || !campaignName || !messageTemplate) {
      return c.json({ error: 'guesthouseId, campaignName, and messageTemplate are required' }, 400);
    }

    const report = await executeMarketingCampaign(guesthouseId, campaignName, messageTemplate);
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

    const gh = await memoryDb.guesthouse.findUnique(guesthouseId);
    const waConfig = gh?.whatsappPhoneId && gh?.whatsappToken ? {
      phoneId: gh.whatsappPhoneId,
      token: gh.whatsappToken,
      businessId: gh.whatsappBusinessId || undefined
    } : undefined;

    const result = await sendWhatsAppMessage({
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
    const { guesthouseId, whatsappPhoneId, whatsappToken, whatsappBusinessId, rooms, reviewTriggerTime } = await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

    const updateData: any = {
      whatsappPhoneId,
      whatsappToken,
      whatsappBusinessId,
    };
    if (rooms) updateData.rooms = rooms;
    if (reviewTriggerTime) updateData.reviewTriggerTime = reviewTriggerTime;

    const updated = await memoryDb.guesthouse.update(guesthouseId, updateData);
    return c.json({ message: 'Guesthouse marketing settings and custom properties updated successfully', guesthouse: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

app.post('/api/marketing/whatsapp-automations/trigger-review', async (c) => {
  try {
    const { guesthouseId } = await c.req.json();
    if (!guesthouseId) return c.json({ error: 'guesthouseId is required' }, 400);

    const outcome = await runCheckoutReviewAutomation(guesthouseId);
    return c.json({
      message: `Daily checkout review scanner completed successfully for today.`,
      processedCheckoutsTodayCount: outcome.processed,
      messagesSuccessfullyDispatchedCount: outcome.sent,
    });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ------------------------------------------
// AI OCCUPANCY PREDICTION
// ------------------------------------------
app.get('/api/analytics/ai-forecast', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);

  try {
    const gh = await memoryDb.guesthouse.findUnique(guesthouseId);
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);

    const bookings = await memoryDb.booking.findMany(guesthouseId);
    // Leverage the dynamic GEMINI_API_KEY from environment bindings
    const apiKey = c.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const forecast = await generateFuturePredictions(bookings, gh.name, apiKey);
    return c.json(forecast);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// ------------------------------------------
// STATISTICAL REPORTS & CSV EXPORT
// ------------------------------------------
app.get('/api/reports/compiled', async (c) => {
  const guesthouseId = c.req.query('guesthouseId');
  const days = c.req.query('days');
  if (!guesthouseId) return c.json({ error: 'guesthouseId query parameter is required' }, 400);

  try {
    const gh = await memoryDb.guesthouse.findUnique(guesthouseId);
    if (!gh) return c.json({ error: 'Guesthouse not found' }, 404);

    const bookings = await memoryDb.booking.findMany(guesthouseId);
    const customers = await memoryDb.customer.findMany(guesthouseId);
    const logs = await memoryDb.messageLog.findMany(guesthouseId);

    const report = compileReportData({
      guesthouseName: gh.name,
      bookings,
      customers,
      logs,
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
    const bookings = await memoryDb.booking.findMany(guesthouseId);
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

    const csvContent = convertToCSV(
      ['Booking ID', 'Customer Name', 'Phone Number', 'Room Assigned', 'Check-In Date', 'Check-Out Date', 'Price Collected', 'Status'],
      ['id', 'customerName', 'customerPhone', 'roomName', 'checkIn', 'checkOut', 'totalAmount', 'status'],
      rows
    );

    c.header('Content-Type', 'text/csv');
    c.header('Content-Disposition', 'attachment; filename="guesthouse_bookings_report.csv"');
    return c.text(csvContent, 200);
  } catch (err: any) {
    c.status(500);
    return c.text(err.message);
  }
});

// ==========================================
// HTTP Server and Asset Pipelines
// ==========================================

async function startServer() {
  const PORT = 3000;
  const requestListener = getRequestListener(app.fetch);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    const server = http.createServer((req, res) => {
      if (req.url && req.url.startsWith('/api')) {
        requestListener(req, res);
      } else {
        vite.middlewares(req, res);
      }
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[Hono Edge Gateway + Vite] running on http://localhost:${PORT}`);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');

    const server = http.createServer((req, res) => {
      if (req.url && req.url.startsWith('/api')) {
        requestListener(req, res);
      } else {
        let filePath = path.join(distPath, req.url || '/');

        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          filePath = path.join(distPath, 'index.html');
        }

        const ext = path.extname(filePath);
        let contentType = 'text/html';
        if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.json') contentType = 'application/json';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        else if (ext === '.ico') contentType = 'image/x-icon';

        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      }
    });

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`[Hono Edge Gateway Production] running on port http://localhost:${PORT}`);
    });
  }
}

startServer();
