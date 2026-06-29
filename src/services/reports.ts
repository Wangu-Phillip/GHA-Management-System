import { BookingData, CustomerData, MessageLogData } from '../db/prisma';

export interface ReportSummary {
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
  whatsappResponseRate: number; // Simulated
}

export interface ReportTableColumn {
  header: string;
  key: string;
}

export interface DemographicStats {
  name: string;
  bookingsCount: number;
  revenueCollected: number;
}

export interface ReportData {
  summary: ReportSummary;
  revenueByRoomTable: any[];
  bookingDetailsTable: any[];
  demographics: {
    byCountry: DemographicStats[];
    byGender: DemographicStats[];
    byAgeGroup: DemographicStats[];
    byGroupStyle: DemographicStats[];
  };
}

/**
 * Compiles exhaustive statistical analysis reports from bookings, customers, and logs
 */
export function compileReportData(params: {
  guesthouseName: string;
  bookings: BookingData[];
  customers: CustomerData[];
  logs: MessageLogData[];
  days?: number;
}): ReportData {
  const days = params.days || 30;
  const endDate = new Date('2026-06-29T23:59:59Z');
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  // Filter within date range
  const filteredBookings = params.bookings.filter(
    (b) => b.checkIn >= startDate && b.checkIn <= endDate && b.status !== 'CANCELLED'
  );

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalBookings = filteredBookings.length;

  // Occupancy rate calculation (assuming 5 rooms total for standard guesthouse baseline)
  const totalRooms = 5;
  const totalAvailableNights = totalRooms * days;
  const occupiedNights = filteredBookings.reduce((nights, b) => {
    const diffTime = Math.abs(b.checkOut.getTime() - b.checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights + diffDays;
  }, 0);

  const occupancyRate = totalAvailableNights > 0 
    ? Math.round((occupiedNights / totalAvailableNights) * 100)
    : 0;

  const averageDailyRate = occupiedNights > 0 
    ? Math.round((totalRevenue / occupiedNights) * 100) / 100
    : 0;

  const RevPAR = Math.round((averageDailyRate * (occupancyRate / 100)) * 100) / 100;

  // WhatsApp Stats
  const optIns = params.customers.filter((c) => c.optInPromo).length;
  const reviewSent = params.logs.filter((l) => l.messageType === 'REVIEW_REQUEST').length;
  const reviewsRead = params.logs.filter(
    (l) => l.messageType === 'REVIEW_REQUEST' && l.status === 'READ'
  ).length;

  const responseRate = reviewSent > 0 ? Math.round((reviewsRead / reviewSent) * 100) : 0;

  const summary: ReportSummary = {
    guesthouseName: params.guesthouseName,
    generatedAt: new Date().toISOString(),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    totalRevenue,
    totalBookings,
    occupancyRate,
    averageDailyRate,
    revenuePerAvailableRoom: RevPAR,
    whatsappOptInCount: optIns,
    whatsappCampaignCount: Math.max(1, params.logs.filter((l) => l.messageType === 'PROMO').length),
    whatsappReviewRequestsSent: reviewSent,
    whatsappResponseRate: responseRate,
  };

  // Compile Revenue by Room Type
  const roomRevenueMap: Record<string, { bookings: number; revenue: number; nights: number }> = {};
  filteredBookings.forEach((b) => {
    const room = b.roomName || 'Standard Room';
    const diffTime = Math.abs(b.checkOut.getTime() - b.checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (!roomRevenueMap[room]) {
      roomRevenueMap[room] = { bookings: 0, revenue: 0, nights: 0 };
    }
    roomRevenueMap[room].bookings += 1;
    roomRevenueMap[room].revenue += b.totalAmount;
    roomRevenueMap[room].nights += diffDays;
  });

  const revenueByRoomTable = Object.entries(roomRevenueMap).map(([room, data]) => ({
    room,
    bookingsCount: data.bookings,
    nightsSold: data.nights,
    revenueCollected: data.revenue,
    averageRatePerNight: Math.round((data.revenue / (data.nights || 1)) * 100) / 100,
  }));

  // Compile Booking Details list
  const bookingDetailsTable = filteredBookings.map((b) => ({
    id: b.id,
    customer: b.customerName,
    phone: b.customerPhone,
    room: b.roomName,
    checkInDate: b.checkIn.toISOString().split('T')[0],
    checkOutDate: b.checkOut.toISOString().split('T')[0],
    revenue: b.totalAmount,
    status: b.status,
    whatsappAutomated: b.reviewMessageStatus,
  }));

  // Compiling Demographic Segment Breakdowns
  const customerMap = new Map<string, CustomerData>();
  params.customers.forEach((c) => {
    customerMap.set(c.phone.trim().replace(/\s+/g, ''), c);
  });

  const countryMap: Record<string, { bookings: number; revenue: number }> = {};
  const genderMap: Record<string, { bookings: number; revenue: number }> = {};
  const ageGroupMap: Record<string, { bookings: number; revenue: number }> = {};
  const groupStyleMap: Record<string, { bookings: number; revenue: number }> = {};

  filteredBookings.forEach((b) => {
    const normPhone = b.customerPhone.trim().replace(/\s+/g, '');
    const cust = customerMap.get(normPhone);

    // Country of origin
    const country = b.customerCountry || (cust ? cust.customerCountry : undefined) || 'Botswana (local)';
    if (!countryMap[country]) countryMap[country] = { bookings: 0, revenue: 0 };
    countryMap[country].bookings += 1;
    countryMap[country].revenue += b.totalAmount;

    // Gender profile
    let gender = cust && cust.gender ? cust.gender : 'Unspecified';
    if (gender === 'MALE') gender = 'Male';
    else if (gender === 'FEMALE') gender = 'Female';
    else if (gender === 'OTHER') gender = 'Other';

    if (!genderMap[gender]) genderMap[gender] = { bookings: 0, revenue: 0 };
    genderMap[gender].bookings += 1;
    genderMap[gender].revenue += b.totalAmount;

    // Age bracket
    const ageGroup = cust && cust.ageGroup ? cust.ageGroup : 'Unspecified';
    if (!ageGroupMap[ageGroup]) ageGroupMap[ageGroup] = { bookings: 0, revenue: 0 };
    ageGroupMap[ageGroup].bookings += 1;
    ageGroupMap[ageGroup].revenue += b.totalAmount;

    // Group profile style
    let groupStyle = cust && cust.groupStyle ? cust.groupStyle : 'Unspecified';
    if (groupStyle === 'SINGLE') groupStyle = 'Solo Traveler';
    else if (groupStyle === 'COUPLE') groupStyle = 'Couple';
    else if (groupStyle === 'FAMILY') groupStyle = 'Family';

    if (!groupStyleMap[groupStyle]) groupStyleMap[groupStyle] = { bookings: 0, revenue: 0 };
    groupStyleMap[groupStyle].bookings += 1;
    groupStyleMap[groupStyle].revenue += b.totalAmount;
  });

  const byCountry = Object.entries(countryMap).map(([name, val]) => ({
    name,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue,
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);

  const byGender = Object.entries(genderMap).map(([name, val]) => ({
    name,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue,
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);

  const byAgeGroup = Object.entries(ageGroupMap).map(([name, val]) => ({
    name,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue,
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);

  const byGroupStyle = Object.entries(groupStyleMap).map(([name, val]) => ({
    name,
    bookingsCount: val.bookings,
    revenueCollected: val.revenue,
  })).sort((a, b) => b.revenueCollected - a.revenueCollected);

  return {
    summary,
    revenueByRoomTable,
    bookingDetailsTable,
    demographics: {
      byCountry,
      byGender,
      byAgeGroup,
      byGroupStyle,
    },
  };
}

/**
 * Helper to convert table data into a clean CSV string
 */
export function convertToCSV(headers: string[], keys: string[], data: any[]): string {
  const headerLine = headers.join(',');
  const rowLines = data.map((item) =>
    keys
      .map((key) => {
        const val = item[key];
        if (val === undefined || val === null) return '""';
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(',')
  );
  return [headerLine, ...rowLines].join('\n');
}
