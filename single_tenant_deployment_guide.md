# Single-Tenant Instance Deployment Guide: Oidaq

This guide explains how to provision, configure, and deploy a new private, dedicated guesthouse instance. By utilizing **Wrangler Environments**, you can deploy distinct instances using the same codebase, keeping each client’s database and credentials fully isolated.

---

## Security Golden Rule
> [!IMPORTANT]
> Never commit sensitive credentials (like Facebook Access Tokens or WhatsApp API Keys) directly to `wrangler.jsonc` or push them to GitHub. 
> Always inject sensitive credentials dynamically as encrypted **Cloudflare Secrets**. Non-sensitive settings (like database names or tenant IDs) can be declared safely in your config file.

---

## Option A: Automated Provisioning via `provision-instance.js`
Your project includes an interactive setup script that automatically creates the database, applies remote migrations, and generates the environment config.

1. Run the setup script:
   ```bash
   node scripts/provision-instance.js
   ```
2. Follow the terminal prompts to enter the guesthouse name, Meta App ID, Phone IDs, and Tokens.
3. **CRITICAL Security Step**: The script will write the configurations directly to `wrangler.jsonc`. Open `wrangler.jsonc` and delete/cut the sensitive keys (like `META_SYSTEM_USER_TOKEN`, `WEBHOOK_VERIFY_TOKEN`) from the `vars` block of the new environment.
4. Set those credentials securely on Cloudflare as encrypted Secrets instead:
   ```bash
   npx wrangler secret put META_SYSTEM_USER_TOKEN --env [guesthouse-slug]
   npx wrangler secret put WEBHOOK_VERIFY_TOKEN --env [guesthouse-slug]
   ```
5. Build and deploy the instance:
   ```bash
   npm run build && npx wrangler deploy --env [guesthouse-slug]
   ```

---

## Option B: Manual Step-by-Step Provisioning Flow

### Step 1: Create a Dedicated Database
Each client gets a dedicated, isolated database. Run the following command in your terminal to provision a new database on Cloudflare:

```bash
npx wrangler d1 create oidaq-db-[guesthouse-name]
```

This command will output a configuration block resembling:
```json
[[d1_databases]]
binding = "DB"
database_name = "oidaq-db-[guesthouse-name]"
database_id = "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

### Step 2: Register the Environment in `wrangler.jsonc`
Open `wrangler.jsonc` and add a new environment block under the `"env"` section using the database credentials returned in Step 1.

```json
"env": {
  "[guesthouse-slug]": {
    "name": "gha-[guesthouse-slug]",
    "d1_databases": [
      {
        "binding": "DB",
        "database_name": "oidaq-db-[guesthouse-name]",
        "database_id": "xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      }
    ],
    "vars": {
      "GUESTHOUSE_ID": "[generated-uuid-for-this-guesthouse]",
      "DB_MODE": "D1_SQLITE_CLOUDFLARE"
    }
  }
}
```

---

### Step 3: Apply the Database Schema
Push the database schema migrations to the newly created D1 database instance:

```bash
npx wrangler d1 migrations apply oidaq-db-[guesthouse-name] --remote
```

---

### Step 4: Securely Set Secrets (Not Saved in Git)
Configure the secret credentials for the new environment. The Wrangler CLI will prompt you for the value. These values are encrypted and stored directly in your Cloudflare account, meaning they never hit your Git repository.

Run these commands, replacing `[guesthouse-slug]` with the environment name (e.g., `sunset-lodge`):

```bash
# 1. Set WhatsApp Verify Token (used to validate your webhook connection on Meta)
npx wrangler secret put WHATSAPP_VERIFY_TOKEN --env [guesthouse-slug]

# 2. Set the platform encryption key (used to encrypt sensitive database values)
npx wrangler secret put ENCRYPTION_KEY --env [guesthouse-slug]

# 3. Set the Firebase key (if using centralized push notifications)
npx wrangler secret put FIREBASE_API_KEY --env [guesthouse-slug]
```

---

### Step 5: Deploy the Private Instance
Deploy the codebase to the dedicated Worker instance for the new client:

```bash
npx wrangler deploy --env [guesthouse-slug]
```

Once deployment is complete, Wrangler will return your client's dedicated endpoint:
`https://gha-[guesthouse-slug].[your-username].workers.dev`

---

### Step 6: Configure Meta Webhooks & API Keys
1.  **Webhook Setup**:
    *   Log into the **Meta Developer Console** under the client's dedicated Meta App.
    *   Navigate to **WhatsApp > Configuration**.
    *   Set the **Callback URL** to: `https://gha-[guesthouse-slug].[your-username].workers.dev/webhook`
    *   Set the **Verify Token** to the exact value you created in **Step 4 (Command 1)**.
    *   Subscribe to the `messages` webhook event.
2.  **Dashboard Connection (Meta Ad Account & WhatsApp API)**:
    *   Open the client's live deployment URL.
    *   Sign in and navigate to **Meta API Integration** (under WhatsApp Marketing) and the **Facebook Settings panel**.
    *   Provide the Phone ID, WhatsApp Access Token, and Meta Ad Account credentials.
    *   Saving these settings writes them directly to the private, isolated database instance.
