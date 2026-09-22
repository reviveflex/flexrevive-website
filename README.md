# Flex Revive — website + backend (Supabase + Vercel)

This folder contains the full Flex Revive website (`index.html`) and a
small serverless backend (`api/`) that:

- Serves the website (Vercel serves `index.html` automatically)
- Receives the Book Appointment and Teleconsultation forms at
  `/api/appointment` and `/api/teleconsultation`
- Saves every submission to a `submissions` table in Supabase (Postgres)
- Emails each submission to the clinic, once you add a Gmail App Password
  (optional — submissions still get saved even without email configured)
- Lets you view saved submissions at `/api/submissions?key=YOUR_ADMIN_SECRET`
  (protected — see step 3)

If no backend is reachable (for example if the page is opened as a plain
file), the forms fall back automatically to one-tap "Send via WhatsApp" /
"Send via Email" buttons — so the site never breaks, it just gets better
once the backend is live.

## Supabase project (already set up)

A Supabase project called `flexrevive-website` has already been created,
with the `submissions` table and its security policies in place (see
`supabase-schema.sql` in this folder for exactly what was run). You don't
need to do anything in Supabase for a normal deploy — just use the
`SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` values below in step 2.

## 1. Put this folder in a GitHub repository

Create a repo at github.com/new, then upload these files (or push with
git). Vercel deploys straight from GitHub.

## 2. Deploy to Vercel

1. Go to https://vercel.com, sign up / log in with GitHub.
2. Click **Add New** → **Project**, and import this repo.
3. Vercel will auto-detect it (static `index.html` + `api/` functions) —
   no build command needed, just click through.
4. Before the first deploy (or right after, then redeploy), go to
   **Settings** → **Environment Variables** and add:
   - `SUPABASE_URL` = `https://skcqzehpxfsksgvkthcg.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_nYQ_oMw-DxZ0S_v9j1-EkA_IW3YoebB`
   - `ADMIN_SECRET` = *(make up your own long random string)*
   - `EMAIL_USER` = `ashiquebillahgazi@gmail.com` *(optional, see step 4)*
   - `EMAIL_PASS` = *(optional, see step 4)*
   - `EMAIL_TO` = `ashiquebillahgazi@gmail.com` *(optional)*
5. Click **Deploy**. In under a minute you'll get a live link like
   `https://flexrevive.vercel.app` — that's your real, public website,
   with the forms writing straight to Supabase.

Every time you push to GitHub, Vercel redeploys automatically.

## 3. Check it's actually working

- Submit the Book Appointment form on the live site.
- In Supabase, go to **Table Editor** → `submissions` — the row should
  appear there.
- Visit `https://your-site.vercel.app/api/submissions?key=YOUR_ADMIN_SECRET`
  (the `ADMIN_SECRET` you set in step 2) to see all stored submissions as
  JSON. Without the correct key this returns "Unauthorized".

## 4. Get a Gmail App Password (for email notifications, optional)

Regular Gmail passwords don't work for this. Instead:

1. Turn on 2-Step Verification on the Google account, if it isn't already:
   https://myaccount.google.com/security
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password (name it "Flex Revive website")
4. Copy the 16-character code — that's your `EMAIL_PASS`, set it in
   Vercel's Environment Variables (step 2) and redeploy.

## 5. Point it at a real domain (optional)

Once deployed, Vercel lets you attach a custom domain (like
`www.flexrevive.com`) for free under **Settings** → **Domains**, once you
own that domain name from any registrar and point its DNS at Vercel
(Vercel shows you the exact records to add).

## 6. Before real patients use it

- Fill in the real clinic addresses, hours, and Google Maps links in
  `index.html` (search for `FLEX_REVIVE_CONFIG`) — several fields are
  still placeholders like `[KOLKATA ADDRESS]`.
- Have a lawyer review the placeholder Privacy Policy / Terms / Medical
  Disclaimer text before launch.

## Local testing (optional)

Install the Vercel CLI and run the project the same way Vercel runs it in
production (static file + serverless functions together):

```bash
npm install -g vercel
npm install
cp .env.example .env      # then fill in SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, etc.
vercel dev
```

Visit the local URL it prints — the site and forms both work from there.
