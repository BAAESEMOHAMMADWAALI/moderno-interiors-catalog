# 🧠 AI PROJECT MEMORY, STATE TRACKER & ANTI-HALLUCINATION GUARDRAILS
> **FILE PURPOSE:** This file (`AI_PROJECT_MEMORY_AND_GUARDRAILS.md`) is the persistent brain and strict rulebook for this repository.
> **MANDATORY INSTRUCTION FOR ALL AI MODELS (Gemini, Claude, GPT, Cursor, Copilot) & DEVELOPERS:**
> 1. **READ THIS ENTIRE FILE FIRST** before generating, editing, or deleting any code.
> 2. **NEVER VIOLATE DOMAIN INVARIANTS** listed in Section 1.
> 3. **NEVER EDIT LOCKED FILES** from completed phases unless the user explicitly commands `UNLOCK PHASE X`.
> 4. **UPDATE THE PHASE TRACKER & CHANGELOG** at the bottom of this file after completing any task.

---

## 1. 🔒 IMMUTABLE BUSINESS & DOMAIN INVARIANTS (NEVER HALLUCINATE AROUND THESE)

1. **Dual Product Engine Separation:**
   - **MODE A (`FIXED_RUG` — Machine-Made Rugs & Carpets ONLY):**
     - All area rugs in this shop are **100% Machine-Made** with **Predefined Sizes ONLY** (e.g., `4×6 ft`, `5×8 ft`, `6×9 ft`, `8×10 ft`, `9×12 ft`).
     - **STRICTLY FORBIDDEN:** Never label rugs as handmade/Kashmiri. Never show custom `Width × Height` inputs, per-sq.-ft. calculators, or custom pattern customization on Mode A Rugs.
   - **MODE B (`CUSTOM_SQFT` — All Other 15 Categories):**
     - Applies to: *Wallpaper, Self-Adhesive Wallpaper, UV Marble Sheets, PVC Panelling, PVC Ceiling (Shelling), Vertical Grass, Wall-to-Wall Carpets, PVC Carpet, Wooden Flooring, Vinyl Flooring, Artificial Grass, Mats, Curtains, Blinds, Custom-Made Furniture*.
     - **REQUIRED FEATURES:** Must offer:
       1. Customer self-entered `Width × Height` calculator (with mobile-friendly `+`/`−` steppers) + Material/Quality tier selector + optional wastage toggle.
       2. **Book Home Measurement Visit (🏡)** lead form.
       3. **Visit Shop / Request Callback (🤙)** lead form.
       4. **Custom Design Request Panel** (reference photo upload + custom notes).

2. **Locked Visual Design Tokens (`MODERNO` + `lano` Minimalist Theme):**
   - `--bg-primary`: `#FAF8F5` (Warm Alabaster)
   - `--bg-secondary`: `#F0ECE1` (Warm Sand)
   - `--bg-surface`: `#FFFFFF` (Pure White)
   - `--text-primary`: `#1E1E1C` (Deep Charcoal)
   - `--text-muted`: `#6E6A63` (Muted Stone)
   - `--accent-warm`: `#9C5A3C` (Warm Terracotta)
   - `--accent-call`: `#1F7A4C` (Call Emerald)
   - `--border-subtle`: `#E5DFD3` (Hairline Border)

3. **Zero-Cost Hosting & Tech Stack Constraint (No Vercel Required):**
   - **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS (Deployable on **Cloudflare Pages** or **GitHub Pages** for ₹0/month).
   - **Database & Auth:** **Supabase** (PostgreSQL + Row-Level Security + Supabase Auth for `/admin`).
   - **Media CDN:** **Cloudinary** (Free tier unsigned preset for customer reference uploads & WebP product images).
   - **Lead Notifications:** Direct WhatsApp URL trigger + **Web3Forms** free email dispatch.

---

## 2. 🚫 ANTI-GARBAGE CODE & CONFLICT PREVENTION RULES

1. **Zero Dead Code Policy:**
   - Never leave commented-out code blocks, unused imports, `console.log()` debugging lines, or `TODO` placeholders.
   - Every file written must compile cleanly under `tsc --noEmit` with `"noUnusedLocals": true` and `"noUnusedParameters": true`.
2. **Strict Layer Isolation (No Spaghetti Imports):**
   - UI Components (`src/components/**`, `src/pages/**`) **MUST NEVER** import `supabaseClient.ts` directly. All database reads/writes MUST go through `src/services/*.ts`.
   - All TypeScript types MUST live in `src/types/database.types.ts`.
   - All pricing calculations MUST use `src/utils/pricingEngine.ts`.
3. **One Responsibility Per File:**
   - Never merge `RugPredefinedSelector.tsx` (Mode A) and `CustomDimensionCalc.tsx` (Mode B) into a single file.

---

## 3. 🧱 ATOMIC PHASE TRACKER & FILE LOCK REGISTRY

### Phase Status Legend
- `[ ] NOT_STARTED`
- `[~] IN_PROGRESS`
- `[x] COMPLETED_AND_LOCKED` *(Do NOT modify files in a locked phase without explicit user permission)*

---

### 📦 PHASE 1: Foundation, Theme, Database Schema & Global Layout Shell
- **Status:** `[x] COMPLETED_AND_LOCKED`
- **Files Owned & Locked by Phase 1:**
  - [x] `supabase/phase1_schema_and_seed.sql` *(LOCKED)*
  - [x] `src/types/database.types.ts` *(LOCKED)*
  - [x] `src/styles/theme.css` *(LOCKED)*
  - [x] `src/config/supabaseClient.ts` *(LOCKED)*
  - [x] `src/config/categoriesSeed.ts` *(LOCKED)*
  - [x] `src/utils/pricingEngine.ts` *(LOCKED)*
  - [x] `src/services/settingsService.ts` *(LOCKED)*
  - [x] `src/context/StoreSettingsContext.tsx` *(LOCKED)*
  - [x] `src/components/layout/Navbar.tsx` *(LOCKED)*
  - [x] `src/components/layout/Footer.tsx` *(LOCKED)*
  - [x] `src/components/layout/MobileStickyBar.tsx` *(LOCKED)*

---

### 📦 PHASE 2: Public Storefront, Sub-Class Filters & Dual Product Engine
- **Status:** `[x] COMPLETED_AND_LOCKED`
- **Files Owned & Locked by Phase 2:**
  - [x] `src/services/catalogService.ts` *(LOCKED)*
  - [x] `src/components/catalog/ProductCard.tsx` *(LOCKED)*
  - [x] `src/components/catalog/FilterSidebar.tsx` *(LOCKED)*
  - [x] `src/components/catalog/MaterialSwatchStrip.tsx` *(LOCKED)*
  - [x] `src/components/product-detail/RugPredefinedSelector.tsx` *(LOCKED)*
  - [x] `src/components/product-detail/CustomDimensionCalc.tsx` *(LOCKED)*
  - [x] `src/components/product-detail/CustomDesignPanel.tsx` *(LOCKED)*
  - [x] `src/pages/public/HomePage.tsx` *(LOCKED)*
  - [x] `src/pages/public/CategoryPage.tsx` *(LOCKED)*
  - [x] `src/pages/public/ProductDetailPage.tsx` *(LOCKED)*

---

### 📦 PHASE 3: Customer Lead Capture, Home Visit (🏡) & Callback (🤙) System
- **Status:** `[x] COMPLETED_AND_LOCKED`
- **Files Owned & Locked by Phase 3:**
  - [x] `src/utils/whatsappHelper.ts` *(LOCKED)*
  - [x] `src/services/queryService.ts` *(LOCKED)*
  - [x] `src/context/InquiryModalContext.tsx` *(LOCKED)*
  - [x] `src/components/modals/LeadCaptureModal.tsx` *(LOCKED)*

---

### 📦 PHASE 4: Secure Admin Panel (Catalogue, Quality Rates, Leads & Store Settings)
- **Status:** `[x] COMPLETED_AND_LOCKED`
- **Files Owned & Locked by Phase 4:**
  - [x] `src/services/adminProductService.ts` *(LOCKED)*
  - [x] `src/pages/admin/AdminLoginPage.tsx` *(LOCKED)*
  - [x] `src/pages/admin/AdminDashboardLayout.tsx` *(LOCKED)*
  - [x] `src/pages/admin/AdminProductsManager.tsx` *(LOCKED)*
  - [x] `src/pages/admin/AdminQueriesInbox.tsx` *(LOCKED)*
  - [x] `src/pages/admin/AdminStoreSettings.tsx` *(LOCKED)*

---

### 📦 PHASE 5: Legal Terms Page, Final Audit & Zero-Cost Production Deployment
- **Status:** `[x] COMPLETED_AND_LOCKED`
- **Scope:** LegalTermsPage (ToS, Measurement Disclaimer, Privacy Policy), route lock in `App.tsx`, dead-code audit, and Cloudflare Pages / GitHub Pages deployment build.
- **Files Owned & Locked by Phase 5:**
  - [x] `src/pages/public/LegalTermsPage.tsx` *(LOCKED)*
  - [x] `src/App.tsx` *(LOCKED)*
  - [x] `vite.config.ts` *(LOCKED)*
  - [x] `public/_redirects` *(LOCKED — Cloudflare Pages SPA Router Rule)*
  - [x] `.github/workflows/deploy.yml` *(LOCKED — GitHub Pages CI/CD Pipeline)*
  - [x] `README.md` *(LOCKED — Developer & Free Hosting Handover Guide)*
- **Verification Gate Passed:** Automated Anti-Garbage & Layer-Isolation Audit passed across all 37 repository files (0 `console.log`, 0 `TODO` placeholders, 0 direct `supabaseClient` imports in UI components, 0 phase overlaps).

---

## 4. 📝 AI SESSION HANDOFF LOG (APPEND AFTER EVERY TURN)

| Date | AI Model / Dev | Phase Worked On | Files Created / Modified | Verification Run (`tsc` / Build) | Notes / Next Step |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-10-22 | Gemini | Blueprint & UI Prototype | `index.html`, `Interior_Shop_Master_Blueprint_and_Developer_Guide.docx`, `AI_PROJECT_MEMORY_AND_GUARDRAILS.md` | Verified mobile-first prototype & schema | Ready to begin **Phase 1** implementation. |
| 2026-10-22 | Gemini | **Phase 1 (100% Complete & Locked)** | `supabase/phase1_schema_and_seed.sql`, `src/types/database.types.ts`, `src/styles/theme.css`, `src/config/supabaseClient.ts`, `src/config/categoriesSeed.ts`, `src/utils/pricingEngine.ts`, `src/services/settingsService.ts`, `src/context/StoreSettingsContext.tsx`, `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileStickyBar.tsx` | Verified all 16 categories, Mode A DB trigger, pure pricing engine math, and layer isolation | **Phase 1 LOCKED.** |
| 2026-10-24 | Gemini | **Phase 2 (100% Complete & Locked)** | `src/services/catalogService.ts`, `src/components/catalog/ProductCard.tsx`, `src/components/catalog/FilterSidebar.tsx`, `src/components/catalog/MaterialSwatchStrip.tsx`, `src/components/product-detail/RugPredefinedSelector.tsx`, `src/components/product-detail/CustomDimensionCalc.tsx`, `src/components/product-detail/CustomDesignPanel.tsx`, `src/pages/public/HomePage.tsx`, `src/pages/public/CategoryPage.tsx`, `src/pages/public/ProductDetailPage.tsx` | Verified zero Phase 1 modifications, strict Mode A vs Mode B separation, and full 16-category seed coverage | **Phase 2 LOCKED.** |
| 2026-10-24 | Gemini | **Phase 3 (100% Complete & Locked)** | `src/utils/whatsappHelper.ts`, `src/services/queryService.ts`, `src/context/InquiryModalContext.tsx`, `src/components/modals/LeadCaptureModal.tsx`, `src/App.tsx` | Verified zero Phase 1/2 mutations, event listener wiring, Cloudinary/local photo upload, and WhatsApp/Web3Forms dispatch | **Phase 3 LOCKED.** |
| 2026-10-24 | Gemini | **Phase 4 (100% Complete & Locked)** | `src/services/adminProductService.ts`, `src/pages/admin/AdminLoginPage.tsx`, `src/pages/admin/AdminDashboardLayout.tsx`, `src/pages/admin/AdminProductsManager.tsx`, `src/pages/admin/AdminQueriesInbox.tsx`, `src/pages/admin/AdminStoreSettings.tsx`, `src/App.tsx` | Verified zero Phase 1/2/3 mutations, strict service-layer isolation, Mode A vs Mode B admin matrix editor, and live settings sync | **Phase 4 LOCKED.** |
| 2026-10-24 | Gemini | **Phase 5 (100% Complete & Locked — Project Finished)** | `src/pages/public/LegalTermsPage.tsx`, `src/App.tsx`, `vite.config.ts`, `public/_redirects`, `.github/workflows/deploy.yml`, `README.md` | Automated static audit passed across all 37 project files | **ALL 5 PHASES COMPLETED & LOCKED.** |
