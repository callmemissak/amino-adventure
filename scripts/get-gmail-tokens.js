#!/usr/bin/env node

/**
 * Get Gmail OAuth Tokens
 *
 * Usage: node scripts/get-gmail-tokens.js
 *
 * This script:
 * 1. Opens browser to authorize your account
 * 2. Exchanges auth code for refresh token
 * 3. Shows you the values to add to .env.local
 */

const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const open = require("open");
const fs = require("fs");
const path = require("path");

const CREDENTIALS_PATH = path.join(__dirname, "..", ".google", "credentials.json");

async function getTokens() {
  console.log("🔐 Gmail OAuth Token Generator\n");

  // Check if credentials file exists
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error("❌ Error: credentials.json not found!");
    console.log("\nTo set up:");
    console.log("1. Go to Google Cloud Console: https://console.cloud.google.com");
    console.log("2. Create a new project: 'Peptide Atlas'");
    console.log("3. Enable Gmail API");
    console.log("4. Create OAuth 2.0 Desktop credentials");
    console.log("5. Download JSON and save to: .google/credentials.json\n");
    process.exit(1);
  }

  // Read credentials
  const credentialsData = fs.readFileSync(CREDENTIALS_PATH, "utf8");
  const credentials = JSON.parse(credentialsData);
  const clientId = credentials.installed?.client_id;
  const clientSecret = credentials.installed?.client_secret;
  const redirectUrl = "http://localhost:3000/auth/gmail/callback";

  if (!clientId || !clientSecret) {
    console.error("❌ Invalid credentials.json format");
    process.exit(1);
  }

  // Create OAuth client
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );

  // Step 1: Generate auth URL
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/gmail.readonly",
    ],
  });

  console.log("📋 Opening browser to authorize Gmail access...\n");
  console.log("If browser doesn't open, visit this URL:");
  console.log(authUrl + "\n");

  // Step 2: Start local server to catch callback
  const server = http.createServer(async (req, res) => {
    const queryUrl = url.parse(req.url, true);
    const code = queryUrl.query.code;

    if (!code) {
      res.writeHead(400);
      res.end("No authorization code received");
      process.exit(1);
    }

    // Step 3: Exchange auth code for tokens
    try {
      const { tokens } = await oauth2Client.getToken(code);

      // Display tokens
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <body style="font-family: Arial; padding: 40px;">
            <h1>✅ Success!</h1>
            <p>Your Gmail tokens have been generated. Check the terminal for details.</p>
            <p style="color: green;">You can close this window.</p>
          </body>
        </html>
      `);

      server.close();

      // Display results
      console.log("✅ Authorization successful!\n");
      console.log("📋 Add these to your .env.local file:\n");
      console.log("GMAIL_CLIENT_ID=" + clientId);
      console.log("GMAIL_CLIENT_SECRET=" + clientSecret);
      console.log("GMAIL_REFRESH_TOKEN=" + tokens.refresh_token);
      console.log("\n");
      console.log("📝 Save these values to .env.local and run: npm run dev\n");

      // Optionally save to file
      const envContent = `
# Gmail Automation
GMAIL_CLIENT_ID=${clientId}
GMAIL_CLIENT_SECRET=${clientSecret}
GMAIL_REFRESH_TOKEN=${tokens.refresh_token}
`;

      const envPath = path.join(__dirname, "..", ".env.gmail");
      fs.writeFileSync(envPath, envContent);
      console.log(`Tokens also saved to .env.gmail`);
      console.log("You can copy from there to .env.local\n");

      process.exit(0);
    } catch (error) {
      console.error("❌ Token exchange failed:", error.message);
      res.writeHead(500);
      res.end("Token exchange failed: " + error.message);
      process.exit(1);
    }
  });

  // Start server
  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`⏳ Waiting for authorization on port ${PORT}...\n`);

    // Open browser
    open(authUrl).catch((err) => {
      console.warn("Could not open browser automatically");
      console.log("Please visit the URL above manually\n");
    });
  });
}

getTokens().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
