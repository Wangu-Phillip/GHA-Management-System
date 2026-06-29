import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { memoryDb, getPrismaClient, checkDbConnection } from './src/db/prisma';
import { generateFuturePredictions } from './src/services/ai';
import { sendWhatsAppMessage, runCheckoutReviewAutomation, executeMarketingCampaign } from './src/services/whatsapp';
import { compileReportData, convertToCSV } from './src/services/reports';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global middleware
  app.use(express.json());

  // Attempt to initialize database lazily
  getPrismaClient().then((client) => {
    if (client) {
      console.log('ORM Database system is ready.');
    }
  });

  // ==========================================
  // API Routes
  // ==========================================

  // System Diagnostics
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      dbConnected: checkDbConnection(),
      mode: checkDbConnection() ? 'POSTGRESQL_PRODUCTION' : 'LOCAL_DEMO_STATE',
      timestamp: new Date().toISOString(),
    });
  });

  // ------------------------------------------
  // AUTHENTICATION ENDPOINTS
  // ------------------------------------------
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await memoryDb.user.findUnique(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Simple password checking for demo/dev speed (in prod, use bcrypt)
      if (user.passwordHash !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      let guesthouse = null;
      if (user.guesthouseId) {
        guesthouse = await memoryDb.guesthouse.findUnique(user.guesthouseId);
      }

      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          guesthouseId: user.guesthouseId,
        },
        guesthouse,
        token: `mock-jwt-token-for-${user.id}-${Date.now()}`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, guesthouseName } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    try {
      const existing = await memoryDb.user.findUnique(email);
      if (existing) {
        return res.status(400).json({ error: 'User already exists' });
      }

      let guesthouseId = null;

      // If they provided a guesthouse name, create a new tenant
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

      return res.status(21).json({
        message: 'Account registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          guesthouseId: user.guesthouseId,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // SUPER ADMIN OVERSEER ENDPOINTS
  // ------------------------------------------
  app.get('/api/super/guesthouses', async (req, res) => {
    try {
      const list = await memoryDb.guesthouse.findMany();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/super/guesthouses', async (req, res) => {
    const { name, subscriptionStatus, subscriptionEndsAt } = req.body;
    if (!name) return res.status(400).json({ error: 'Guesthouse name is required' });

    try {
      const gh = await memoryDb.guesthouse.create({
        name,
        subscriptionStatus: subscriptionStatus || 'ACTIVE',
        subscriptionEndsAt: subscriptionEndsAt ? new Date(subscriptionEndsAt) : undefined,
      });
      res.status(201).json(gh);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/super/guesthouses/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const gh = await memoryDb.guesthouse.update(id, req.body);
      res.json(gh);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/super/guesthouses/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await memoryDb.guesthouse.delete(id);
      res.json({ message: 'Guesthouse suspended successfully', deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/super/stats', async (req, res) => {
    try {
      const guesthouses = await memoryDb.guesthouse.findMany();
      const bookings = await memoryDb.booking.findMany();
      const users = await memoryDb.user.findMany();

      const totalRevenue = bookings
        .filter((b) => b.status !== 'CANCELLED')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      const activeTenants = guesthouses.filter((g) => g.subscriptionStatus === 'ACTIVE').length;

      res.json({
        totalGuesthouses: guesthouses.length,
        activeSubscriptions: activeTenants,
        totalGlobalRevenue: totalRevenue,
        totalUsersCount: users.length,
        totalBookingsCount: bookings.length,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // BOOKINGS MANAGEMENT
  // ------------------------------------------
  app.get('/api/bookings', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId query parameter is required' });

    try {
      const list = await memoryDb.booking.findMany(guesthouseId as string);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/bookings', async (req, res) => {
    const { guesthouseId, customerName, customerPhone, roomName, checkIn, checkOut, totalAmount, status } = req.body;
    if (!guesthouseId || !customerName || !customerPhone || !roomName || !checkIn || !checkOut || totalAmount === undefined) {
      return res.status(400).json({ error: 'All booking fields are required' });
    }

    try {
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
      res.status(201).json(b);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await memoryDb.booking.update(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/bookings/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await memoryDb.booking.delete(id);
      res.json({ message: 'Booking deleted successfully', deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Bulk Booking Ingestion from CSV / Excel JSON
  app.post('/api/bookings/import', async (req, res) => {
    const { guesthouseId, bookings } = req.body;
    if (!guesthouseId || !Array.isArray(bookings)) {
      return res.status(400).json({ error: 'guesthouseId and bookings list array are required' });
    }

    try {
      const imported: any[] = [];
      for (const b of bookings) {
        // Validation check
        if (!b.customerName || !b.customerPhone || !b.roomName || !b.checkIn || !b.checkOut) {
          continue; // skip bad row
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
      res.status(201).json({ message: `Successfully imported ${imported.length} bookings`, imported });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // CUSTOMER DATABASE ENDPOINTS
  // ------------------------------------------
  app.get('/api/customers', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId query parameter is required' });

    try {
      const list = await memoryDb.customer.findMany(guesthouseId as string);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/customers', async (req, res) => {
    const { guesthouseId, name, email, phone, optInPromo } = req.body;
    if (!guesthouseId || !name || !phone) {
      return res.status(400).json({ error: 'guesthouseId, name, and phone are required' });
    }

    try {
      const customer = await memoryDb.customer.create({
        guesthouseId,
        name,
        email,
        phone,
        optInPromo: !!optInPromo,
      });
      res.status(201).json(customer);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const updated = await memoryDb.customer.update(id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const deleted = await memoryDb.customer.delete(id);
      res.json({ message: 'Customer registry entry deleted', deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // WHATSAPP MARKETING & AUTOMATIONS
  // ------------------------------------------
  app.get('/api/marketing/campaigns', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId is required' });

    try {
      const list = await memoryDb.campaign.findMany(guesthouseId as string);
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/marketing/whatsapp-logs', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId is required' });

    try {
      const logs = await memoryDb.messageLog.findMany(guesthouseId as string);
      res.json(logs);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Execute a targeted WhatsApp marketing campaign to opted-in users
  app.post('/api/marketing/campaigns', async (req, res) => {
    const { guesthouseId, campaignName, messageTemplate } = req.body;
    if (!guesthouseId || !campaignName || !messageTemplate) {
      return res.status(400).json({ error: 'guesthouseId, campaignName, and messageTemplate are required' });
    }

    try {
      const report = await executeMarketingCampaign(guesthouseId, campaignName, messageTemplate);
      res.json({
        message: `Campaign dispatch completed. Transmitted ${report.sent} messages of ${report.totalOptIn} opted-in subscribers.`,
        report,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Manually send single WhatsApp message
  app.post('/api/marketing/whatsapp-send', async (req, res) => {
    const { guesthouseId, phone, content, messageType, bookingId } = req.body;
    if (!guesthouseId || !phone || !content) {
      return res.status(400).json({ error: 'guesthouseId, phone, and content are required' });
    }

    try {
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
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Config WhatsApp Meta credentials
  app.put('/api/marketing/whatsapp-settings', async (req, res) => {
    const { guesthouseId, whatsappPhoneId, whatsappToken, whatsappBusinessId } = req.body;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId is required' });

    try {
      const updated = await memoryDb.guesthouse.update(guesthouseId, {
        whatsappPhoneId,
        whatsappToken,
        whatsappBusinessId,
      });
      res.json({ message: 'WhatsApp numbers and Meta configurations updated successfully', guesthouse: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger day-of-checkout automatic feedback automation manually or cron
  app.post('/api/marketing/whatsapp-automations/trigger-review', async (req, res) => {
    const { guesthouseId } = req.body;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId is required' });

    try {
      const outcome = await runCheckoutReviewAutomation(guesthouseId);
      res.json({
        message: `Daily checkout review scanner completed successfully for today.`,
        processedCheckoutsTodayCount: outcome.processed,
        messagesSuccessfullyDispatchedCount: outcome.sent,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // AI occupancy prediction
  // ------------------------------------------
  app.get('/api/analytics/ai-forecast', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId query parameter is required' });

    try {
      const gh = await memoryDb.guesthouse.findUnique(guesthouseId as string);
      if (!gh) return res.status(404).json({ error: 'Guesthouse not found' });

      const bookings = await memoryDb.booking.findMany(guesthouseId as string);
      const forecast = await generateFuturePredictions(bookings, gh.name);
      res.json(forecast);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ------------------------------------------
  // STATISTICAL REPORTS & CSV EXPORT
  // ------------------------------------------
  app.get('/api/reports/compiled', async (req, res) => {
    const { guesthouseId, days } = req.query;
    if (!guesthouseId) return res.status(400).json({ error: 'guesthouseId query parameter is required' });

    try {
      const gh = await memoryDb.guesthouse.findUnique(guesthouseId as string);
      if (!gh) return res.status(404).json({ error: 'Guesthouse not found' });

      const bookings = await memoryDb.booking.findMany(guesthouseId as string);
      const customers = await memoryDb.customer.findMany(guesthouseId as string);
      const logs = await memoryDb.messageLog.findMany(guesthouseId as string);

      const report = compileReportData({
        guesthouseName: gh.name,
        bookings,
        customers,
        logs,
        days: days ? Number(days) : 30,
      });

      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Downloads CSV table of all Bookings
  app.get('/api/reports/download-csv', async (req, res) => {
    const { guesthouseId } = req.query;
    if (!guesthouseId) return res.status(400).send('guesthouseId is required');

    try {
      const bookings = await memoryDb.booking.findMany(guesthouseId as string);
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

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="guesthouse_bookings_report.csv"');
      res.status(200).send(csvContent);
    } catch (err: any) {
      res.status(500).send(err.message);
    }
  });

  // ==========================================
  // Vite Integration & Asset Pipeline
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express API Gateway Server] running securely on port http://localhost:${PORT}`);
  });
}

startServer();
