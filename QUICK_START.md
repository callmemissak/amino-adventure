# Quick Start: Peptide Atlas v2.0

**Time Required**: ~30 minutes to set up everything

---

## Step 1: Supabase Account & Project (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub/Google or email
4. Click **"New Project"**
5. Name: `peptide-atlas`
6. Set a strong database password
7. Choose region closest to you
8. Click **"Create new project"**
9. Wait 2-3 minutes for setup to complete

---

## Step 2: Run Database Setup (5 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase-setup.sql` from your project folder
4. Copy the **entire** file
5. Paste into the SQL editor
6. Click **"Run"** button (⚡ icon, top right)
7. Wait for success (green checkmark)
8. ✅ Database is ready!

---

## Step 3: Get API Keys (3 min)

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → Copy to clipboard
   - **anon public** key → Copy to clipboard
   - **service_role** key → Copy to clipboard (keep secret!)

---

## Step 4: Configure Environment Variables (2 min)

1. In your project root directory, create a new file: `.env.local`
2. Paste this (replace with your actual keys):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file
4. ⚠️ **IMPORTANT**: `.env.local` is in `.gitignore` (won't be committed to Git) ✓

---

## Step 5: Install Dependencies (5 min)

Open terminal in your project root and run:

```bash
npm install
```

This adds Supabase packages:
- `@supabase/supabase-js`
- `@supabase/auth-helpers-nextjs`
- `@supabase/auth-helpers-react`

---

## Step 6: Start Your Dev Server (2 min)

```bash
npm run dev
```

Visit: http://localhost:3000

---

## Step 7: Test Login (3 min)

1. Open your app: http://localhost:3000
2. You should see the **Auth** component with "Login" form
3. Click **"Sign Up"**
4. Enter any email and password
5. ✅ Check your email for verification link
6. Click the link to verify
7. Go back to app and **"Log In"** with your credentials
8. ✅ You should see "Logged in as: your@email.com"

---

## Step 8: Test Dashboard (5 min)

1. Create `app/dashboard/page.js`:

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

  if (loading) return <p>Loading...</p>;

  return session ? (
    <UserDashboard session={session} />
  ) : (
    <p>Please log in</p>
  );
}
```

2. Visit: http://localhost:3000/dashboard
3. Test each tab:
   - **📦 Inventory**: Add a vial (e.g., "BPC-157")
   - **📋 Protocols**: Add a protocol (e.g., "200mcg daily")
   - **📝 Injection Log**: Log an injection

---

## Step 9: Verify Data in Supabase (3 min)

1. Go back to Supabase dashboard
2. Click **"Table Editor"**
3. Open `inventory` table
4. ✅ You should see your test vial
5. Open `injection_log` table
6. ✅ You should see your test injection
7. Open `audit_log` table
8. ✅ You should see all your actions logged

---

## ✅ You're Ready!

Your Peptide Atlas now has:

✅ User authentication (email login/signup)
✅ Inventory tracking
✅ Protocol saving
✅ Injection logging with notes
✅ Automatic audit logging
✅ Row-level security (users can only see their own data)
✅ Mobile optimization
✅ PWA support

---

## 🎯 Next Steps (Optional but Recommended)

1. **Add Researcher Directory**:
   - Create `app/researchers/page.js`
   - Import `ResearcherDirectory` component
   - Customize with your favorite researchers

2. **Monitor Gmail Updates**:
   - Task `check-peptabase-gmail` is already scheduled
   - It runs every Monday at 9:05 AM
   - It monitors your "peptabase" Gmail label for updates

3. **Add Notifications (Future)**:
   - See `NOTIFICATIONS_ROADMAP.md` for email/push reminders

4. **Customize Appearance**:
   - Update colors in `app/PeptideAtlas.jsx` and components
   - Add your logo/branding
   - Adjust fonts and spacing

---

## 🆘 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
→ Run `npm install`

### "NEXT_PUBLIC_SUPABASE_URL is not set"
→ Check `.env.local` exists and has correct keys
→ Restart dev server after creating `.env.local`

### "Email confirmation not received"
→ Check spam folder
→ Resend from Supabase email verification tab

### "Row-level security violation"
→ Log in first (session required)
→ Make sure you're using the same user account

### "Getting blank page"
→ Check browser console (F12) for errors
→ Check server logs (`npm run dev` terminal output)

---

## 📞 Support

- **Supabase Help**: https://supabase.com/docs
- **Next.js Help**: https://nextjs.org/docs/app
- **Problem not listed**: Check IMPLEMENTATION_SUMMARY.md

---

## 🎉 Congratulations!

You've successfully transformed Peptide Atlas into a full-featured research platform with:

🔐 **Authentication** — Users can create accounts
📊 **Data Tracking** — Inventory, protocols, injection logs
📈 **Analytics** — Audit trail of all changes
📱 **Mobile** — Fully responsive, PWA installable
🔔 **Ready for Notifications** — Email/push reminders (future)

**Ready to monetize?** This foundation supports:
- Premium subscription tiers
- Advanced analytics
- API access
- White-label versions

**Great job! 🚀**
