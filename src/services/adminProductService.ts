/**
 * ADMIN PRODUCT, PRICING MATRIX & AUTHENTICATION SERVICE
 * Phase 4 Locked File — Centralizes Admin authentication and full CRUD operations
 * for Products, Mode A Predefined Rug Sizes, and Mode B Material Quality Variants.
 * Strict Rule: UI components in `src/pages/admin/*` NEVER import `supabaseClient.ts` directly.
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { CANONICAL_CATEGORIES } from '../config/categoriesSeed';
import { SEED_PRODUCTS } from './catalogService';
import {
  Category,
  Product,
  QualityVariant,
  RugSizeVariant,
} from '../types/database.types';

const ADMIN_SESSION_STORAGE_KEY = 'moderno_admin_session_v1';
const ADMIN_PRODUCTS_STORAGE_KEY = 'moderno_admin_products_cache_v1';

export interface AdminUserSession {
  email: string;
  mode: 'supabase' | 'local-admin';
  authenticatedAt: string;
}

export interface SaveProductPayload {
  id?: string;
  category_id: string;
  title: string;
  slug?: string;
  sku: string;
  short_description: string;
  design_style: string;
  room_type: string;
  primary_image_url: string;
  gallery_image_urls: string[];
  is_featured: boolean;
  is_active: boolean;
  rug_sizes: Omit<RugSizeVariant, 'id' | 'product_id'>[];
  quality_variants: Omit<QualityVariant, 'id' | 'product_id'>[];
}

function slugifyTitle(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function hydrateAdminProduct(product: Product): Product {
  const matchedCat: Category =
    CANONICAL_CATEGORIES.find((c) => c.id === product.category_id) ||
    product.category ||
    CANONICAL_CATEGORIES[0];

  const isFixedRug = matchedCat.pricing_mode === 'FIXED_RUG';

  return {
    ...product,
    allows_custom_design: isFixedRug ? false : true,
    category: matchedCat,
  };
}

function readLocalAdminProducts(): Product[] {
  if (typeof window === 'undefined') {
    return SEED_PRODUCTS.map(hydrateAdminProduct);
  }
  const cached = window.localStorage.getItem(ADMIN_PRODUCTS_STORAGE_KEY);
  if (!cached) {
    const initial = SEED_PRODUCTS.map(hydrateAdminProduct);
    window.localStorage.setItem(
      ADMIN_PRODUCTS_STORAGE_KEY,
      JSON.stringify(initial)
    );
    return initial;
  }
  try {
    const parsed = JSON.parse(cached) as Product[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed.map(hydrateAdminProduct)
      : SEED_PRODUCTS.map(hydrateAdminProduct);
  } catch {
    return SEED_PRODUCTS.map(hydrateAdminProduct);
  }
}

function writeLocalAdminProducts(products: Product[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      ADMIN_PRODUCTS_STORAGE_KEY,
      JSON.stringify(products)
    );
  }
}

// ============================================================================
// ADMIN AUTHENTICATION FUNCTIONS
// ============================================================================

export async function getAdminSession(): Promise<AdminUserSession | null> {
  if (isSupabaseConfigured && supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.email) {
      return {
        email: data.session.user.email,
        mode: 'supabase',
        authenticatedAt: new Date().toISOString(),
      };
    }
  }

  if (typeof window !== 'undefined') {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as AdminUserSession;
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function signInAdmin(
  email: string,
  password: string
): Promise<{ session: AdminUserSession | null; error: string | null }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || password.trim().length < 4) {
    return {
      session: null,
      error: 'Please enter a valid admin email and password.',
    };
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (!error && data.user?.email) {
      const session: AdminUserSession = {
        email: data.user.email,
        mode: 'supabase',
        authenticatedAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(
          ADMIN_SESSION_STORAGE_KEY,
          JSON.stringify(session)
        );
      }
      return { session, error: null };
    }

    if (error) {
      return { session: null, error: error.message };
    }
  }

  // Local / Offline Admin Session Fallback (when Supabase env keys are not yet configured)
  const localSession: AdminUserSession = {
    email: cleanEmail,
    mode: 'local-admin',
    authenticatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(
      ADMIN_SESSION_STORAGE_KEY,
      JSON.stringify(localSession)
    );
  }

  return { session: localSession, error: null };
}

export async function signOutAdmin(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  }
}

// ============================================================================
// ADMIN PRODUCT & VARIANT CRUD FUNCTIONS
// ============================================================================

export async function fetchAdminProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select(
        '*, rug_sizes:rug_size_variants(*), quality_variants:quality_variants(*)'
      )
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const hydrated = (data as Product[]).map(hydrateAdminProduct);
      writeLocalAdminProducts(hydrated);
      return hydrated;
    }
  }

  return readLocalAdminProducts();
}

export async function saveAdminProduct(
  payload: SaveProductPayload
): Promise<{ product: Product; error: string | null }> {
  const category =
    CANONICAL_CATEGORIES.find((c) => c.id === payload.category_id) ||
    CANONICAL_CATEGORIES[0];

  const isFixedRug = category.pricing_mode === 'FIXED_RUG';
  const productId = payload.id || `prod-${Date.now()}`;
  const productSlug =
    payload.slug?.trim() ||
    `${slugifyTitle(payload.title)}-${productId.slice(-4)}`;

  // Calculate starting display price automatically from variants
  let minDisplayPrice = 0;
  if (isFixedRug && payload.rug_sizes.length > 0) {
    minDisplayPrice = Math.min(
      ...payload.rug_sizes.map((s) => Number(s.fixed_price) || 0)
    );
  } else if (!isFixedRug && payload.quality_variants.length > 0) {
    minDisplayPrice = Math.min(
      ...payload.quality_variants.map((q) => Number(q.rate_per_sqft) || 0)
    );
  }

  const builtRugSizes: RugSizeVariant[] = isFixedRug
    ? payload.rug_sizes.map((rs, idx) => ({
        id: `rs-${productId}-${idx + 1}`,
        product_id: productId,
        size_label: rs.size_label,
        width_ft: Number(rs.width_ft) || 4,
        length_ft: Number(rs.length_ft) || 6,
        fixed_price: Math.max(0, Number(rs.fixed_price) || 0),
        in_stock: Boolean(rs.in_stock),
      }))
    : [];

  const builtQualityVariants: QualityVariant[] = !isFixedRug
    ? payload.quality_variants.map((qv, idx) => ({
        id: `qv-${productId}-${idx + 1}`,
        product_id: productId,
        quality_name: qv.quality_name,
        quality_tier: qv.quality_tier,
        specification_note: qv.specification_note,
        rate_per_sqft: Math.max(0, Number(qv.rate_per_sqft) || 0),
        swatch_image_url: qv.swatch_image_url || '',
        is_default: idx === 0 ? true : Boolean(qv.is_default),
      }))
    : [];

  const savedProduct: Product = hydrateAdminProduct({
    id: productId,
    category_id: category.id,
    title: payload.title.trim(),
    slug: productSlug,
    sku: payload.sku.trim() || null,
    short_description: payload.short_description.trim(),
    design_style: payload.design_style.trim() || 'Modern Minimalist',
    room_type: payload.room_type.trim() || 'Living Room',
    primary_image_url:
      payload.primary_image_url.trim() ||
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: payload.gallery_image_urls,
    allows_custom_design: isFixedRug ? false : true,
    min_display_price: minDisplayPrice,
    is_featured: payload.is_featured,
    is_active: payload.is_active,
    created_at: new Date().toISOString(),
    category,
    rug_sizes: builtRugSizes,
    quality_variants: builtQualityVariants,
  });

  // Update local storage cache
  const currentList = readLocalAdminProducts();
  const exists = currentList.some((p) => p.id === productId);
  const nextList = exists
    ? currentList.map((p) => (p.id === productId ? savedProduct : p))
    : [savedProduct, ...currentList];
  writeLocalAdminProducts(nextList);

  // Sync with Supabase if configured
  if (isSupabaseConfigured && supabase) {
    const { data: upsertedProd, error: prodErr } = await supabase
      .from('products')
      .upsert({
        id: payload.id && payload.id.length === 36 ? payload.id : undefined,
        category_id: category.id,
        title: savedProduct.title,
        slug: savedProduct.slug,
        sku: savedProduct.sku,
        short_description: savedProduct.short_description,
        design_style: savedProduct.design_style,
        room_type: savedProduct.room_type,
        primary_image_url: savedProduct.primary_image_url,
        gallery_image_urls: savedProduct.gallery_image_urls,
        allows_custom_design: savedProduct.allows_custom_design,
        min_display_price: savedProduct.min_display_price,
        is_featured: savedProduct.is_featured,
        is_active: savedProduct.is_active,
      })
      .select('*')
      .single();

    if (!prodErr && upsertedProd) {
      const realId = (upsertedProd as Product).id;
      if (isFixedRug) {
        await supabase
          .from('rug_size_variants')
          .delete()
          .eq('product_id', realId);
        if (builtRugSizes.length > 0) {
          await supabase.from('rug_size_variants').insert(
            builtRugSizes.map((r) => ({
              product_id: realId,
              size_label: r.size_label,
              width_ft: r.width_ft,
              length_ft: r.length_ft,
              fixed_price: r.fixed_price,
              in_stock: r.in_stock,
            }))
          );
        }
      } else {
        await supabase
          .from('quality_variants')
          .delete()
          .eq('product_id', realId);
        if (builtQualityVariants.length > 0) {
          await supabase.from('quality_variants').insert(
            builtQualityVariants.map((q) => ({
              product_id: realId,
              quality_name: q.quality_name,
              quality_tier: q.quality_tier,
              specification_note: q.specification_note,
              rate_per_sqft: q.rate_per_sqft,
              swatch_image_url: q.swatch_image_url,
              is_default: q.is_default,
            }))
          );
        }
      }
    }
  }

  return { product: savedProduct, error: null };
}

export async function toggleAdminProductStatus(
  productId: string,
  isActive: boolean
): Promise<Product[]> {
  const current = readLocalAdminProducts();
  const updated = current.map((p) =>
    p.id === productId ? { ...p, is_active: isActive } : p
  );
  writeLocalAdminProducts(updated);

  if (isSupabaseConfigured && supabase && productId.length === 36) {
    await supabase
      .from('products')
      .update({ is_active: isActive })
      .eq('id', productId);
  }

  return updated;
}

export async function deleteAdminProduct(productId: string): Promise<Product[]> {
  const current = readLocalAdminProducts();
  const remaining = current.filter((p) => p.id !== productId);
  writeLocalAdminProducts(remaining);

  if (isSupabaseConfigured && supabase && productId.length === 36) {
    await supabase.from('products').delete().eq('id', productId);
  }

  return remaining;
}
