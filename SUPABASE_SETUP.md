# Supabase Setup Guide for Peptide Atlas

This guide walks you through setting up the Supabase backend for Peptide Atlas v2.0 with user authentication, inventory tracking, protocol logging, and audit trails.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **"New Project"**
3. Name it: `peptide-atlas`
4. Choose a strong database password
5. Select your region (closest to your users)
6. Click **"Create new project"** and wait 2-3 minutes

---

## 2. Run the SQL Setup Script

Once your project is created:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Click **"New Query"**
3. Copy the entire contents of `supabase-setup.sql` from your project root
4. Paste it into the SQL editor
5. Click **"Run"** (⚡ icon)
6. Verify there are no errors (green checkmark)

This creates:
- `profiles` — User profile data
- `inventory` — Track peptide vials
- `protocols` — Save research protocols/cycles
- `injection_log` — Log individual injections with notes
- `audit_log` — Track all data changes
- Row-level security policies (users can only see their own data)
- Auto-audit triggers (all changes are logged)

---

## 3. Get Your API Keys

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

---

## 4. Configure Environment Variables

1. In your project root, create `.env.local` (if it doesn't exist):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

2. **Never commit `.env.local` to Git!** (It's already in `.gitignore`)

---

## 5. Install Dependencies

```bash
npm install
```

This adds:
- `@supabase/supabase-js` — Supabase client
- `@supabase/auth-helpers-nextjs` — Next.js auth middleware
- `@supabase/auth-helpers-react` — React auth hooks

---

## 6. Enable Auth in Supabase

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Ensure **Email** provider is enabled (it's on by default)
3. Optionally enable **Google**, **GitHub**, etc. for OAuth

---

## 7. Integrate Auth & Dashboard into Your App

The following components are ready to use:

### Auth Component (`app/Auth.jsx`)
Shows a login/signup form. Users who are logged in see an "Account" card with a logout button.

### UserDashboard Component (`app/UserDashboard.jsx`)
Full-featured dashboard with three tabs:
- **📦 Inventory** — Track vials (name, size, quantity, COA, purchase date)
- **📋 Protocols** — Save research protocols (peptide, dose, frequency, dates, location)
- **📝 Injection Log** — Log individual injections with **Summary Notes** for cycle effects/side effects

### Updated PeptideAtlas.jsx
Already configured to fetch peptides from the database. You can add Auth/Dashboard pages.

---

## 8. Add Auth Page to Your App

Create `app/page-auth.js` (or update your main page):

```jsx
import Auth from "./Auth";

export default function Page() {
  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ color: "#e2ddd5" }}>Peptide Atlas Account</h1>
      <Auth />
    </div>
  );
}
```

---

## 9. Add Dashboard Page

Create `app/dashboard/page.js`:

```jsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import UserDashboard from "../UserDashboard";

export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  if (loading) return <p style={{ color: "#e2ddd5" }}>Loading...</p>;

  return (
    <div>
      {session ? (
        <UserDashboard session={session} />
      ) : (
        <div style={{ padding: "40px", color: "#e2ddd5", textAlign: "center" }}>
          <p>Please log in to access your dashboard.</p>
          <p>
            <a href="/" style={{ color: "#34d399" }}>
              Go to login
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 10. Test the Integration

1. Run your dev server: `npm run dev`
2. Navigate to your auth page
3. Click **"Sign Up"** and create a test account
4. Verify you receive a confirmation email from Supabase
5. Click the confirmation link
6. Log in with your credentials
7. Navigate to `/dashboard`
8. Test **Inventory**, **Protocols**, and **Injection Log** tabs

---

## 11. Monitor Audit Logs

All changes to inventory, protocols, and injection logs are automatically tracked in the `audit_log` table. To view:

1. Go to **SQL Editor** in Supabase
2. Run:

```sql
SELECT * FROM audit_log ORDER BY changed_at DESC LIMIT 50;
```

This shows every insert, update, and delete with old/new data values.

---

## 12. Typical Cycle Data (Optional)

If you want to add reference data for typical cycles, uncomment the `peptide_cycles` table creation in `supabase-setup.sql` and run:

```sql
CREATE TABLE peptide_cycles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  peptide_name TEXT UNIQUE,
  typical_dose TEXT,
  typical_cycle_weeks INTEGER,
  typical_break_weeks INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 13. Security Notes

- **Row-level Security (RLS)** is enabled — users can only access their own data
- **Audit logging** tracks all changes for compliance
- **API keys** in `.env.local` are never exposed to the client (public key is safe)
- **Service role key** should never be committed or exposed

---

## 14. Mobile Optimization

- **Inventory form** has mcg/mg toggle for precise dosing
- **Injection log** includes date picker and summary notes field
- **All forms** work on mobile with optimized input styling
- **Dashboard** is fully responsive

---

## Next Steps

After setup:

1. ✅ Users can create accounts and track their peptide usage
2. ✅ Inventory automatically syncs across devices
3. ✅ Injection log provides accountability and cycle summaries
4. ✅ All data changes are audited for security/compliance

For questions or issues, check the [Supabase docs](https://supabase.com/docs).
