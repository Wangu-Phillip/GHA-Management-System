-- Feature flags + blocking/pausing per tenant
ALTER TABLE "Guesthouse" ADD COLUMN "isBlocked"     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Guesthouse" ADD COLUMN "isPaused"      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Guesthouse" ADD COLUMN "featureFlags"  TEXT    NOT NULL DEFAULT '{"facebookAds":true,"whatsappMarketing":true,"aiForecasts":true,"linkWhatsappNumber":true}';

-- Firebase Auth UID on User table
ALTER TABLE "User" ADD COLUMN "firebaseUid" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_firebaseUid_key" ON "User"("firebaseUid") WHERE "firebaseUid" IS NOT NULL;

-- Subscription history audit log
CREATE TABLE IF NOT EXISTS "SubscriptionHistory" (
    "id"                TEXT     NOT NULL PRIMARY KEY,
    "changedBy"         TEXT     NOT NULL,  -- super-admin userId
    "previousStatus"    TEXT     NOT NULL,
    "newStatus"         TEXT     NOT NULL,
    "subscriptionEndsAt" DATETIME,
    "notes"             TEXT,
    "createdAt"         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
