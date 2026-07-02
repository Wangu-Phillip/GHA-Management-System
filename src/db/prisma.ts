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
  wamid: string | null;
  direction: string;
  messageType: string;
  content: string;
  status: string;
  createdAt: Date;
}

// ─── Facebook Ads Data Interfaces ─────────────────────────────────────────────

export interface FacebookAdAccountData {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  accessToken: string;
  pageId: string | null;
  accountName: string | null;
  currency: string | null;
  timezone: string | null;
  connectedAt: Date;
  updatedAt: Date;
}

export interface FacebookCampaignData {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  name: string;
  status: string;
  objective: string | null;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  startTime: Date | null;
  stopTime: Date | null;
  syncedAt: Date;
  createdAt: Date;
}

export interface FacebookAdSetData {
  id: string;
  guesthouseId: string;
  campaignId: string;
  name: string;
  status: string;
  dailyBudget: number | null;
  targeting: string | null;
  bidStrategy: string | null;
  syncedAt: Date;
}

export interface FacebookAdData {
  id: string;
  guesthouseId: string;
  adSetId: string;
  name: string;
  status: string;
  creativeTitle: string | null;
  creativeBody: string | null;
  previewUrl: string | null;
  syncedAt: Date;
}

export interface FacebookInsightData {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  objectId: string;
  objectLevel: string;
  objectName: string | null;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  conversions: number;
  cpm: number | null;
  ctr: number | null;
  cpc: number | null;
  roas: number | null;
  syncedAt: Date;
}

export interface AiAdvisorCacheData {
  id: string;
  guesthouseId: string;
  windowDays: number;
  adviceJson: string;
  generatedAt: Date;
}

