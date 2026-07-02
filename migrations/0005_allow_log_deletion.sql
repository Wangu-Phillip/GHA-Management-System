-- Add allowLogDeletion column to Guesthouse table
ALTER TABLE "Guesthouse" ADD COLUMN "allowLogDeletion" BOOLEAN NOT NULL DEFAULT 0;
