import type { AppPrisma } from '../db/prisma';

export interface WhatsAppConfig {
  phoneId: string;
  token: string;
  businessId?: string;
}

/**
 * Triggers a real Meta WhatsApp Cloud API request if configured,
 * otherwise simulates a realistic mock delivery and logs the result.
 */
export async function sendWhatsAppMessage(
  prisma: AppPrisma,
  params: {
    guesthouseId: string;
    phone: string;
    content: string;
    messageType: 'PROMO' | 'REVIEW_REQUEST' | 'GENERAL';
    bookingId?: string;
    campaignId?: string;
    config?: WhatsAppConfig;
  }
): Promise<{ success: boolean; messageId: string; status: string; contentSent: string }> {
  const { guesthouseId, phone, content, messageType, bookingId, campaignId, config } = params;
  const messageId = `wa-msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const normalizedPhone = phone.replace(/[\s\-\+]/g, '');

  // 1. Check if Custom QR Device is linked in Firebase Cloud Functions
  let isQrLinked = false;
  try {
    const statusRes = await fetch(
      `https://us-central1-gha-management.cloudfunctions.net/getSessionStatus?guesthouseId=${guesthouseId}`
    );
    if (statusRes.ok) {
      const statusData: any = await statusRes.json();
      if (statusData.status === 'LINKED') {
        isQrLinked = true;
      }
    }
  } catch (err) {
    console.error(`Failed to check Firebase WhatsApp session status: ${err}`);
  }

  if (isQrLinked) {
    try {
      const response = await fetch('https://us-central1-gha-management.cloudfunctions.net/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guesthouseId,
          phone: normalizedPhone,
          content
        })
      });

      const data: any = await response.json();
      if (response.ok && data.success) {
        await prisma.messageLog.create({
          data: {
            guesthouseId,
            bookingId,
            campaignId,
            phone,
            wamid: data.messageId || null,
            direction: 'OUTBOUND',
            messageType,
            content,
            status: 'DELIVERED',
          },
        });
        return {
          success: true,
          messageId: data.messageId || messageId,
          status: 'DELIVERED',
          contentSent: content,
        };
      }
      throw new Error(data.error || 'Firebase Cloud Function dispatch failure');
    } catch (err: any) {
      console.error(`Firebase WhatsApp dispatch failed: ${err.message}`);
      await prisma.messageLog.create({
        data: {
          guesthouseId,
          bookingId,
          campaignId,
          phone,
          direction: 'OUTBOUND',
          messageType,
          content,
          status: 'FAILED',
        },
      });
      return { success: false, messageId, status: 'FAILED', contentSent: content };
    }
  }

  // 2. Real Meta Cloud API path.
  if (config && config.phoneId && config.token && config.token !== 'EAAGb0ZC...') {
    try {
      const url = `https://graph.facebook.com/v18.0/${config.phoneId}/messages`;

      const payload: any = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
      };

      payload.type = 'text';
      payload.text = { preview_url: true, body: content };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();
      if (response.ok) {
        await prisma.messageLog.create({
          data: {
            guesthouseId,
            bookingId,
            campaignId,
            phone,
            wamid: data.messages?.[0]?.id || null,
            direction: 'OUTBOUND',
            messageType,
            content,
            status: 'SENT',
          },
        });
        return {
          success: true,
          messageId: data.messages?.[0]?.id || messageId,
          status: 'SENT',
          contentSent: content,
        };
      }
      throw new Error(data.error?.message || 'Meta API failure');
    } catch (err: any) {
      console.error(`Meta WhatsApp dispatch failed: ${err.message}`);
      await prisma.messageLog.create({
        data: {
          guesthouseId,
          bookingId,
          campaignId,
          phone,
          direction: 'OUTBOUND',
          messageType,
          content,
          status: 'FAILED',
        },
      });
      return { success: false, messageId, status: 'FAILED', contentSent: content };
    }
  }

  // Sandbox simulation.
  let finalStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' = 'DELIVERED';
  if (messageType === 'PROMO') {
    const r = Math.random();
    if (r < 0.55) finalStatus = 'READ';
    else if (r < 0.8) finalStatus = 'DELIVERED';
    else if (r < 0.95) finalStatus = 'SENT';
    else finalStatus = 'FAILED';
  }

  await prisma.messageLog.create({
    data: {
      guesthouseId,
      bookingId,
      campaignId,
      phone,
      direction: 'OUTBOUND',
      messageType,
      content,
      status: finalStatus,
    },
  });

  // Simulate reply + occasional booking on successful promo reads.
  if (finalStatus === 'READ' && messageType === 'PROMO' && campaignId) {
    if (Math.random() < 0.6) {
      const replies = [
        'Sounds like an amazing offer! Count me in. Just booked!',
        'Thanks for this discount. What rooms are available next weekend?',
        'Perfect! Pula! We loved our stay and would love to visit again.',
        'Is the coupon code SUMMER15 also valid for premium suites?',
      ];
      const replyContent = replies[Math.floor(Math.random() * replies.length)];

      await prisma.messageLog.create({
        data: {
          guesthouseId,
          campaignId,
          phone,
          direction: 'INBOUND',
          messageType: 'GENERAL',
          content: replyContent,
          status: 'READ',
        },
      });

      const customer = await prisma.customer.findFirst({
        where: { guesthouseId, phone },
      });
      const customerName = customer ? customer.name : 'Valued Guest';

      if (Math.random() < 0.5) {
        const rooms = ['Executive Suite', 'Deluxe Room', 'Garden Cottage', 'Standard Room'];
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 1);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 3) + 1);

        await prisma.booking.create({
          data: {
            guesthouseId,
            customerName,
            customerEmail: customer?.email || 'guest@example.com',
            customerPhone: phone,
            roomName: rooms[Math.floor(Math.random() * rooms.length)],
            checkIn,
            checkOut,
            status: Math.random() > 0.4 ? 'CHECKED_IN' : 'CONFIRMED',
            totalAmount: Math.floor(Math.random() * 800) + 350,
          },
        });
      }
    }
  }

  return {
    success: finalStatus !== 'FAILED',
    messageId,
    status: finalStatus,
    contentSent: content,
  };
}

/**
 * Sends review invites to bookings checking out today.
 */
export async function runCheckoutReviewAutomation(
  prisma: AppPrisma,
  guesthouseId: string
): Promise<{ processed: number; sent: number }> {
  const guesthouse = await prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
  if (!guesthouse) return { processed: 0, sent: 0 };

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const eligible = await prisma.booking.findMany({
    where: {
      guesthouseId,
      checkOut: { gte: startOfDay, lte: endOfDay },
      reviewMessageStatus: 'PENDING',
      status: { in: ['CHECKED_OUT', 'CHECKED_IN'] },
    },
  });

  const waConfig: WhatsAppConfig | undefined =
    guesthouse.whatsappPhoneId && guesthouse.whatsappToken
      ? {
          phoneId: guesthouse.whatsappPhoneId,
          token: guesthouse.whatsappToken,
          businessId: guesthouse.whatsappBusinessId || undefined,
        }
      : undefined;

  let processed = 0;
  let sent = 0;

  for (const b of eligible) {
    processed++;
    const reviewContent = `Hi ${b.customerName}! Thank you for choosing to stay at ${guesthouse.name}. On a scale of 1 to 5, how would you rate your stay? (Please reply with a number from 1 to 5, followed by any feedback you would like to share).`;

    const result = await sendWhatsAppMessage(prisma, {
      guesthouseId,
      phone: b.customerPhone,
      content: reviewContent,
      messageType: 'REVIEW_REQUEST',
      bookingId: b.id,
      config: waConfig,
    });

    await prisma.booking.update({
      where: { id: b.id },
      data: {
        reviewMessageStatus: result.success ? 'SENT' : 'FAILED',
        reviewCollected: result.success,
      },
    });

    if (result.success) sent++;
  }

  return { processed, sent };
}

/**
 * Sends promo to opted-in customers; optional id whitelist.
 */
export async function executeMarketingCampaign(
  prisma: AppPrisma,
  guesthouseId: string,
  campaignName: string,
  templateContent: string,
  customerIds?: string[]
): Promise<{ totalOptIn: number; sent: number }> {
  const guesthouse = await prisma.guesthouse.findUnique({ where: { id: guesthouseId } });
  if (!guesthouse) return { totalOptIn: 0, sent: 0 };

  const consented = await prisma.customer.findMany({
    where: {
      guesthouseId,
      optInPromo: true,
      ...(customerIds && customerIds.length > 0 ? { id: { in: customerIds } } : {}),
    },
  });

  const waConfig: WhatsAppConfig | undefined =
    guesthouse.whatsappPhoneId && guesthouse.whatsappToken
      ? {
          phoneId: guesthouse.whatsappPhoneId,
          token: guesthouse.whatsappToken,
          businessId: guesthouse.whatsappBusinessId || undefined,
        }
      : undefined;

  const campaign = await prisma.campaign.create({
    data: {
      guesthouseId,
      name: campaignName,
      messageTemplate: templateContent.substring(0, 50),
      status: 'SENT',
      scheduledAt: new Date(),
    },
  });

  let sent = 0;
  for (const c of consented) {
    const personalized = templateContent.replace(/\{\{name\}\}/gi, c.name);
    const result = await sendWhatsAppMessage(prisma, {
      guesthouseId,
      phone: c.phone,
      content: personalized,
      messageType: 'PROMO',
      campaignId: campaign.id,
      config: waConfig,
    });
    if (result.success) sent++;
  }

  return { totalOptIn: consented.length, sent };
}
