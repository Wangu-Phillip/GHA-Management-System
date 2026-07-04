-- Seed data. Re-runnable: uses INSERT OR IGNORE.

INSERT OR IGNORE INTO "Guesthouse" ("id", "name", "whatsappPhoneId", "whatsappToken", "whatsappBusinessId", "subscriptionStatus", "subscriptionEndsAt", "rooms", "reviewTriggerTime", "logoUrl", "createdAt", "updatedAt") VALUES
  ('tenant-1', 'Pinecrest Ridge Guesthouse', '108495029302941', 'EAAGb0ZC...', '984501920392019', 'ACTIVE', datetime('now','+60 days'), '["Suite 101 - Oak Haven","Room 202 - Pine view","Room 203 - Cozy Studio"]', '11:00 AM', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=200&h=200&fit=crop&q=80', '2026-01-10T12:00:00Z', '2026-01-10T12:00:00Z');

INSERT OR IGNORE INTO "User" ("id", "email", "passwordHash", "name", "role", "createdAt", "updatedAt") VALUES
  ('user-pine-admin', 'sarah@pinecrest.com', 'pine123', 'Sarah Jenkins', 'TENANT_ADMIN', '2026-01-11T12:00:00Z', '2026-01-11T12:00:00Z'),
  ('user-pine-sales', 'john@pinecrest.com', 'pine123', 'John Miller', 'TENANT_SALES', '2026-01-12T12:00:00Z', '2026-01-12T12:00:00Z');

INSERT OR IGNORE INTO "Booking" ("id", "customerName", "customerEmail", "customerPhone", "customerCountry", "roomName", "checkIn", "checkOut", "status", "totalAmount", "reviewCollected", "reviewMessageStatus", "createdAt", "updatedAt") VALUES
  ('booking-1', 'Alice Green', 'alice@example.com', '+267 71234567', 'Botswana (local)', 'Suite 101 - Oak Haven', datetime('now','-15 days'), datetime('now','-12 days'), 'CHECKED_OUT', 450.00, 1, 'SENT', datetime('now','-20 days'), datetime('now','-12 days')),
  ('booking-2', 'Robert Carter', 'robert@example.com', '+267 72123456', 'Botswana (local)', 'Room 202 - Pine view', datetime('now','-8 days'), datetime('now','-5 days'), 'CHECKED_OUT', 300.00, 0, 'SENT', datetime('now','-10 days'), datetime('now','-5 days')),
  ('booking-3', 'Clara Oswald', 'clara@tardis.org', '+447911123456', 'United Kingdom', 'Suite 101 - Oak Haven', datetime('now','-2 days'), datetime('now','+2 days'), 'CHECKED_IN', 600.00, 0, 'PENDING', datetime('now','-6 days'), datetime('now','-2 days')),
  ('booking-4', 'David Tennant', 'david@doctor.com', '+447911987654', 'United Kingdom', 'Room 203 - Cozy Studio', datetime('now','+3 days'), datetime('now','+7 days'), 'CONFIRMED', 480.00, 0, 'PENDING', datetime('now','-1 days'), datetime('now','-1 days')),
  ('booking-5', 'Eleanor Vance', 'eleanor@hillhouse.com', '+267 73345678', 'Botswana (local)', 'Room 202 - Pine view', datetime('now','+8 days'), datetime('now','+11 days'), 'CONFIRMED', 320.00, 0, 'PENDING', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO "Customer" ("id", "name", "email", "phone", "customerCountry", "optInPromo", "createdAt", "updatedAt") VALUES
  ('cust-1', 'Alice Green', 'alice@example.com', '+267 71234567', 'Botswana (local)', 1, datetime('now','-20 days'), datetime('now','-20 days')),
  ('cust-2', 'Robert Carter', 'robert@example.com', '+267 72123456', 'Botswana (local)', 1, datetime('now','-10 days'), datetime('now','-10 days')),
  ('cust-3', 'Clara Oswald', 'clara@tardis.org', '+267 75123456', 'United Kingdom', 0, datetime('now','-6 days'), datetime('now','-6 days')),
  ('cust-4', 'David Tennant', 'david@doctor.com', '+267 76123456', 'United Kingdom', 1, datetime('now','-1 days'), datetime('now','-1 days'));

INSERT OR IGNORE INTO "Campaign" ("id", "name", "messageTemplate", "status", "createdAt", "updatedAt") VALUES
  ('camp-1', 'Summer Early Bird 15%', 'summer_early_bird_discount', 'SENT', datetime('now','-10 days'), datetime('now','-10 days')),
  ('camp-2', 'Autumn Foliage Promo', 'autumn_warm_welcome', 'DRAFT', datetime('now','-1 days'), datetime('now','-1 days'));

INSERT OR IGNORE INTO "MessageLog" ("id", "bookingId", "campaignId", "phone", "direction", "messageType", "content", "status", "createdAt") VALUES
  ('msg-1', 'booking-1', NULL, '+267 71234567', 'OUTBOUND', 'REVIEW_REQUEST', 'Hi Alice Green! Thank you for staying at Pinecrest Ridge.', 'READ', datetime('now','-12 days')),
  ('msg-2', NULL, 'camp-1', '+267 72123456', 'OUTBOUND', 'PROMO', 'Hi Robert Carter! Special early bird 15% discount. Code SUMMER15.', 'READ', datetime('now','-10 days')),
  ('msg-2-reply', NULL, 'camp-1', '+267 72123456', 'INBOUND', 'GENERAL', 'Sounds wonderful, thank you! I just confirmed a weekend stay.', 'READ', datetime('now','-10 days')),
  ('msg-3', 'booking-2', NULL, '+267 72123456', 'OUTBOUND', 'REVIEW_REQUEST', 'Hi Robert Carter! Thank you for staying at Pinecrest Ridge.', 'SENT', datetime('now','-5 days')),
  ('msg-4', NULL, 'camp-1', '+267 71234567', 'OUTBOUND', 'PROMO', 'Hi Alice Green! Special early bird 15% discount. Code SUMMER15.', 'DELIVERED', datetime('now','-10 days')),
  ('msg-5', NULL, 'camp-1', '+267 77123456', 'OUTBOUND', 'PROMO', 'Hi Keira Knightley! Special early bird 15% discount. Code SUMMER15.', 'FAILED', datetime('now','-10 days'));
