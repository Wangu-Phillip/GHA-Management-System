import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

let isDbConnected = false;

export function getD1PrismaClient(db: any): PrismaClient {
  const adapter = new PrismaD1(db);
  const prisma = new PrismaClient({ adapter });
  isDbConnected = true;
  return prisma;
}

// Keep legacy for compatibility during compilation check
export async function getPrismaClient(): Promise<PrismaClient | null> {
  return null;
}

export function checkDbConnection(): boolean {
  return isDbConnected;
}

// ==========================================
// High-Fidelity Mock Database Fallback State
// ==========================================

export interface GuesthouseData {
  id: string;
  name: string;
  whatsappPhoneId?: string;
  whatsappToken?: string;
  whatsappBusinessId?: string;
  subscriptionStatus: string;
  subscriptionEndsAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'TENANT_SALES';
  guesthouseId: string | null;
  createdAt: Date;
}

export interface BookingData {
  id: string;
  guesthouseId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  totalAmount: number;
  reviewCollected: boolean;
  reviewMessageStatus: 'PENDING' | 'SENT' | 'FAILED' | 'NO_OPT_IN';
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerData {
  id: string;
  guesthouseId: string;
  name: string;
  email?: string;
  phone: string;
  optInPromo: boolean;
  createdAt: Date;
}

export interface CampaignData {
  id: string;
  guesthouseId: string;
  name: string;
  messageTemplate: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  scheduledAt?: Date;
  createdAt: Date;
}

export interface MessageLogData {
  id: string;
  guesthouseId: string;
  bookingId?: string;
  phone: string;
  direction: 'OUTBOUND' | 'INBOUND';
  messageType: 'PROMO' | 'REVIEW_REQUEST' | 'GENERAL';
  content: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  createdAt: Date;
}

// Pre-populate with beautiful, realistic data for initial demo
const mockGuesthouses: GuesthouseData[] = [
  {
    id: 'tenant-1',
    name: 'Pinecrest Ridge Guesthouse',
    whatsappPhoneId: '108495029302941',
    whatsappToken: 'EAAGb0ZC...',
    whatsappBusinessId: '984501920392019',
    subscriptionStatus: 'ACTIVE',
    subscriptionEndsAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    createdAt: new Date('2026-01-10T12:00:00Z'),
    updatedAt: new Date('2026-01-10T12:00:00Z'),
  },
  {
    id: 'tenant-2',
    name: 'Ocean Breeze Retreat',
    whatsappPhoneId: '204958102930495',
    whatsappToken: 'EAAGb0ZD...',
    whatsappBusinessId: '874950291039203',
    subscriptionStatus: 'ACTIVE',
    subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdAt: new Date('2026-02-15T12:00:00Z'),
    updatedAt: new Date('2026-02-15T12:00:00Z'),
  },
  {
    id: 'tenant-3',
    name: 'Golden Valley Inn',
    subscriptionStatus: 'PAST_DUE',
    subscriptionEndsAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date('2026-03-01T12:00:00Z'),
    updatedAt: new Date('2026-03-01T12:00:00Z'),
  },
];

const mockUsers: UserData[] = [
  {
    id: 'user-super',
    email: 'admin@guesthousesaas.com',
    passwordHash: 'admin123', // Direct check for simplicity
    name: 'SaaS Super Overseer',
    role: 'SUPER_ADMIN',
    guesthouseId: null,
    createdAt: new Date('2026-01-01T12:00:00Z'),
  },
  {
    id: 'user-pine-admin',
    email: 'sarah@pinecrest.com',
    passwordHash: 'pine123',
    name: 'Sarah Jenkins',
    role: 'TENANT_ADMIN',
    guesthouseId: 'tenant-1',
    createdAt: new Date('2026-01-11T12:00:00Z'),
  },
  {
    id: 'user-pine-sales',
    email: 'john@pinecrest.com',
    passwordHash: 'pine123',
    name: 'John Miller',
    role: 'TENANT_SALES',
    guesthouseId: 'tenant-1',
    createdAt: new Date('2026-01-12T12:00:00Z'),
  },
  {
    id: 'user-ocean-admin',
    email: 'ocean@oceanbreeze.com',
    passwordHash: 'ocean123',
    name: 'Captain Robert',
    role: 'TENANT_ADMIN',
    guesthouseId: 'tenant-2',
    createdAt: new Date('2026-02-16T12:00:00Z'),
  },
];

// Historical booking generation helpers
const getPastDate = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};
const getFutureDate = (daysAhead: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d;
};

const mockBookings: BookingData[] = [
  // Tenant 1 (Pinecrest Ridge)
  {
    id: 'booking-1',
    guesthouseId: 'tenant-1',
    customerName: 'Alice Green',
    customerEmail: 'alice@example.com',
    customerPhone: '+14155552671',
    roomName: 'Suite 101 - Oak Haven',
    checkIn: getPastDate(15),
    checkOut: getPastDate(12),
    status: 'CHECKED_OUT',
    totalAmount: 450.00,
    reviewCollected: true,
    reviewMessageStatus: 'SENT',
    createdAt: getPastDate(20),
    updatedAt: getPastDate(12),
  },
  {
    id: 'booking-2',
    guesthouseId: 'tenant-1',
    customerName: 'Robert Carter',
    customerEmail: 'robert@example.com',
    customerPhone: '+15105553920',
    roomName: 'Room 202 - Pine view',
    checkIn: getPastDate(8),
    checkOut: getPastDate(5),
    status: 'CHECKED_OUT',
    totalAmount: 300.00,
    reviewCollected: false,
    reviewMessageStatus: 'SENT',
    createdAt: getPastDate(10),
    updatedAt: getPastDate(5),
  },
  {
    id: 'booking-3',
    guesthouseId: 'tenant-1',
    customerName: 'Clara Oswald',
    customerEmail: 'clara@tardis.org',
    customerPhone: '+447911123456',
    roomName: 'Suite 101 - Oak Haven',
    checkIn: getPastDate(2),
    checkOut: getFutureDate(2),
    status: 'CHECKED_IN',
    totalAmount: 600.00,
    reviewCollected: false,
    reviewMessageStatus: 'PENDING',
    createdAt: getPastDate(6),
    updatedAt: getPastDate(2),
  },
  {
    id: 'booking-4',
    guesthouseId: 'tenant-1',
    customerName: 'David Tennant',
    customerEmail: 'david@doctor.com',
    customerPhone: '+447911987654',
    roomName: 'Room 203 - Cozy Studio',
    checkIn: getFutureDate(3),
    checkOut: getFutureDate(7),
    status: 'CONFIRMED',
    totalAmount: 480.00,
    reviewCollected: false,
    reviewMessageStatus: 'PENDING',
    createdAt: getPastDate(1),
    updatedAt: getPastDate(1),
  },
  {
    id: 'booking-5',
    guesthouseId: 'tenant-1',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor@hillhouse.com',
    customerPhone: '+16175550912',
    roomName: 'Room 202 - Pine view',
    checkIn: getFutureDate(8),
    checkOut: getFutureDate(11),
    status: 'CONFIRMED',
    totalAmount: 320.00,
    reviewCollected: false,
    reviewMessageStatus: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Tenant 2 (Ocean Breeze)
  {
    id: 'booking-ob-1',
    guesthouseId: 'tenant-2',
    customerName: 'Liam Neeson',
    customerEmail: 'liam@taken.com',
    customerPhone: '+13105550192',
    roomName: 'Beachfront Cabin A',
    checkIn: getPastDate(20),
    checkOut: getPastDate(15),
    status: 'CHECKED_OUT',
    totalAmount: 1250.00,
    reviewCollected: false,
    reviewMessageStatus: 'FAILED',
    createdAt: getPastDate(25),
    updatedAt: getPastDate(15),
  },
  {
    id: 'booking-ob-2',
    guesthouseId: 'tenant-2',
    customerName: 'Keira Knightley',
    customerEmail: 'keira@pirates.com',
    customerPhone: '+447911223344',
    roomName: 'Horizon Suite',
    checkIn: getPastDate(3),
    checkOut: getFutureDate(1),
    status: 'CHECKED_IN',
    totalAmount: 800.00,
    reviewCollected: false,
    reviewMessageStatus: 'PENDING',
    createdAt: getPastDate(5),
    updatedAt: getPastDate(3),
  },
];

const mockCustomers: CustomerData[] = [
  {
    id: 'cust-1',
    guesthouseId: 'tenant-1',
    name: 'Alice Green',
    email: 'alice@example.com',
    phone: '+14155552671',
    optInPromo: true,
    createdAt: getPastDate(20),
  },
  {
    id: 'cust-2',
    guesthouseId: 'tenant-1',
    name: 'Robert Carter',
    email: 'robert@example.com',
    phone: '+15105553920',
    optInPromo: true,
    createdAt: getPastDate(10),
  },
  {
    id: 'cust-3',
    guesthouseId: 'tenant-1',
    name: 'Clara Oswald',
    email: 'clara@tardis.org',
    phone: '+447911123456',
    optInPromo: false,
    createdAt: getPastDate(6),
  },
  {
    id: 'cust-4',
    guesthouseId: 'tenant-1',
    name: 'David Tennant',
    email: 'david@doctor.com',
    phone: '+447911987654',
    optInPromo: true,
    createdAt: getPastDate(1),
  },
  {
    id: 'cust-ob-1',
    guesthouseId: 'tenant-2',
    name: 'Liam Neeson',
    email: 'liam@taken.com',
    phone: '+13105550192',
    optInPromo: false,
    createdAt: getPastDate(25),
  },
  {
    id: 'cust-ob-2',
    guesthouseId: 'tenant-2',
    name: 'Keira Knightley',
    email: 'keira@pirates.com',
    phone: '+447911223344',
    optInPromo: true,
    createdAt: getPastDate(5),
  },
];

const mockCampaigns: CampaignData[] = [
  {
    id: 'camp-1',
    guesthouseId: 'tenant-1',
    name: 'Summer Early Bird 15%',
    messageTemplate: 'summer_early_bird_discount',
    status: 'SENT',
    createdAt: getPastDate(10),
  },
  {
    id: 'camp-2',
    guesthouseId: 'tenant-1',
    name: 'Autumn Foliage Promo',
    messageTemplate: 'autumn_warm_welcome',
    status: 'DRAFT',
    createdAt: getPastDate(1),
  },
];

const mockMessageLogs: MessageLogData[] = [
  {
    id: 'msg-1',
    guesthouseId: 'tenant-1',
    bookingId: 'booking-1',
    phone: '+14155552671',
    direction: 'OUTBOUND',
    messageType: 'REVIEW_REQUEST',
    content: 'Hi Alice Green! Thank you for staying at Pinecrest Ridge. We would love to hear your feedback. Please leave us a review here: https://g.page/pinecrest/review',
    status: 'READ',
    createdAt: getPastDate(12),
  },
  {
    id: 'msg-2',
    guesthouseId: 'tenant-1',
    phone: '+15105553920',
    direction: 'OUTBOUND',
    messageType: 'PROMO',
    content: 'Hi Robert! Claim your 15% discount for your next summer escape at Pinecrest Ridge using code: SUNNY15.',
    status: 'DELIVERED',
    createdAt: getPastDate(10),
  },
  {
    id: 'msg-3',
    guesthouseId: 'tenant-1',
    bookingId: 'booking-2',
    phone: '+15105553920',
    direction: 'OUTBOUND',
    messageType: 'REVIEW_REQUEST',
    content: 'Hi Robert Carter! Thank you for staying at Pinecrest Ridge. We would love to hear your feedback. Please leave us a review here: https://g.page/pinecrest/review',
    status: 'SENT',
    createdAt: getPastDate(5),
  },
];

// ==========================================
// In-Memory Database Controller (API Proxy)
// ==========================================

export const memoryDb = {
  guesthouse: {
    findMany: async () => [...mockGuesthouses],
    findUnique: async (id: string) => mockGuesthouses.find((g) => g.id === id) || null,
    create: async (data: Omit<GuesthouseData, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newGuesthouse: GuesthouseData = {
        id: `tenant-${Date.now()}`,
        name: data.name,
        whatsappPhoneId: data.whatsappPhoneId,
        whatsappToken: data.whatsappToken,
        whatsappBusinessId: data.whatsappBusinessId,
        subscriptionStatus: data.subscriptionStatus || 'ACTIVE',
        subscriptionEndsAt: data.subscriptionEndsAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGuesthouses.push(newGuesthouse);
      return newGuesthouse;
    },
    update: async (id: string, data: Partial<GuesthouseData>) => {
      const idx = mockGuesthouses.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error('Guesthouse not found');
      mockGuesthouses[idx] = {
        ...mockGuesthouses[idx],
        ...data,
        updatedAt: new Date(),
      };
      return mockGuesthouses[idx];
    },
    delete: async (id: string) => {
      const idx = mockGuesthouses.findIndex((g) => g.id === id);
      if (idx === -1) throw new Error('Guesthouse not found');
      const deleted = mockGuesthouses.splice(idx, 1)[0];
      return deleted;
    },
  },

  user: {
    findMany: async (guesthouseId?: string) => {
      if (guesthouseId) {
        return mockUsers.filter((u) => u.guesthouseId === guesthouseId);
      }
      return [...mockUsers];
    },
    findUnique: async (email: string) => mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null,
    create: async (data: Omit<UserData, 'id' | 'createdAt'>) => {
      const newUser: UserData = {
        id: `user-${Date.now()}`,
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role,
        guesthouseId: data.guesthouseId,
        createdAt: new Date(),
      };
      mockUsers.push(newUser);
      return newUser;
    },
    update: async (id: string, data: Partial<UserData>) => {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');
      mockUsers[idx] = {
        ...mockUsers[idx],
        ...data,
      };
      return mockUsers[idx];
    },
    delete: async (id: string) => {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error('User not found');
      return mockUsers.splice(idx, 1)[0];
    },
  },

  booking: {
    findMany: async (guesthouseId?: string) => {
      if (guesthouseId) {
        return mockBookings.filter((b) => b.guesthouseId === guesthouseId);
      }
      return [...mockBookings];
    },
    findUnique: async (id: string) => mockBookings.find((b) => b.id === id) || null,
    create: async (data: Omit<BookingData, 'id' | 'createdAt' | 'updatedAt' | 'reviewCollected' | 'reviewMessageStatus'>) => {
      const newBooking: BookingData = {
        id: `booking-${Date.now()}`,
        guesthouseId: data.guesthouseId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        roomName: data.roomName,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        status: data.status || 'CONFIRMED',
        totalAmount: Number(data.totalAmount),
        reviewCollected: false,
        reviewMessageStatus: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockBookings.push(newBooking);

      // Automatically register/update customer record
      const phoneClean = data.customerPhone.trim();
      const existingCustomer = mockCustomers.find(
        (c) => c.guesthouseId === data.guesthouseId && c.phone === phoneClean
      );
      if (!existingCustomer) {
        mockCustomers.push({
          id: `cust-${Date.now()}`,
          guesthouseId: data.guesthouseId,
          name: data.customerName,
          email: data.customerEmail,
          phone: phoneClean,
          optInPromo: false, // Default is opt-out until they opt-in
          createdAt: new Date(),
        });
      }

      return newBooking;
    },
    update: async (id: string, data: Partial<BookingData>) => {
      const idx = mockBookings.findIndex((b) => b.id === id);
      if (idx === -1) throw new Error('Booking not found');
      
      const updatedCheckIn = data.checkIn ? new Date(data.checkIn) : mockBookings[idx].checkIn;
      const updatedCheckOut = data.checkOut ? new Date(data.checkOut) : mockBookings[idx].checkOut;

      mockBookings[idx] = {
        ...mockBookings[idx],
        ...data,
        checkIn: updatedCheckIn,
        checkOut: updatedCheckOut,
        updatedAt: new Date(),
      };
      return mockBookings[idx];
    },
    delete: async (id: string) => {
      const idx = mockBookings.findIndex((b) => b.id === id);
      if (idx === -1) throw new Error('Booking not found');
      return mockBookings.splice(idx, 1)[0];
    },
  },

  customer: {
    findMany: async (guesthouseId?: string) => {
      if (guesthouseId) {
        return mockCustomers.filter((c) => c.guesthouseId === guesthouseId);
      }
      return [...mockCustomers];
    },
    create: async (data: Omit<CustomerData, 'id' | 'createdAt'>) => {
      const phoneClean = data.phone.trim();
      const existing = mockCustomers.find(
        (c) => c.guesthouseId === data.guesthouseId && c.phone === phoneClean
      );
      if (existing) {
        existing.name = data.name;
        existing.email = data.email || existing.email;
        existing.optInPromo = data.optInPromo !== undefined ? data.optInPromo : existing.optInPromo;
        return existing;
      }
      const newCust: CustomerData = {
        id: `cust-${Date.now()}`,
        guesthouseId: data.guesthouseId,
        name: data.name,
        email: data.email,
        phone: phoneClean,
        optInPromo: !!data.optInPromo,
        createdAt: new Date(),
      };
      mockCustomers.push(newCust);
      return newCust;
    },
    update: async (id: string, data: Partial<CustomerData>) => {
      const idx = mockCustomers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Customer not found');
      mockCustomers[idx] = {
        ...mockCustomers[idx],
        ...data,
      };
      return mockCustomers[idx];
    },
    delete: async (id: string) => {
      const idx = mockCustomers.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Customer not found');
      return mockCustomers.splice(idx, 1)[0];
    },
  },

  campaign: {
    findMany: async (guesthouseId?: string) => {
      if (guesthouseId) {
        return mockCampaigns.filter((c) => c.guesthouseId === guesthouseId);
      }
      return [...mockCampaigns];
    },
    create: async (data: Omit<CampaignData, 'id' | 'createdAt'>) => {
      const newCamp: CampaignData = {
        id: `camp-${Date.now()}`,
        guesthouseId: data.guesthouseId,
        name: data.name,
        messageTemplate: data.messageTemplate,
        status: data.status || 'DRAFT',
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        createdAt: new Date(),
      };
      mockCampaigns.push(newCamp);
      return newCamp;
    },
    update: async (id: string, data: Partial<CampaignData>) => {
      const idx = mockCampaigns.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Campaign not found');
      mockCampaigns[idx] = {
        ...mockCampaigns[idx],
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : mockCampaigns[idx].scheduledAt,
      };
      return mockCampaigns[idx];
    },
    delete: async (id: string) => {
      const idx = mockCampaigns.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error('Campaign not found');
      return mockCampaigns.splice(idx, 1)[0];
    },
  },

  messageLog: {
    findMany: async (guesthouseId?: string) => {
      if (guesthouseId) {
        return mockMessageLogs.filter((m) => m.guesthouseId === guesthouseId);
      }
      return [...mockMessageLogs];
    },
    create: async (data: Omit<MessageLogData, 'id' | 'createdAt'>) => {
      const newLog: MessageLogData = {
        id: `msg-${Date.now()}`,
        guesthouseId: data.guesthouseId,
        bookingId: data.bookingId,
        phone: data.phone,
        direction: data.direction,
        messageType: data.messageType,
        content: data.content,
        status: data.status || 'PENDING',
        createdAt: new Date(),
      };
      mockMessageLogs.push(newLog);
      return newLog;
    },
  },
};

// Types for cleaner import
type OmitField<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
