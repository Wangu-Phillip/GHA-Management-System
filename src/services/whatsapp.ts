import { memoryDb } from '../db/prisma';

// Interface for WhatsApp configuration
export interface WhatsAppConfig {
  phoneId: string;
  token: string;
  businessId?: string;
}

/**
 * Triggers a real Meta WhatsApp Cloud API request if configured,
 * otherwise simulates a highly realistic mock delivery and logs the result.
 */
export async function sendWhatsAppMessage(params: {
  guesthouseId: string;
  phone: string;
  content: string;
  messageType: 'PROMO' | 'REVIEW_REQUEST' | 'GENERAL';
  bookingId?: string;
  campaignId?: string;
  config?: WhatsAppConfig;
}): Promise<{ success: boolean; messageId: string; status: string; contentSent: string }> {
  const { guesthouseId, phone, content, messageType, bookingId, campaignId, config } = params;
  const messageId = `wa-msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Normalize phone number (remove space, dash, plus)
  const normalizedPhone = phone.replace(/[\s\-\+]/g, '');

  // If real Meta Cloud API is configured, we make an actual HTTP request
  if (config && config.phoneId && config.token && config.token !== 'EAAGb0ZC...') {
    try {
      console.log(`Attempting real Meta WhatsApp Cloud API delivery to +${normalizedPhone}...`);
      const url = `https://graph.facebook.com/v18.0/${config.phoneId}/messages`;
      
      // Determine template usage or fallback text message
      const payload: any = {
        messaging_product: 'whatsapp',
        to: normalizedPhone,
      };

      if (messageType === 'REVIEW_REQUEST') {
        // Typically review requests use standard templates, e.g. "checkout_feedback"
        payload.type = 'template';
        payload.template = {
          name: 'checkout_feedback',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: content.substring(0, 100) } // parameter dynamic injection
              ]
            }
          ]
        };
      } else {
        payload.type = 'text';
        payload.text = { preview_url: true, body: content };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(`WhatsApp API successfully delivered message. Meta ID: ${data.messages?.[0]?.id}`);
        
        // Log message to DB
        await memoryDb.messageLog.create({
          guesthouseId,
          bookingId,
          campaignId,
          phone: phone,
          direction: 'OUTBOUND',
          messageType,
          content,
          status: 'DELIVERED',
        });

        return { success: true, messageId: data.messages?.[0]?.id || messageId, status: 'DELIVERED', contentSent: content };
      } else {
        console.error('Meta API responded with error:', data);
        throw new Error(data.error?.message || 'Meta API failure');
      }
    } catch (err: any) {
      console.error(`Meta WhatsApp dispatch failed: ${err.message}. Saving as FAILED log.`);
      await memoryDb.messageLog.create({
        guesthouseId,
        bookingId,
        campaignId,
        phone,
        direction: 'OUTBOUND',
        messageType,
        content,
        status: 'FAILED',
      });
      return { success: false, messageId, status: 'FAILED', contentSent: content };
    }
  }

  // Fallback / Sandbox Demo Mode Delivery simulation
  console.log(`[WhatsApp Sandbox Demo] Message Sent to +${normalizedPhone} (${messageType}):`);
  console.log(`>> "${content}"`);

  // Simulate realistic delivery status for campaigns
  let finalStatus: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED' = 'DELIVERED';
  if (messageType === 'PROMO') {
    const statusRand = Math.random();
    if (statusRand < 0.55) {
      finalStatus = 'READ';
    } else if (statusRand < 0.8) {
      finalStatus = 'DELIVERED';
    } else if (statusRand < 0.95) {
      finalStatus = 'SENT';
    } else {
      finalStatus = 'FAILED';
    }
  }

  // Save outbound record to database logs
  await memoryDb.messageLog.create({
    guesthouseId,
    bookingId,
    campaignId,
    phone,
    direction: 'OUTBOUND',
    messageType,
    content,
    status: finalStatus,
  });

  // If status is READ and it's a campaign promo, simulate replies and bookings
  if (finalStatus === 'READ' && messageType === 'PROMO' && campaignId) {
    const replyChance = Math.random();
    if (replyChance < 0.6) {
      const replies = [
        "Sounds like an amazing offer! Count me in. Just booked!",
        "Thanks for this discount. What rooms are available next weekend?",
        "Perfect! Pula! We loved our stay and would love to visit again.",
        "Is the coupon code SUMMER15 also valid for premium suites?"
      ];
      const replyContent = replies[Math.floor(Math.random() * replies.length)];
      
      // Save Inbound Reply Log
      await memoryDb.messageLog.create({
        guesthouseId,
        campaignId,
        phone,
        direction: 'INBOUND',
        messageType: 'GENERAL',
        content: replyContent,
        status: 'READ',
      });

      // Find customer info
      const customers = await memoryDb.customer.findMany(guesthouseId);
      const customer = customers.find(c => c.phone === phone);
      const customerName = customer ? customer.name : 'Valued Guest';

      // 50% chance they book and show up!
      if (Math.random() < 0.5) {
        const rooms = ["Executive Suite", "Deluxe Room", "Garden Cottage", "Standard Room"];
        const selectedRoom = rooms[Math.floor(Math.random() * rooms.length)];
        
        const checkIn = new Date();
        checkIn.setDate(checkIn.getDate() + Math.floor(Math.random() * 7) + 1);
        const checkOut = new Date(checkIn);
        checkOut.setDate(checkOut.getDate() + Math.floor(Math.random() * 3) + 1);

        // Create booking in system
        await memoryDb.booking.create({
          guesthouseId,
          customerName,
          customerEmail: customer?.email || 'guest@example.com',
          customerPhone: phone,
          roomName: selectedRoom,
          checkIn,
          checkOut,
          status: Math.random() > 0.4 ? 'CHECKED_IN' : 'CONFIRMED',
          totalAmount: Math.floor(Math.random() * 800) + 350,
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
 * Automation task: Runs daily/hourly to collect review invitations from checked-out bookings.
 * Grabs all bookings ending on the current date, drafts a review link, and triggers WhatsApp.
 */
export async function runCheckoutReviewAutomation(guesthouseId: string): Promise<{ processed: number; sent: number }> {
  // Grab all bookings for this tenant
  const bookings = await memoryDb.booking.findMany(guesthouseId);
  const guesthouse = await memoryDb.guesthouse.findUnique(guesthouseId);

  if (!guesthouse) {
    return { processed: 0, sent: 0 };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  let processed = 0;
  let sent = 0;

  // Filter bookings where checkout is today and status is CHECKED_OUT or active checkouts
  const eligibleCheckouts = bookings.filter((b) => {
    const isCheckoutToday = b.checkOut.toISOString().split('T')[0] === todayStr;
    const isPendingReview = b.reviewMessageStatus === 'PENDING';
    const isCompleted = b.status === 'CHECKED_OUT' || b.status === 'CHECKED_IN';
    return isCheckoutToday && isPendingReview && isCompleted;
  });

  const waConfig: WhatsAppConfig | undefined = guesthouse.whatsappPhoneId && guesthouse.whatsappToken ? {
    phoneId: guesthouse.whatsappPhoneId,
    token: guesthouse.whatsappToken,
    businessId: guesthouse.whatsappBusinessId || undefined
  } : undefined;

  for (const b of eligibleCheckouts) {
    processed++;
    
    // Construct friendly review collection copy
    const reviewContent = `Hi ${b.customerName}! Thank you for staying at ${guesthouse.name}. We hope you had a lovely checkout today. Please take 30 seconds to share your review with us: https://g.page/${guesthouse.name.toLowerCase().replace(/[^a-z0-9]/g, '')}/review`;
    
    const result = await sendWhatsAppMessage({
      guesthouseId,
      phone: b.customerPhone,
      content: reviewContent,
      messageType: 'REVIEW_REQUEST',
      bookingId: b.id,
      config: waConfig,
    });

    if (result.success) {
      b.reviewMessageStatus = 'SENT';
      b.reviewCollected = true;
      sent++;
    } else {
      b.reviewMessageStatus = 'FAILED';
    }
    
    // Update booking state
    await memoryDb.booking.update(b.id, {
      reviewMessageStatus: b.reviewMessageStatus,
      reviewCollected: b.reviewCollected,
    });
  }

  return { processed, sent };
}

/**
 * Automation task: Sends promotional campaign messages to ALL customers
 * who have explicitly opted-in to receive promotional updates (optInPromo === true)
 */
export async function executeMarketingCampaign(
  guesthouseId: string,
  campaignName: string,
  templateContent: string,
  customerIds?: string[]
): Promise<{ totalOptIn: number; sent: number }> {
  const guesthouse = await memoryDb.guesthouse.findUnique(guesthouseId);
  if (!guesthouse) return { totalOptIn: 0, sent: 0 };

  const customers = await memoryDb.customer.findMany(guesthouseId);
  // Botswana DPA filter: strictly optInPromo === true
  let consentedCustomers = customers.filter((c) => c.optInPromo);

  if (customerIds && customerIds.length > 0) {
    consentedCustomers = consentedCustomers.filter((c) => customerIds.includes(c.id));
  }

  const waConfig: WhatsAppConfig | undefined = guesthouse.whatsappPhoneId && guesthouse.whatsappToken ? {
    phoneId: guesthouse.whatsappPhoneId,
    token: guesthouse.whatsappToken,
    businessId: guesthouse.whatsappBusinessId || undefined
  } : undefined;

  let sent = 0;

  // Create Campaign DB Record
  const campaign = await memoryDb.campaign.create({
    guesthouseId,
    name: campaignName,
    messageTemplate: templateContent.substring(0, 50),
    status: 'SENT',
    scheduledAt: new Date(),
  });

  for (const c of consentedCustomers) {
    // Inject customer name dynamically if token present
    const personalizedText = templateContent.replace(/{{name}}/gi, c.name);

    const result = await sendWhatsAppMessage({
      guesthouseId,
      phone: c.phone,
      content: personalizedText,
      messageType: 'PROMO',
      campaignId: campaign.id,
      config: waConfig,
    });

    if (result.success) {
      sent++;
    }
  }

  return { totalOptIn: consentedCustomers.length, sent };
}
