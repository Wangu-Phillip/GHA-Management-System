import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

export type AppPrisma = PrismaClient;

export function getD1PrismaClient(db: D1Database): PrismaClient {
  const adapter = new PrismaD1(db);
  return new PrismaClient({ adapter });
}

// ---------- Shared row types (D1 returns Date for DATETIME columns) ----------

export interface GuesthouseData {
  id: string;
  name: string;
  whatsappPhoneId: string | null;
  whatsappToken: string | null;
  whatsappBusinessId: string | null;
  subscriptionStatus: string;
  subscriptionEndsAt: Date | null;
  rooms: string | null;
  reviewTriggerTime: string | null;
  logoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  guesthouseId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingData {
  id: string;
  guesthouseId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string;
  customerCountry: string | null;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: string;
  totalAmount: number;
  reviewCollected: boolean;
  reviewMessageStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerData {
  id: string;
  guesthouseId: string;
  name: string;
  email: string | null;
  phone: string;
  customerCountry: string | null;
  optInPromo: boolean;
  gender: string | null;
  ageGroup: string | null;
  groupStyle: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CampaignData {
  id: string;
  guesthouseId: string;
  name: string;
  messageTemplate: string;
  status: string;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageLogData {
  id: string;
  guesthouseId: string;
  bookingId: string | null;
  campaignId: string | null;
  phone: string;
  direction: string;
  messageType: string;
  content: string;
  status: string;
  createdAt: Date;
}
