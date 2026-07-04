# System Restructuring & Architecture Overview: Oidaq

This document provides a quick refresher on how the platform is structured into a **Single-Tenant (Multi-Instance)** architecture on Cloudflare to bypass Meta’s restrictions, protect data privacy, and maintain control over billing and scalability.

---

## 1. Cloudflare Infrastructure (Isolated Tech Stack)

*   **The Shift**: We have moved away from a traditional multi-tenant setup where everyone shares a single database and is separated by a `tenant_id` column.
*   **The Setup**: The codebase acts as a master template. Every time you onboard a new guesthouse, you run the setup script (`node scripts/provision-instance.js`) to spin up a **completely isolated Cloudflare Worker instance** and a **dedicated, independent D1 database file** just for them (configured via Wrangler environments).
*   **The Benefit**: Zero idle infrastructure costs from Cloudflare, absolute data isolation between guesthouses, and simple database schemas with no multi-tenant routing logic.

---

## 2. Meta Apps & Centralized Billing (No App Review)

*   **The Shift**: Instead of having guesthouses create developer accounts or using a public login flow, you handle everything internally.
*   **The Setup**: You manually create an individual Meta App for each guesthouse inside **your own Meta Developer account**. Because these apps stay in "Development/Internal" mode and are only used by your business portfolio, **you completely bypass Meta's heavy App Review process**.
*   **The Billing**: You link your personal credit card to your central Meta Business Portfolio. Every single message sent across all guesthouses bills your card directly. To monetize this securely, you charge the guesthouses a fixed monthly subscription plus a pay-as-you-go, pre-paid credit system with a markup for their marketing blasts.

---

## 3. The Two-Number Strategy

To protect the guesthouse's daily operations and keep your AI data clean, you use a two-number setup:

*   **Number 1 (Existing Number)**: Stays active on the standard WhatsApp Business app on their physical phone. They use this for manual, day-to-day front desk customer service and walk-ins. Your system completely ignores this number.
*   **Number 2 (New SIM/Number)**: Linked directly to your Meta API App. This is used exclusively for automated marketing blasts, Facebook Ads click-to-chat funnels, and feeding pristine, unpolluted conversational data into your AI forecasting engine.

---

## 4. Isolated Webhooks & The Live Chat Hub

*   **The Setup**: Each client app points to its own explicit webhook URL hosted on their dedicated Cloudflare Worker (e.g., `https://gha-sunset-lodge.wanguphillip.workers.dev/webhook`).
*   **The Hub**: When a customer replies to a marketing blast, the webhook fires directly into that isolated instance. It populates a custom, **split-pane Live Chat UI** inside your web app. Guesthouse staff can click on a thread and chat back to customers in real-time.
*   **The Cost Saver**: Any reply you send back through your Live Chat interface within a 24-hour window of the customer's message is considered a customer service window and is **completely free** by Meta's pricing standards.

---

## 5. Facebook Ads via Partner Asset Sharing

*   **The Setup**: Because your Meta Apps are in Development Mode, you cannot use a standard "Log in with Facebook" button to pull ad account insights.
*   **The Workaround**: During onboarding, the guesthouse logs into their own Meta Business Suite and uses the "Partner" tab to share their **Ad Account asset** directly with your Meta Business Manager ID.
*   **The Pull**: Once shared, your Cloudflare Worker uses your own permanent, internal Admin System User Token to programmatically pull their ad metrics and pass them straight to your AI occupancy forecasting models—completely skipping OAuth setup and App Review.
