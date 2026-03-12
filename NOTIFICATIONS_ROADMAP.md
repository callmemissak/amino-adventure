# Notifications Roadmap for Peptide Atlas

This document outlines how to add email and push notifications for injection reminders, protocol milestones, and audit alerts.

---

## Current State

✅ **Completed**:
- User authentication with email
- Injection logging with dates
- Protocol scheduling with start/end dates
- Audit trail of all changes
- Database structure ready for notifications

❌ **Not Yet Implemented**:
- Email reminders
- Push notifications
- Scheduling engine
- Notification preferences

---

## Phase 1: Email Reminders (Recommended First)

Email reminders are simpler to implement and have high delivery rates.

### Option A: Using Supabase Edge Functions + SendGrid

1. **Create Supabase Edge Function**:
   ```bash
   supabase functions new send-injection-reminder
   ```

2. **Function code** (`supabase/functions/send-injection-reminder/index.ts`):
   ```typescript
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

   const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
   const supabaseUrl = Deno.env.get("SUPABASE_URL");
   const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

   serve(async (req) => {
     const supabase = createClient(supabaseUrl, supabaseKey);

     // Get protocols where start_date is today and frequency includes "daily"
     const today = new Date().toISOString().split("T")[0];
     const { data: protocols } = await supabase
       .from("protocols")
       .select("*")
       .eq("start_date", today)
       .ilike("frequency", "%daily%");

     for (const protocol of protocols) {
       // Get user email
       const { data: user } = await supabase
         .from("profiles")
         .select("email")
         .eq("id", protocol.user_id)
         .single();

       if (!user?.email) continue;

       // Send email via SendGrid
       await fetch("https://api.sendgrid.com/v3/mail/send", {
         method: "POST",
         headers: {
           Authorization: `Bearer ${SENDGRID_API_KEY}`,
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           personalizations: [
             {
               to: [{ email: user.email }],
               subject: `Peptide Atlas: ${protocol.peptide_name} Reminder`,
             },
           ],
           from: { email: "noreply@peptide-atlas.com" },
           content: [
             {
               type: "text/html",
               value: `
                 <h2>${protocol.peptide_name}</h2>
                 <p>Today's dose: ${protocol.dose} ${protocol.unit}</p>
                 <p>Frequency: ${protocol.frequency}</p>
                 <p>Location: ${protocol.injection_location}</p>
                 <a href="https://peptide-atlas.vercel.app/dashboard">Log your injection →</a>
               `,
             },
           ],
         }),
       });
     }

     return new Response("Reminders sent", { status: 200 });
   });
   ```

3. **Set up cron job** in Supabase dashboard:
   - Go to **Edge Functions**
   - Create scheduled function to run daily at 9:00 AM

4. **Set environment variables**:
   - Add `SENDGRID_API_KEY` in Supabase project settings

### Option B: Using a Serverless Function (e.g., Vercel Cron)

Create `api/cron/send-reminders.js` in your Next.js project:

```javascript
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  // Verify cron secret
  if (req.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // Get protocols for today
    const { data: protocols } = await supabase
      .from("protocols")
      .select("*")
      .eq("start_date", today)
      .ilike("frequency", "%daily%");

    for (const protocol of protocols) {
      const { data: user } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", protocol.user_id)
        .single();

      if (!user?.email) continue;

      await transporter.sendMail({
        from: "Peptide Atlas <noreply@peptide-atlas.com>",
        to: user.email,
        subject: `Reminder: ${protocol.peptide_name} Injection`,
        html: `
          <h2>${protocol.peptide_name}</h2>
          <p>Today's dose: <strong>${protocol.dose} ${protocol.unit}</strong></p>
          <p>Frequency: ${protocol.frequency}</p>
          <p>Location: ${protocol.injection_location}</p>
          <a href="https://peptide-atlas.vercel.app/dashboard">
            Log your injection →
          </a>
        `,
      });
    }

    res.status(200).json({ sent: protocols.length });
  } catch (error) {
    console.error("Reminder error:", error);
    res.status(500).json({ error: error.message });
  }
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 9 * * *"
    }
  ]
}
```

---

## Phase 2: Push Notifications (Web & Mobile)

Push notifications work on installed PWA (which you already have!).

### Using Web Push API + Service Worker

1. **Generate VAPID keys**:
   ```bash
   npm install -g web-push
   web-push generate-vapid-keys
   ```

2. **Store in `.env.local`**:
   ```
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-public-key
   VAPID_PRIVATE_KEY=your-private-key
   ```

3. **Update service worker** (`public/sw.js`):
   ```javascript
   self.addEventListener("push", (event) => {
     const data = event.data?.json() ?? {};
     const options = {
       body: data.body || "Peptide Atlas Reminder",
       icon: "/icons/icon-192.svg",
       badge: "/icons/icon-72.svg",
       tag: "peptide-reminder",
       requireInteraction: true,
     };

     event.waitUntil(self.registration.showNotification(data.title, options));
   });

   self.addEventListener("notificationclick", (event) => {
     event.notification.close();
     event.waitUntil(clients.matchAll({ type: "window" }).then((windows) => {
       if (windows.length > 0) {
         windows[0].focus();
       }
     }));
   });
   ```

4. **Subscribe users** (`app/NotificationSettings.jsx`):
   ```jsx
   "use client";

   import { useState, useEffect } from "react";

   export default function NotificationSettings({ userId }) {
     const [isSubscribed, setIsSubscribed] = useState(false);

     const subscribeToNotifications = async () => {
       const registration = await navigator.serviceWorker.ready;
       const subscription = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
       });

       // Save subscription to Supabase
       await fetch("/api/notifications/subscribe", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           userId,
           subscription: subscription.toJSON(),
         }),
       });

       setIsSubscribed(true);
     };

     return (
       <button onClick={subscribeToNotifications}>
         {isSubscribed ? "✓ Notifications Enabled" : "Enable Notifications"}
       </button>
     );
   }
   ```

5. **Send push notifications**:
   ```javascript
   // api/notifications/send-push.js
   import webpush from "web-push";
   import { supabase } from "@/lib/supabase";

   webpush.setVapidDetails(
     "mailto:you@example.com",
     process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
     process.env.VAPID_PRIVATE_KEY
   );

   export default async function handler(req, res) {
     const { userId, title, body } = req.body;

     // Get user's push subscription
     const { data: subscription } = await supabase
       .from("push_subscriptions")
       .select("subscription")
       .eq("user_id", userId)
       .single();

     if (!subscription) {
       return res.status(404).json({ error: "User not subscribed" });
     }

     try {
       await webpush.sendNotification(subscription.subscription, {
         title,
         body,
       });
       res.status(200).json({ sent: true });
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   }
   ```

---

## Phase 3: Notification Preferences

Add a `notification_preferences` table to Supabase:

```sql
CREATE TABLE notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_reminders BOOLEAN DEFAULT true,
  push_reminders BOOLEAN DEFAULT true,
  reminder_time TEXT DEFAULT '09:00', -- 24-hour format
  reminder_frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'never'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users manage own preferences"
  ON notification_preferences FOR ALL
  USING (auth.uid() = user_id);
```

Create `app/NotificationPreferences.jsx`:

```jsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationPreferences({ userId }) {
  const [prefs, setPrefs] = useState({
    email_reminders: true,
    push_reminders: true,
    reminder_time: "09:00",
    reminder_frequency: "daily",
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      const { data } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (data) setPrefs(data);
    };

    fetchPrefs();
  }, [userId]);

  const updatePrefs = async () => {
    await supabase
      .from("notification_preferences")
      .upsert({ user_id: userId, ...prefs }, { onConflict: "user_id" });
  };

  return (
    <div>
      <h3>Notification Settings</h3>

      <label>
        <input
          type="checkbox"
          checked={prefs.email_reminders}
          onChange={(e) =>
            setPrefs({ ...prefs, email_reminders: e.target.checked })
          }
        />
        Email Reminders
      </label>

      <label>
        <input
          type="checkbox"
          checked={prefs.push_reminders}
          onChange={(e) =>
            setPrefs({ ...prefs, push_reminders: e.target.checked })
          }
        />
        Push Notifications
      </label>

      <label>
        Reminder Time:
        <input
          type="time"
          value={prefs.reminder_time}
          onChange={(e) =>
            setPrefs({ ...prefs, reminder_time: e.target.value })
          }
        />
      </label>

      <label>
        Frequency:
        <select
          value={prefs.reminder_frequency}
          onChange={(e) =>
            setPrefs({ ...prefs, reminder_frequency: e.target.value })
          }
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
      </label>

      <button onClick={updatePrefs}>Save Preferences</button>
    </div>
  );
}
```

---

## Implementation Priority

1. **Phase 1 (Email)** — Easiest, highest reliability
   - Estimated: 2-4 hours
   - Immediate value: Users get daily reminders
   - Cost: Free tier available (SendGrid, Gmail)

2. **Phase 2 (Push Notifications)** — Medium complexity
   - Estimated: 4-6 hours
   - Value: Works even when browser closed (PWA)
   - Cost: Free

3. **Phase 3 (Preferences)** — Polishing
   - Estimated: 2-3 hours
   - Value: Users control reminder frequency/time
   - Cost: Free

---

## Testing Reminders Locally

Use a Node.js script to test without waiting for cron:

```javascript
// test-reminders.js
import { supabase } from "./lib/supabase.js";

async function testReminders() {
  const today = new Date().toISOString().split("T")[0];
  console.log("Testing reminders for:", today);

  const { data: protocols } = await supabase
    .from("protocols")
    .select("*")
    .eq("start_date", today);

  console.log("Found protocols:", protocols?.length);

  for (const protocol of protocols || []) {
    console.log(`Reminder: ${protocol.peptide_name} - ${protocol.dose} ${protocol.unit}`);
  }
}

testReminders().catch(console.error);
```

Run with:
```bash
node --loader sucrase/register test-reminders.js
```

---

## Next: Build It!

When you're ready to add notifications:

1. Choose **Email** (Phase 1) for quick implementation
2. Set up SendGrid or Gmail SMTP
3. Create the cron function
4. Test with a few users
5. Iterate based on feedback
6. Add **Push Notifications** (Phase 2) for PWA users
7. Add **Preferences** (Phase 3) for customization

This will make Peptide Atlas significantly more valuable to your users and open up premium subscription opportunities!
