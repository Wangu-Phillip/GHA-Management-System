export type Role = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_SALES';

export interface Guesthouse {
  id: string;
  name: string;
  whatsappPhoneId?: string;
  whatsappToken?: string;
  whatsappBusinessId?: string;
  subscriptionStatus: string;
  subscriptionEndsAt?: string;
  rooms?: string[];
  reviewTriggerTime?: string;
  logoUrl?: string;
  allowLogDeletion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  guesthouseId: string | null;
}

export interface Booking {
  id: string;
  guesthouseId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerCountry?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalAmount: number;
  reviewCollected: boolean;
  reviewMessageStatus: 'PENDING' | 'SENT' | 'FAILED' | 'NO_OPT_IN';
  reviewRating?: number | null;
  reviewFeedback?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  guesthouseId: string;
  name: string;
  email?: string;
  phone: string;
  customerCountry?: string;
  optInPromo: boolean;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  ageGroup?: '18-25' | '26-35' | '36-50' | '50+';
  groupStyle?: 'COUPLE' | 'SINGLE' | 'FAMILY';
  createdAt: string;
}

export interface Campaign {
  id: string;
  guesthouseId: string;
  name: string;
  messageTemplate: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  scheduledAt?: string;
  createdAt: string;
}

export interface MessageLog {
  id: string;
  guesthouseId: string;
  bookingId?: string;
  campaignId?: string;
  phone: string;
  wamid?: string;
  direction: 'OUTBOUND' | 'INBOUND';
  messageType: 'PROMO' | 'REVIEW_REQUEST' | 'GENERAL';
  content: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  createdAt: string;
}

export interface PredictionDay {
  date: string;
  predictedOccupancyRate: number;
  predictedRevenue: number;
  confidenceScore: number;
  seasonalFactors: string;
}

export interface AiInsights {
  predictions: PredictionDay[];
  summaryText: string;
  recommendedPromotions: string[];
}

export interface CompiledReport {
  summary: {
    guesthouseName: string;
    generatedAt: string;
    startDate: string;
    endDate: string;
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    averageDailyRate: number;
    revenuePerAvailableRoom: number;
    whatsappOptInCount: number;
    whatsappCampaignCount: number;
    whatsappReviewRequestsSent: number;
    whatsappResponseRate: number;
  };
  revenueByRoomTable: Array<{
    room: string;
    bookingsCount: number;
    nightsSold: number;
    revenueCollected: number;
    averageRatePerNight: number;
  }>;
  bookingDetailsTable: Array<{
    id: string;
    customer: string;
    phone: string;
    room: string;
    checkInDate: string;
    checkOutDate: string;
    revenue: number;
    status: string;
    whatsappAutomated: string;
  }>;
  demographics?: {
    byCountry: Array<{ name: string; bookingsCount: number; revenueCollected: number }>;
    byGender: Array<{ name: string; bookingsCount: number; revenueCollected: number }>;
    byAgeGroup: Array<{ name: string; bookingsCount: number; revenueCollected: number }>;
    byGroupStyle: Array<{ name: string; bookingsCount: number; revenueCollected: number }>;
  };
}

// ─── Facebook Ads Types ───────────────────────────────────────────────────────

export interface FacebookAdAccount {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  accessToken: string;
  pageId?: string;
  accountName?: string;
  currency?: string;
  timezone?: string;
  connectedAt: string;
  updatedAt: string;
}

export interface FacebookCampaign {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  objective?: string;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime?: string;
  stopTime?: string;
  syncedAt: string;
  createdAt: string;
}

export interface FacebookInsight {
  id: string;
  guesthouseId: string;
  adAccountId: string;
  objectId: string;
  objectLevel: 'CAMPAIGN' | 'ADSET' | 'AD' | 'ACCOUNT';
  objectName?: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  conversions: number;
  cpm?: number;
  ctr?: number;
  cpc?: number;
  roas?: number;
  syncedAt: string;
}

export interface BudgetSuggestion {
  campaignId: string;
  campaignName: string;
  currentDailyBudget: number;
  suggestedDailyBudget: number;
  rationale: string;
}

export interface CampaignPerformanceSummary {
  campaignId: string;
  campaignName: string;
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCtr: number;
  avgCpc: number;
  avgRoas: number;
}

export interface AdvisorAdvice {
  performanceSummary: string;
  budgetSuggestions: BudgetSuggestion[];
  topPerformers: CampaignPerformanceSummary[];
  bottomPerformers: CampaignPerformanceSummary[];
  audienceInsights: string;
  outlook30Days: string;
  generatedAt: string;
  windowDays: number;
  isFromCache: boolean;
}
