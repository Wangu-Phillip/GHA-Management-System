const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("=== GHA Management System: Single-Tenant Provisioning Tool ===");
  
  const name = await askQuestion("Enter the Guesthouse Instance Name (e.g., sunset-lodge, ocean-breeze): ");
  if (!name || !/^[a-z0-9-]+$/.test(name)) {
    console.error("Error: Instance name must be lowercase alphanumeric and hyphens only.");
    process.exit(1);
  }

  const metaAppId = await askQuestion("Enter Meta App ID: ");
  const metaPhoneId = await askQuestion("Enter Meta Phone Number ID: ");
  const metaWabaId = await askQuestion("Enter Meta WABA ID: ");
  const metaToken = await askQuestion("Enter Meta System User Token: ");
  const fbAdAccountId = await askQuestion("Enter Facebook Ad Account ID (e.g., act_12345): ");
  const verifyToken = await askQuestion("Enter Webhook Verification Token (press Enter to auto-generate): ") 
    || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  console.log(`\n1. Creating isolated D1 database: gha-db-${name}...`);
  let dbId = "";
  try {
    const createOut = execSync(`npx wrangler d1 create gha-db-${name}`).toString();
    console.log(createOut);
    
    // Parse the database ID from the output
    const idMatch = createOut.match(/database_id\s*=\s*"([a-f0-9-]+)"/) || createOut.match(/ID:\s*([a-f0-9-]+)/);
    if (idMatch) {
      dbId = idMatch[1];
    } else {
      // Alternate check
      const lines = createOut.split('\n');
      for (const line of lines) {
        if (line.includes('database_id =')) {
          dbId = line.split('=')[1].replace(/["'\s]/g, '');
        }
      }
    }
  } catch (err) {
    console.error("Failed to create database. Verify wrangler login and configuration.", err.message);
    process.exit(1);
  }

  if (!dbId) {
    console.error("Could not parse database_id from wrangler output. Please retrieve it manually.");
    dbId = await askQuestion("Please enter the D1 database ID manually: ");
  }

  console.log(`\n2. Applying migration files to remote D1 database: gha-db-${name} (ID: ${dbId})...`);
  try {
    execSync(`npx wrangler d1 migrations apply gha-db-${name} --remote --y`, { stdio: 'inherit' });
  } catch (err) {
    console.error("Failed to apply migrations.", err.message);
  }

  console.log("\n3. Generating configuration snippet for wrangler.jsonc...");
  const configBlock = {
    [name]: {
      name: `gha-${name}`,
      d1_databases: [
        {
          binding: "DB",
          database_name: `gha-db-${name}`,
          database_id: dbId,
          migrations_dir: "migrations"
        }
      ],
      vars: {
        ENVIRONMENT: "production",
        META_APP_ID: metaAppId,
        META_PHONE_NUMBER_ID: metaPhoneId,
        META_WABA_ID: metaWabaId,
        META_SYSTEM_USER_TOKEN: metaToken,
        FACEBOOK_AD_ACCOUNT_ID: fbAdAccountId,
        WEBHOOK_VERIFY_TOKEN: verifyToken
      }
    }
  };

  const formattedJson = JSON.stringify(configBlock, null, 2);
  console.log("\n================ CONFIGURATION SNIPPET ================");
  console.log(formattedJson);
  console.log("=======================================================");
  
  console.log("\n4. Appending to wrangler.jsonc 'env' block if possible...");
  const wranglerPath = path.join(__dirname, '..', 'wrangler.jsonc');
  try {
    const fileContent = fs.readFileSync(wranglerPath, 'utf8');
    // Strip comments to allow JSON.parse, parse, append env, and rewrite
    const cleanContent = fileContent.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    let wranglerObj = JSON.parse(cleanContent);
    if (!wranglerObj.env) {
      wranglerObj.env = {};
    }
    wranglerObj.env[name] = configBlock[name];
    fs.writeFileSync(wranglerPath, JSON.stringify(wranglerObj, null, 2), 'utf8');
    console.log("Successfully updated wrangler.jsonc with the new environment!");
  } catch (err) {
    console.warn("Could not write directly to wrangler.jsonc. Please copy-paste the snippet above manually into the 'env' block.", err.message);
  }

  console.log(`\n=== Done! ===`);
  console.log(`To deploy this instance, run the following command:`);
  console.log(`npm run build && npx wrangler deploy --env ${name}`);
  
  rl.close();
}

main().catch(console.error);
