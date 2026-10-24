-- ============================================================================
-- PHASE 1: COMPLETE POSTGRESQL SCHEMA, TRIGGERS, RLS & 16-CATEGORY SEED
-- Execute this entire script once in the Supabase SQL Editor.
-- ============================================================================

-- 1. STORE SETTINGS TABLE (Single-Row Global Store Configuration)
CREATE TABLE IF NOT EXISTS store_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    shop_name TEXT NOT NULL DEFAULT 'Moderno Interiors & Rugs',
    tagline TEXT NOT NULL DEFAULT 'Architectural Wallpapers, Flooring, Panels & Machine-Made Rugs',
    primary_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    email_address TEXT NOT NULL DEFAULT 'contact@modernointeriors.in',
    shop_address TEXT NOT NULL DEFAULT 'Shop No. 12, Interior Market Plaza, Main Road',
    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',
    business_hours TEXT NOT NULL DEFAULT 'Mon – Sat: 10:00 AM – 8:30 PM | Sun: 11:00 AM – 6:00 PM',
    announcement_text TEXT NOT NULL DEFAULT '🏡 Free Home Measurement & Physical Sample Book Visit Across the City!',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 2. CATEGORIES TABLE (All 16 Core Product Categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    nav_group TEXT NOT NULL CHECK (nav_group IN ('RUGS_CARPETS', 'WALLS_CEILINGS', 'FLOORING_GRASS', 'WINDOWS_FURNITURE')),
    pricing_mode TEXT NOT NULL CHECK (pricing_mode IN ('FIXED_RUG', 'CUSTOM_SQFT')),
    unit_label TEXT NOT NULL DEFAULT 'Sq. Ft.',
    short_description TEXT NOT NULL DEFAULT '',
    material_filter_label TEXT NOT NULL DEFAULT 'Material Quality',
    display_order INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Seed all 16 required categories
INSERT INTO categories (name, slug, nav_group, pricing_mode, unit_label, short_description, material_filter_label, display_order)
VALUES
  ('Rugs & Carpets (Ready Sizes)', 'rugs-and-carpets', 'RUGS_CARPETS', 'FIXED_RUG', 'Predefined Size', 'Machine-made area rugs in standard predefined house sizes.', 'Weave & Pile Grade', 1),
  ('Wall-to-Wall Carpets', 'wall-to-wall-carpets', 'RUGS_CARPETS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Custom-measured full-room carpeting with acoustic and plush backing.', 'Carpet Pile & Density', 2),
  ('PVC Carpet', 'pvc-carpet', 'RUGS_CARPETS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Waterproof, heavy-duty PVC floor carpets cut to your exact room size.', 'PVC Thickness & Backing', 3),
  ('Mats', 'mats', 'RUGS_CARPETS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Anti-slip entrance, runner, cushioned, and commercial mats.', 'Mat Thickness & Grip Grade', 4),
  ('Wallpaper', 'wallpaper', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Non-woven, vinyl-coated, and heavy embossed designer wall coverings.', 'Paper GSM & Texture Quality', 5),
  ('Self-Adhesive Wallpaper', 'self-adhesive-wallpaper', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Peel-and-stick waterproof wallpapers with custom wall sizing.', 'Film Thickness & Adhesive Grade', 6),
  ('UV Marble Sheets', 'uv-marble-sheets', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'High-gloss luxury UV-coated marble finish wall sheets.', 'Sheet Thickness (mm) & Gloss', 7),
  ('PVC Panelling', 'pvc-panelling', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Fluted, charcoal, and wood-grain interlocking PVC wall panels.', 'Panel Core Thickness & Finish', 8),
  ('PVC Ceiling (Shelling)', 'pvc-ceiling', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Moisture-proof decorative false ceiling PVC panels and shelling.', 'Ceiling Panel Grade & Width', 9),
  ('Vertical Grass', 'vertical-grass', 'WALLS_CEILINGS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Botanical green wall panels and vertical garden foliage.', 'Foliage Density & UV Rating', 10),
  ('Wooden Flooring', 'wooden-flooring', 'FLOORING_GRASS', 'CUSTOM_SQFT', 'Sq. Ft.', 'AC4/AC5 laminate and engineered hardwood plank flooring.', 'Abrasion Class & Plank Thickness', 11),
  ('Vinyl Flooring', 'vinyl-flooring', 'FLOORING_GRASS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Waterproof LVT planks and cushioned vinyl flooring rolls.', 'Wear Layer & Thickness (mm)', 12),
  ('Artificial Grass', 'artificial-grass', 'FLOORING_GRASS', 'CUSTOM_SQFT', 'Sq. Ft.', 'Balcony, terrace, and lawn turf with natural drainage backing.', 'Pile Height (25mm–50mm) & Density', 13),
  ('Curtains', 'curtains', 'WINDOWS_FURNITURE', 'CUSTOM_SQFT', 'Sq. Ft.', 'Blackout, sheer, and linen drapes stitched to window height and width.', 'Fabric GSM & Lining Type', 14),
  ('Blinds', 'blinds', 'WINDOWS_FURNITURE', 'CUSTOM_SQFT', 'Sq. Ft.', 'Zebra, roller, Roman, wooden Venetian, and motorized window blinds.', 'Mechanism & Fabric Opacity', 15),
  ('Custom-Made Furniture', 'custom-made-furniture', 'WINDOWS_FURNITURE', 'CUSTOM_SQFT', 'Sq. Ft.', 'Bespoke sofas, headboards, storage units, and tables built to space.', 'Frame Timber, Foam & Upholstery', 16)
ON CONFLICT (slug) DO NOTHING;

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT UNIQUE,
    short_description TEXT NOT NULL DEFAULT '',
    design_style TEXT NOT NULL DEFAULT 'Modern Minimalist',
    room_type TEXT NOT NULL DEFAULT 'Living Room',
    primary_image_url TEXT NOT NULL,
    gallery_image_urls TEXT[] NOT NULL DEFAULT '{}',
    allows_custom_design BOOLEAN NOT NULL DEFAULT TRUE,
    min_display_price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (min_display_price >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Database Trigger: Enforce Mode A Invariant (Machine-Made Rugs NEVER allow custom design/sizing)
CREATE OR REPLACE FUNCTION enforce_rug_mode_invariants()
RETURNS TRIGGER AS $$
DECLARE
    cat_mode TEXT;
BEGIN
    SELECT pricing_mode INTO cat_mode FROM categories WHERE id = NEW.category_id;
    IF cat_mode = 'FIXED_RUG' THEN
        NEW.allows_custom_design := FALSE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_rug_invariants ON products;
CREATE TRIGGER trg_enforce_rug_invariants
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION enforce_rug_mode_invariants();

-- 4. RUG PREDEFINED SIZES TABLE (Mode A ONLY)
CREATE TABLE IF NOT EXISTS rug_size_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size_label TEXT NOT NULL,
    width_ft NUMERIC(6,2) NOT NULL CHECK (width_ft > 0),
    length_ft NUMERIC(6,2) NOT NULL CHECK (length_ft > 0),
    fixed_price NUMERIC(10,2) NOT NULL CHECK (fixed_price >= 0),
    in_stock BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. MATERIAL QUALITY VARIANTS TABLE (Mode B ONLY)
CREATE TABLE IF NOT EXISTS quality_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quality_name TEXT NOT NULL,
    quality_tier TEXT NOT NULL CHECK (quality_tier IN ('Standard', 'Premium', 'Luxury')),
    specification_note TEXT NOT NULL DEFAULT '',
    rate_per_sqft NUMERIC(10,2) NOT NULL CHECK (rate_per_sqft >= 0),
    swatch_image_url TEXT DEFAULT '',
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. CUSTOMER QUERIES & LEADS TABLE
CREATE TABLE IF NOT EXISTS customer_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_type TEXT NOT NULL CHECK (query_type IN ('HOME_MEASUREMENT', 'SHOP_VISIT', 'CALLBACK_REQUEST', 'CUSTOM_SIZE_QUOTE', 'RUG_ORDER_INQUIRY')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT DEFAULT '',
    preferred_visit_date TEXT DEFAULT '',
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_title_snapshot TEXT DEFAULT '',
    selected_size_or_dimensions TEXT DEFAULT '',
    selected_quality_name TEXT DEFAULT '',
    estimated_price NUMERIC(10,2),
    custom_design_notes TEXT DEFAULT '',
    reference_image_url TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'VISIT_SCHEDULED', 'COMPLETED', 'CANCELLED')),
    admin_remarks TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rug_size_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public Read Rug Sizes" ON rug_size_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Qualities" ON quality_variants FOR SELECT USING (true);
CREATE POLICY "Public Insert Queries" ON customer_queries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin Full Settings" ON store_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Rug Sizes" ON rug_size_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Qualities" ON quality_variants FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Queries" ON customer_queries FOR ALL USING (auth.role() = 'authenticated');
