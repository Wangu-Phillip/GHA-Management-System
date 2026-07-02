-- Add wamid column to MessageLog for Meta message ID correlation
ALTER TABLE "MessageLog" ADD COLUMN "wamid" TEXT;

-- Add notes column to Booking for webhook auto-created booking context
ALTER TABLE "Booking" ADD COLUMN "notes" TEXT;

-- Index wamid for fast webhook status lookup
CREATE INDEX IF NOT EXISTS "MessageLog_wamid_idx" ON "MessageLog"("wamid");
