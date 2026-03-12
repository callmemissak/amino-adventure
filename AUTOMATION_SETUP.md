# Peptide Atlas Automation Setup Guide

This guide covers setting up Gmail automation, notifications, and the researcher directory.

---

## 📋 Table of Contents

1. [Researcher Directory Setup](#researcher-directory-setup)
2. [Notification Service Setup](#notification-service-setup)
3. [Gmail Automation Setup](#gmail-automation-setup)
4. [GitHub Actions Setup](#github-actions-setup)
5. [Testing & Verification](#testing--verification)

---

## 1. Researcher Directory Setup

### Step 1a: Add Researchers Table to Supabase

1. Go to your Supabase dashboard
2. Click **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase-researchers.sql`
5. Paste and run

**What this does:**
- Creates `researchers` table in database
- Adds sample data for 3 researchers
- Makes researchers publicly readable (no auth required)

### Step 1b: Update Environment (Optional)

The Researcher Directory component is now **database-backed**. You can:

**Add a researcher via API:**
```bash
curl -X POST http://localhost:3000/api/researchers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Name",
    "specialty": "Expertise Area",
    "institution": "Institution Name",
    "expertise": ["Tag1", "Tag2"],
    "pubmed_url": "https://pubmed.ncbi.nlm.nih.gov/?term=",
    "notes": "Brief notes"
  }'
```

**Update/Delete researchers:**
- Use Supabase Table Editor directly
- Researchers page updates automatically

---

## 2. Notification Service Setup

### Step 2a: Choose Email Provider

You need ONE of these three:

#### Option A: Resend (Recommended for most users)

1. Go to [resend.com](https://resend.com)
2. Create free account
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_abc123xyz...
   ```

**Cost:** Free tier includes 100 emails/day

#### Option B: SendGrid

1. Go to [sendgrid.com](https://sendgrid.com)
2. Create free account
3. Get API key
4. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.abc123xyz...
   ```

**Cost:** Free tier includes 100 emails/day

#### Option C: Gmail SMTP (Free but requires Gmail account)

1. Enable 2-factor authentication on your Gmail account
2. Create an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Add to `.env.local`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password-16-chars
   ```

**Cost:** FREE (uses your existing Gmail)

### Step 2b: Create Notification Tables in Supabase

1. Go to SQL Editor
2. New Query
3. Copy `supabase-notifications.sql`
4. Run

**Tables created:**
- `notification_log` — Track all sent notifications
- `push_subscriptions` — Store push notification subscriptions
- `notification_preferences` — User settings for reminders

### Step 2c: Add Test Secret to `.env.local`

```
NOTIFICATION_TEST_SECRET=your-secret-test-key-here
```

(Use any random string, e.g., `test-key-abc123xyz`)

### Step 2d: Test Email Notifications

1. Run your dev server: `npm run dev`
2. Test the endpoint:

```bash
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-test-key-here" \
  -d '{
    "userEmail": "your-email@example.com",
    "peptideName": "BPC-157",
    "dose": 200,
    "unit": "mcg",
    "frequency": "daily"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Email sent via [Resend|SendGrid|Gmail SMTP]",
  "details": { ... }
}
```

**Check your email:** You should receive the reminder email!

### Step 2e: Check Notification Status

```bash
curl http://localhost:3000/api/notifications/test
```

This shows:
- Which email provider is active
- If push notifications are configured
- What's needed to enable features

---

## 3. Gmail Automation Setup

### Step 3a: Set Up Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "Peptide Atlas"
3. Enable **Gmail API**:
   - Search for "Gmail API"
   - Click Enable
4. Create OAuth 2.0 Credentials:
   - Click **Create Credentials**
   - Choose **OAuth client ID**
   - Select **Desktop application**
   - Download the credentials JSON
   - Save as `.google/credentials.json` in your project

### Step 3b: Get Gmail Authentication Tokens

Use the provided script to authenticate:

```bash
node scripts/get-gmail-tokens.js
```

This will:
1. Open a browser to authorize
2. Save credentials to `.google/tokens.json`
3. Display your refresh token

**Save the refresh token!** You'll need it for automation.

### Step 3c: Add Gmail Secrets to `.env.local`

```
GMAIL_CLIENT_ID=abc123...apps.googleusercontent.com
GMAIL_CLIENT_SECRET=GOCSPX-abc123...
GMAIL_REFRESH_TOKEN=1//0gMyToken...
PEPTABASE_AUTOMATION_SECRET=your-secret-key-here
```

### Step 3d: Set Up Gmail Label

1. Open Gmail
2. Create new label: **peptabase**
3. Create a filter:
   - From: your-email (or set up forwarding rule)
   - Action: Auto-label as "peptabase"
4. This is where you'll send peptide updates!

### Step 3e: Test the Supabase Edge Function

1. Deploy Supabase Edge Function:
   ```bash
   supabase functions deploy poll-peptabase-gmail --project-id your-project
   ```

2. Test locally first:
   ```bash
   supabase functions serve
   ```

3. Call the function:
   ```bash
   curl -X POST http://localhost:54321/functions/v1/poll-peptabase-gmail \
     -H "Authorization: Bearer your-secret" \
     -d '{
       "emailContent": "## Peptide:\nname: BPC-157\ndose: 200\nunit: mcg",
       "subject": "Test Update",
       "from": "test@example.com",
       "date": "2026-03-12"
     }'
   ```

---

## 4. GitHub Actions Setup

### Step 4a: Add GitHub Secrets

1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:

```
GMAIL_CLIENT_ID=abc123...
GMAIL_CLIENT_SECRET=GOCSPX-...
GMAIL_REFRESH_TOKEN=1//0g...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
PEPTABASE_AUTOMATION_SECRET=your-key
```

### Step 4b: Test Workflow

1. Go to **Actions** tab
2. Select "Peptabase Gmail Automation"
3. Click **Run workflow** → **Run workflow**
4. Wait for completion
5. Check logs for output

**Expected output:**
```
✓ No new peptabase emails found
OR
✓ Processed: X peptides from email
```

### Step 4c: Verify Automation Schedule

The workflow runs:
- **Automatically:** Every Monday at 9:00 AM UTC
- **Manually:** You can trigger anytime via GitHub Actions tab

To change the schedule, edit `.github/workflows/peptabase-automation.yml`:

```yaml
schedule:
  - cron: '0 9 * * 1'  # Change this line
```

Cron format: `minute hour day-of-month month day-of-week`
- `'0 9 * * 1'` = Monday 9:00 AM UTC
- `'0 10 * * *'` = Every day at 10:00 AM UTC
- `'*/30 * * * *'` = Every 30 minutes

---

## 5. Testing & Verification

### Test 1: Researcher Directory

```bash
# Should return list of researchers
curl http://localhost:3000/api/researchers

# Expected response:
# [
#   {
#     "id": "uuid",
#     "name": "Dr. Vladimir Seiwerth",
#     "specialty": "Peptide Healing & Regeneration",
#     ...
#   }
# ]
```

### Test 2: Notification System

```bash
# Check configuration
curl http://localhost:3000/api/notifications/test

# Send test email
curl -X POST http://localhost:3000/api/notifications/test \
  -H "Authorization: Bearer your-secret-key" \
  -d '{
    "userEmail": "your@email.com",
    "peptideName": "Test Peptide",
    "dose": "100",
    "unit": "mcg"
  }'
```

### Test 3: Gmail Automation

```bash
# Trigger workflow manually from GitHub Actions tab
# OR run locally:
GMAIL_CLIENT_ID=xxx \
GMAIL_CLIENT_SECRET=xxx \
GMAIL_REFRESH_TOKEN=xxx \
PEPTABASE_AUTOMATION_SECRET=xxx \
node scripts/peptabase-poller.js
```

### Test 4: Database Verification

**In Supabase:**

1. Check `notification_log` table:
   ```sql
   SELECT * FROM notification_log ORDER BY sent_at DESC LIMIT 10;
   ```

2. Check `researchers` table:
   ```sql
   SELECT * FROM researchers;
   ```

3. Check `peptabase_update_log` table:
   ```sql
   SELECT * FROM peptabase_update_log ORDER BY processed_at DESC LIMIT 5;
   ```

---

## 🔧 Configuration Checklist

- [ ] Email provider configured (Resend/SendGrid/Gmail)
- [ ] `NOTIFICATION_TEST_SECRET` in `.env.local`
- [ ] Notification tables created in Supabase
- [ ] Researcher directory table created in Supabase
- [ ] Gmail API credentials obtained
- [ ] Gmail refresh token in `.env.local`
- [ ] Gmail "peptabase" label created
- [ ] Supabase Edge Function deployed
- [ ] GitHub Secrets added
- [ ] GitHub Actions workflow verified

---

## 📧 Email Template

When you send a peptide update email to your "peptabase" label, use this format:

```
Subject: Peptide Update - March 2026

## Peptide:
name: BPC-157
dose: 200
unit: mcg
frequency: daily
category: Healing & Recovery
mechanism: Tissue repair and regeneration
applications: Tendon healing, GI protection
half-life: 4-6 hours
administration: Subcutaneous injection
pubmed: https://pubmed.ncbi.nlm.nih.gov/?term=BPC-157
```

The parser will extract:
- Peptide name
- Dosage and unit
- Frequency
- Category
- Mechanism of action
- Research applications
- Half-life
- Administration method
- PubMed links

---

## 🚨 Troubleshooting

### "Email provider configured but not working"
- Verify API key is correct
- Check Gmail/Resend/SendGrid dashboard for errors
- Check email spam folder
- Verify recipient email is valid

### "GitHub Actions workflow failing"
- Check GitHub Secrets are spelled correctly
- Verify they match your `.env.local` exactly
- Check workflow logs for detailed error
- Test locally first with `peptabase-poller.js`

### "Gmail not finding peptabase emails"
- Verify label exists: `label:peptabase is:unread`
- Check you have emails in that label
- Gmail API might need re-authentication
- Check scopes include `gmail.modify`

### "Supabase Edge Function not deploying"
- Verify you're logged into Supabase CLI: `supabase login`
- Check project ID: `supabase projects list`
- Try: `supabase functions deploy --project-id your-id`

---

## 🎯 Next Steps

1. ✅ **This week**: Complete setup steps 1-5
2. ✅ **This week**: Test each component individually
3. **Next week**: Send a test peptide update via email
4. **Monitor**: Check `peptabase_update_log` in Supabase
5. **Iterate**: Refine the update email template based on results

---

## 📞 Need Help?

- **Gmail API:** See [Google's Gmail API Docs](https://developers.google.com/gmail/api)
- **Supabase:** See [Supabase Docs](https://supabase.com/docs)
- **GitHub Actions:** See [GitHub's Actions Guide](https://docs.github.com/en/actions)
- **Your tasks:** Check `.claude/scheduled-tasks/check-peptabase-gmail/`

---

## 🎉 When Complete

You'll have:
- ✅ Database-backed researcher directory
- ✅ Automatic email reminders
- ✅ Gmail automation for peptide updates
- ✅ Comprehensive audit logging
- ✅ Full production-ready system

**Your Peptide Atlas is now enterprise-ready! 🚀**
