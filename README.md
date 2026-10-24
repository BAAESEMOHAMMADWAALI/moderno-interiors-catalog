# Moderno Interiors & Rugs — Complete E-Catalogue, Dual Sizing Engine & Admin Platform

A modern, minimalist, mobile-first web platform built for an interior decor, flooring, wall coverings, custom furniture, and machine-made rug shop.

---

## 1. Quick Start (Run Locally in 60 Seconds)

```bash
# 1. Install packages
npm install

# 2. Verify zero TypeScript or unused-variable errors
npm run typecheck

# 3. Start local development server
npm run dev
```

- **Customer Storefront:** `http://localhost:5173/`
- **Admin Control Panel:** `http://localhost:5173/admin` *(Click "Auto-Fill Owner Login" on the login screen when testing offline without Supabase)*
- **Terms & Measurement Policy:** `http://localhost:5173/legal`

---

## 2. How to Connect Your Free Database (Supabase — ₹0/Month)

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Open **SQL Editor** in Supabase, paste the entire contents of `supabase/phase1_schema_and_seed.sql`, and click **Run**.
3. Copy `.env.example` to `.env` and fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. In Supabase **Authentication → Users**, click **Add User** to create your Admin email and password for `/admin/login`.

---

## 3. How to Deploy Live for 100% Free (Without Vercel)

### Option A: Cloudflare Pages (Recommended — Unlimited Free Bandwidth & Commercial Use)
1. Push this folder to a GitHub repository.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select your repository and use these settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under **Environment Variables** and click **Save and Deploy**.
   *(The included `public/_redirects` file automatically handles all `/category/*`, `/product/*`, and `/admin/*` routes).*

### Option B: GitHub Pages (100% Free Built-In Action Included)
1. Push this code to the `main` branch of your GitHub repository.
2. In your GitHub repo, go to **Settings → Pages → Build and deployment** and select **GitHub Actions**.
3. The included `.github/workflows/deploy.yml` workflow will automatically typecheck, build, and publish your live site.
