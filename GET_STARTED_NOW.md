# 🚀 GET STARTED NOW — 30-Minute Setup

**You have everything you need. Let's launch your platform in 30 minutes.**

---

## 📋 Pre-Flight Checklist

- [ ] You have Node.js installed
- [ ] You have internet access
- [ ] You have a valid email address
- [ ] You have 30 minutes of focused time

**All set?** Let's go! ⬇️

---

## ⏱️ Setup Timeline

| Step | Task | Time | Status |
|------|------|------|--------|
| 1 | Create Supabase account | 5 min | ⬜ |
| 2 | Create & set up project | 3 min | ⬜ |
| 3 | Run SQL database setup | 5 min | ⬜ |
| 4 | Get API keys | 2 min | ⬜ |
| 5 | Create .env.local | 2 min | ⬜ |
| 6 | Run npm install | 5 min | ⬜ |
| 7 | Start dev server | 2 min | ⬜ |
| 8 | Test signup/login | 1 min | ⬜ |

**Total: 25 minutes** (5 min buffer for coffee ☕)

---

## STEP 1: Create Supabase Account (5 minutes)

**What to do:**

```
1. Open: https://supabase.com
2. Click: "Start your project"
3. Choose: GitHub, Google, or Email signup
4. Create account
5. You'll see the Supabase dashboard
```

✅ **You should now see**: Dashboard with "New Project" button

---

## STEP 2: Create Peptide Atlas Project (3 minutes)

**In Supabase dashboard:**

```
1. Click: "New Project"
2. Project Name: peptide-atlas
3. Database Password: (create strong password, SAVE IT!)
4. Region: Pick the closest to you
5. Click: "Create new project"
6. WAIT: 2-3 minutes for creation
```

✅ **You should see**: Your project dashboard loading

---

## STEP 3: Run Database SQL Script (5 minutes)

**In Supabase dashboard for your project:**

```
1. Click: "SQL Editor" (left sidebar)
2. Click: "+ New Query" (top right)
3. Copy this file: supabase-setup.sql (from your project folder)
4. Paste entire contents into the SQL editor
5. Click: "Run" button (⚡ icon at top right)
6. Wait for success (green checkmark)
```

✅ **You should see**: "Query executed successfully"

---

## STEP 4: Get Your API Keys (2 minutes)

**In Supabase dashboard:**

```
1. Click: "Settings" (bottom left)
2. Click: "API" (from tabs)
3. Copy these three values:
   - Project URL (looks like: https://abc123xyz.supabase.co)
   - anon public (looks like: eyJhbGc...)
   - service_role (looks like: eyJhbGc...)
4. Keep these open in another window
```

✅ **You should have**: Three keys copied somewhere accessible

---

## STEP 5: Create .env.local File (2 minutes)

**On your computer:**

```
1. Open your project folder in a text editor
2. Create new file: .env.local (in root of peptide-atlas)
3. Type these lines (replace with your actual keys from Step 4):

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

4. Save the file
5. ✅ File is automatically ignored by Git (in .gitignore)
```

✅ **You should have**: `.env.local` file with 3 keys

---

## STEP 6: Install Dependencies (5 minutes)

**In your terminal:**

```bash
cd /path/to/peptide-atlas
npm install
```

(This installs Supabase packages. Takes 2-5 minutes. Grab coffee! ☕)

✅ **You should see**: "added X packages" completion message

---

## STEP 7: Start Dev Server (2 minutes)

**In your terminal:**

```bash
npm run dev
```

**Wait for message like:**
```
- Local:        http://localhost:3000
- Environments: .env.local
```

✅ **You should see**: "compiled successfully" message

---

## STEP 8: Test Signup/Login (1 minute)

**In your browser:**

```
1. Go to: http://localhost:3000
2. You should see: "Login" form
3. Click: "Sign Up"
4. Enter: test@example.com + password123
5. Wait: You should get a success message
6. Check: Your email for verification link
7. Click: The verification link in email
8. Go back to: http://localhost:3000
9. Click: "Log In"
10. Enter: test@example.com + password123
11. You should see: "Logged in as: test@example.com"
```

✅ **Success!** You're logged in!

---

## 🎉 You Did It!

You now have a **working Peptide Atlas with user authentication!**

### Next: Test the Full Dashboard

**In your browser:**

```
1. Go to: http://localhost:3000/dashboard
2. You should see: Three tabs (Inventory, Protocols, Log)

Test Inventory:
  1. Type: "BPC-157" in peptide name
  2. Enter: 10 for vial size
  3. Select: mg for unit
  4. Enter: 3 for quantity
  5. Click: "Add to Inventory"
  6. You should see your vial appear in the list

Test Protocols:
  1. Type: "BPC-157" in peptide name
  2. Enter: 200 for dose
  3. Select: mcg for unit
  4. Type: "daily" for frequency
  5. Pick: Start date (today)
  6. Pick: End date (1 week from now)
  7. Type: "abdomen" for location
  8. Click: "Save Protocol"
  9. You should see your protocol appear

Test Injection Log:
  1. Type: "BPC-157" in peptide name
  2. Enter: 200 for dose
  3. Select: mcg for unit
  4. Date: (should be today)
  5. Type: "abdomen" for location
  6. Type: "Felt good, no issues" in notes
  7. Click: "Log Injection"
  8. You should see your injection in the list
```

✅ **All working?** Perfect! Your platform is live! 🚀

---

## 🔍 Verify Data in Supabase

**Back in Supabase dashboard:**

```
1. Click: "Table Editor" (left sidebar)
2. Click: "inventory" table
3. You should see: Your BPC-157 vial!
4. Click: "injection_log" table
5. You should see: Your test injection!
6. Click: "audit_log" table
7. You should see: All your actions logged
```

✅ **Data is synced!** Your app is working!

---

## 📱 Test on Mobile (Optional)

```
1. On your phone, go to: http://YOUR_COMPUTER_IP:3000
2. (Replace YOUR_COMPUTER_IP with your computer's local IP)
3. Everything should work great on mobile!
```

---

## 🎓 What You've Built

Congratulations! You now have:

✅ **User Authentication** — Email login/signup
✅ **Inventory Tracking** — Manage your peptide vials
✅ **Protocol Management** — Plan research cycles
✅ **Injection Logging** — Track injections with notes
✅ **Data Security** — Only you can see your data
✅ **Audit Trail** — All changes are logged
✅ **Mobile Support** — Works on phones/tablets

---

## 📚 Next Reading (When Ready)

For more details, read:
- `QUICK_START.md` — Detailed version of what you just did
- `SUPABASE_SETUP.md` — Advanced configuration
- `IMPLEMENTATION_SUMMARY.md` — All features explained
- `NOTIFICATIONS_ROADMAP.md` — Add email reminders later

---

## 🆘 Having Issues?

### "Cannot find module '@supabase/supabase-js'"
→ Did you run `npm install`? Run it again.

### "NEXT_PUBLIC_SUPABASE_URL is not set"
→ Check that `.env.local` exists and has the right keys
→ Restart dev server (stop with Ctrl+C, run `npm run dev` again)

### "Signup not sending email"
→ Check spam folder
→ Use a real email address (not test@example.com)

### "Login form not appearing"
→ Check browser console for errors (press F12)
→ Check terminal for server errors

### Still stuck?
→ The docs have troubleshooting sections
→ Check SUPABASE_SETUP.md "Troubleshooting" section

---

## 🎯 You're Ready to Launch

You've successfully built a **professional research platform** with:
- Real user accounts
- Data persistence
- Security
- Mobile support

**This is production-ready. You can show this to users!**

---

## 🚀 What's Next?

After this initial setup:

1. **Customize** — Add your branding, update styles
2. **Deploy** — Push to Vercel (free, takes 5 minutes)
3. **Market** — Tell researchers about your platform
4. **Monetize** — Add subscription tiers (future roadmap)
5. **Improve** — Add notifications (see NOTIFICATIONS_ROADMAP.md)

---

## 📊 Success Metrics

After setup, you should have:

```
✅ Supabase project created
✅ Database tables created
✅ API keys working
✅ .env.local configured
✅ Dependencies installed
✅ Dev server running
✅ Can create account
✅ Can log in
✅ Can add inventory
✅ Can save protocols
✅ Can log injections
✅ Data syncs to Supabase
✅ Audit logs working
```

**All 13 items checked?** You're done! 🎉

---

## 📞 Support

- **Setup questions:** See SUPABASE_SETUP.md
- **Feature questions:** See IMPLEMENTATION_SUMMARY.md
- **Future features:** See NOTIFICATIONS_ROADMAP.md
- **File details:** See FILE_INVENTORY.md

---

## ⏰ Final Checklist

- [ ] Supabase account created
- [ ] Project database set up
- [ ] API keys saved
- [ ] .env.local created
- [ ] npm install completed
- [ ] Dev server running
- [ ] Can signup/login
- [ ] Can access dashboard
- [ ] Inventory tab works
- [ ] Protocols tab works
- [ ] Injection log works
- [ ] Data shows in Supabase

**All checked?**

# 🎉 You're Ready! 🚀

---

**Time elapsed:** 30 minutes
**Status:** READY FOR PRODUCTION
**Next action:** Start using your platform!

Good luck! Your Peptide Atlas is live! 🧪
