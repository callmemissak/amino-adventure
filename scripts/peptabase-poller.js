/**
 * Peptabase Gmail Poller
 * Runs on schedule (GitHub Actions) to:
 * 1. Authenticate with Gmail API
 * 2. Fetch unread emails from peptabase label
 * 3. Parse peptide updates
 * 4. Send to Supabase Edge Function for processing
 */

const { google } = require("googleapis");
const fs = require("fs");

const PEPTABASE_FUNCTION_URL = "https://your-project.supabase.co/functions/v1/poll-peptabase-gmail";

async function authenticateGmail() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "http://localhost"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  // Refresh access token
  await oauth2Client.refreshAccessToken();
  const { credentials } = oauth2Client;
  return credentials;
}

async function fetchPeptabaseEmails(accessToken) {
  const gmail = google.gmail({ version: "v1", auth: { access_token: accessToken } });

  try {
    // Fetch unread emails from peptabase label
    const response = await gmail.users.messages.list({
      userId: "me",
      q: 'label:peptabase is:unread',
      maxResults: 10,
    });

    if (!response.data.messages || response.data.messages.length === 0) {
      console.log("No new peptabase emails found");
      return [];
    }

    // Get full message content for each email
    const emails = [];
    for (const message of response.data.messages) {
      const msg = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "full",
      });

      const headers = msg.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "Unknown";
      const from = headers.find((h) => h.name === "From")?.value || "Unknown";
      const date = headers.find((h) => h.name === "Date")?.value || new Date().toISOString();

      // Extract body
      let body = "";
      if (msg.data.payload.parts) {
        for (const part of msg.data.payload.parts) {
          if (part.mimeType === "text/plain" && part.body.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
            break;
          }
        }
      } else if (msg.data.payload.body && msg.data.payload.body.data) {
        body = Buffer.from(msg.data.payload.body.data, "base64").toString("utf-8");
      }

      emails.push({
        id: message.id,
        subject,
        from,
        date,
        body,
      });
    }

    return emails;
  } catch (error) {
    console.error("Error fetching Gmail messages:", error.message);
    throw error;
  }
}

async function processPeptabaseEmails(emails) {
  const results = [];

  for (const email of emails) {
    try {
      console.log(`Processing email: "${email.subject}" from ${email.from}`);

      // Send to Supabase Edge Function
      const response = await fetch(PEPTABASE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PEPTABASE_AUTOMATION_SECRET}`,
        },
        body: JSON.stringify({
          emailContent: email.body,
          subject: email.subject,
          from: email.from,
          date: email.date,
        }),
      });

      if (!response.ok) {
        throw new Error(`Function error: ${response.status}`);
      }

      const result = await response.json();
      results.push({
        email: email.subject,
        success: result.success,
        updates: result.updates?.length || 0,
      });

      console.log(`✓ Processed: ${result.message}`);
    } catch (error) {
      console.error(`✗ Failed to process email: ${error.message}`);
      results.push({
        email: email.subject,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

async function markEmailsAsRead(gmail, messageIds) {
  // Mark processed emails as read
  for (const id of messageIds) {
    try {
      await gmail.users.messages.modify({
        userId: "me",
        id: id,
        requestBody: {
          removeLabelIds: ["UNREAD"],
        },
      });
    } catch (error) {
      console.warn(`Could not mark email ${id} as read:`, error.message);
    }
  }
}

async function main() {
  console.log("🔄 Starting Peptabase Gmail automation...");
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    // Verify required environment variables
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_REFRESH_TOKEN) {
      throw new Error("Missing Gmail credentials. Set GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN");
    }

    if (!process.env.PEPTABASE_AUTOMATION_SECRET) {
      throw new Error("Missing PEPTABASE_AUTOMATION_SECRET");
    }

    // Authenticate with Gmail
    console.log("🔐 Authenticating with Gmail...");
    const credentials = await authenticateGmail();

    // Fetch peptabase emails
    console.log("📧 Fetching peptabase emails...");
    const emails = await fetchPeptabaseEmails(credentials.access_token);

    if (emails.length === 0) {
      console.log("✓ No new updates");
      process.exit(0);
    }

    // Process emails
    console.log(`📝 Processing ${emails.length} email(s)...`);
    const results = await processPeptabaseEmails(emails);

    // Summary
    const successful = results.filter((r) => r.success).length;
    console.log(`\n✅ Summary: ${successful}/${results.length} emails processed successfully`);

    results.forEach((r) => {
      const status = r.success ? "✓" : "✗";
      console.log(`  ${status} ${r.email} (${r.updates || 0} updates)`);
    });

    if (successful === results.length) {
      console.log("\n🎉 All updates processed successfully!");
      process.exit(0);
    } else {
      console.log("\n⚠️ Some emails failed to process");
      process.exit(1);
    }
  } catch (error) {
    console.error("\n❌ Automation failed:", error.message);
    process.exit(1);
  }
}

main();
