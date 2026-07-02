-- Add reviewRating and reviewFeedback columns to Booking table
ALTER TABLE "Booking" ADD COLUMN "reviewRating" INTEGER;
ALTER TABLE "Booking" ADD COLUMN "reviewFeedback" TEXT;
