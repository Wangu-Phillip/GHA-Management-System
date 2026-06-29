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
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalAmount: number;
  reviewCollected: boolean;
  reviewMessageStatus: 'PENDING' | 'SENT' | 'FAILED' | 'NO_OPT_IN';
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  guesthouseId: string;
  name: string;
  email?: string;
  phone: string;
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
}
