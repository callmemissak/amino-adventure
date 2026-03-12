# Peptide Atlas

Citation-backed peptide research database with live PubMed feed.

## Deploy to Vercel (Free — takes ~3 minutes)

### Step 1: Push to GitHub
1. Go to [github.com/new](https://github.com/new) and create a new repo called `peptide-atlas`
2. Open a terminal and run:
```bash
cd peptide-atlas
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/peptide-atlas.git
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New → Project"**
3. Import your `peptide-atlas` repo
4. Framework preset will auto-detect **Next.js** — leave defaults
5. Click **Deploy**
6. Your site will be live at `https://peptide-atlas.vercel.app` (or similar) in ~60 seconds

That's it — Vercel auto-deploys on every git push.
