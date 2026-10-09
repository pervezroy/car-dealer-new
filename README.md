# YourBrand: online used-car retailer

A Next.js 14 (App Router) site for selling used cars online, in the style of UK online car retailers. Deploys to Vercel and stores data in Neon Postgres.

**Pages:** home (search, benefits, latest cars) · `/cars` (filters and sorting) · `/cars/[id]` (specs, monthly price estimate, reserve form) · `/sell-your-car` (valuation request) · `/thanks`

**Stack:** Next.js 14, React 18, `@neondatabase/serverless`, plain CSS. No other services needed.

## Project layout

```
app/            pages and the /api/enquiry route
components/     CarCard
lib/brand.js    name, tagline, phone, APR, benefits: edit this to rebrand
lib/db.js       Neon client
scripts/setup.mjs   creates tables and seeds 8 sample cars
app/globals.css colours and layout (CSS variables at the top)
```

## 1. Run locally

Requires Node.js 20 or newer.

1. `npm install`
2. Create a free project at https://console.neon.tech, then copy its connection string.
3. `cp .env.example .env.local` and paste the string as `DATABASE_URL`.
4. `npm run db:setup` (creates the `cars` and `enquiries` tables and adds sample cars).
5. `npm run dev` and open http://localhost:3000.

## 2. Deploy to Vercel

1. Push this folder to a new GitHub repository:
   ```
   git init && git add . && git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOU/YOUR-REPO.git
   git push -u origin main
   ```
2. In Vercel choose **Add New > Project**, import the repository, keep the detected **Next.js** settings, and click **Deploy**. The first build succeeds without a database because pages query it at request time.
3. Connect Neon: open the project, go to **Storage**, choose **Neon** (Marketplace), create or link a database, and connect it to the project for **all environments**. Vercel adds `DATABASE_URL` automatically.
   *Already have a Neon database?* Instead go to **Settings > Environment Variables**, add `DATABASE_URL` with your Neon connection string, and tick Production, Preview and Development.
4. Create the tables once, from your machine:
   ```
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   npm run db:setup
   ```
5. **Redeploy** (Deployments > the latest one > Redeploy) so the new variable is picked up. Your site is now live.
6. Optional: **Settings > Domains** to attach your own domain.

Every push to `main` redeploys automatically; pull requests get preview URLs.

## 3. Make it yours

- **Brand:** edit `lib/brand.js` (name, tagline, phone, APR, benefits) and the colours in `app/globals.css`. Swap the font in `app/layout.js`.
- **Add or edit cars:** open your database in the Neon console (Tables or SQL Editor). Set `status` to `sold` to hide a car. Put a photo URL in `image_url` (any hosted image; cars without one show a placeholder). To remove the samples: `DELETE FROM cars;` then insert your stock.
- **See enquiries:** `SELECT * FROM enquiries ORDER BY created_at DESC;` in the Neon SQL Editor.

## 4. Before you go live

- Use your own logo, photos and wording. Do not copy another retailer's branding, images or text.
- Only advertise guarantees you actually offer (the 7-day return and 90-day warranty in `lib/brand.js` are placeholders).
- Selling or brokering finance in the UK requires the right FCA authorisation. Check your obligations and fix the footer text.
- Add a privacy policy and cookie notice, since you collect names, emails and phone numbers.
- Consumer Rights Act and Consumer Contracts Regulations apply to distance sales. Get advice on your terms.

## Not included yet (suggested next steps)

Image uploads (e.g. Vercel Blob), an admin area to manage stock, email notifications for new enquiries (e.g. Resend), live registration lookups for valuations (DVLA/valuation APIs), real finance applications, online payments for deposits, and spam protection on the forms (e.g. Cloudflare Turnstile).
