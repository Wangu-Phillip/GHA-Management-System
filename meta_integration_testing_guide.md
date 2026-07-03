# Meta APIs (WhatsApp Cloud & Facebook Ads) Testing Guide

This guide explains how to set up, configure, and test the Meta integrations (WhatsApp Business API and Facebook Ads Manager) in the GHA Management System.

---

## 🟢 Part 1: Testing Meta WhatsApp Cloud API

The system supports Meta's official Cloud API. You can test this for free using Meta's developer sandbox.

### 1. Get Free Sandbox Credentials
1. Go to the **[Meta Developers Console](https://developers.facebook.com/)** and log in.
2. Click **Create App** → Select **Other** → Select **Business** type.
3. Scroll down on the App Dashboard, find **WhatsApp**, and click **Set Up**.
4. In the left sidebar, click **WhatsApp** → **Getting Started**.
5. Here, Meta generates free sandbox credentials for you:
   - **Temporary Access Token** (EAAGb0ZC...)
   - **Phone Number ID** (e.g., `108495029302941`)
   - **WhatsApp Business Account ID** (e.g., `984501920392019`)
6. **Add Test Recipient Phone Numbers:** In the "To" dropdown on the same page, add and verify your own phone number. *Meta Sandbox will only deliver messages to verified developer numbers.*

### 2. Configure in GHA Dashboard
1. Open your local GHA dashboard.
2. Navigate to **Marketing** → Click the **Meta API Integration** sub-tab (5th tab).
3. Input your **Phone Number ID**, **Access Token**, and **Business Account ID**.
4. Click **Update WhatsApp Number Settings**.

### 3. Send a Sandbox Template Message
1. Meta sandbox restricts outbound messages to pre-approved templates (like `hello_world` or custom-created templates) until your business account is verified.
2. To test, go to **Direct Message Sandbox** in the Marketing view.
3. Input your verified test number.
4. Input a message using the Meta template name or send a free-form message. *(Note: If your 24-hour customer-initiated window is closed, free-form messages might return a Meta policy error. You must send a template first).*

---

## 🔵 Part 2: Testing Facebook Ads Integration

The project includes a **Facebook Ads** module (`src/components/FacebookAdsView.tsx`) to track marketing campaigns and cost-per-acquisition metrics.

### 1. Configure Meta Ads API Access
To retrieve live Ad Account metrics, you need to configure access:
1. In your **Meta App Dashboard**, go to **Add Product** and select **Marketing API**.
2. Go to **Marketing API** → **Settings**.
3. Generate a **User Access Token** with the following permissions enabled:
   - `ads_management`
   - `ads_read`
   - `read_insights`
4. Copy your **Ad Account ID** (looks like `act_1234567890`).

### 2. Wire Credentials to the App
Open `src/components/FacebookAdsView.tsx` or your settings file and input the Access Token and Ad Account ID. The view will load campaigns:
- **Campaign Name:** e.g., *"Pinecrest Ridge Guesthouse - Weekend Bookings"*
- **Impressions, Reach, Link Clicks, and CTR (Click-Through Rate)**
- **Ad Spend:** Matches conversion bookings to calculate exact Return on Ad Spend (ROAS).

### 3. Using Meta Ads Sandbox
If you do not want to test with real budget or active ads, you can create a **Sandbox Ad Account**:
1. Go to your **[Meta Business Manager Settings](https://business.facebook.com/settings)**.
2. Create a test user/sandbox account.
3. Use the Sandbox Account ID (e.g. `act_default_sandbox`) to populate mock metrics inside the UI for demo calls.
