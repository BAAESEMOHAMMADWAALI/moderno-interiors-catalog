/**
 * SINGLE SOURCE OF TRUTH FOR ALL APPLICATION & DATABASE TYPES
 * Phase 1 Locked File — Do not duplicate these interfaces in components.
 */

export type PricingMode = 'FIXED_RUG' | 'CUSTOM_SQFT';

export type NavGroupKey =
  | 'RUGS_CARPETS'
  | 'WALLS_CEILINGS'
  | 'FLOORING_GRASS'
  | 'WINDOWS_FURNITURE';

export type QualityTier = 'Standard' | 'Premium' | 'Luxury';

export type MeasurementUnit = 'ft' | 'inch' | 'meter';

export type WastagePercentage = 0 | 5 | 10;

export type QueryType =
  | 'HOME_MEASUREMENT'
  | 'SHOP_VISIT'
  | 'CALLBACK_REQUEST'
  | 'CUSTOM_SIZE_QUOTE'
  | 'RUG_ORDER_INQUIRY';

export type QueryStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'VISIT_SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface StoreSettings {
  id: number;
  shop_name: string;
  tagline: string;
  primary_phone: string;
  whatsapp_number: string;
  email_address: string;
  shop_address: string;
  google_maps_url: string;
  business_hours: string;
  announcement_text: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  nav_group: NavGroupKey;
  pricing_mode: PricingMode;
  unit_label: string;
  short_description: string;
  material_filter_label: string;
  display_order: number;
  is_active: boolean;
}

export interface RugSizeVariant {
  id: string;
  product_id: string;
  size_label: string;
  width_ft: number;
  length_ft: number;
  fixed_price: number;
  in_stock: boolean;
}

export interface QualityVariant {
  id: string;
  product_id: string;
  quality_name: string;
  quality_tier: QualityTier;
  specification_note: string;
  rate_per_sqft: number;
  swatch_image_url: string;
  is_default: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  title: string;
  slug: string;
  sku: string | null;
  short_description: string;
  design_style: string;
  room_type: string;
  primary_image_url: string;
  gallery_image_urls: string[];
  allows_custom_design: boolean;
  min_display_price: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  category?: Category;
  rug_sizes?: RugSizeVariant[];
  quality_variants?: QualityVariant[];
}

export interface CustomDimensionInput {
  width: number;
  height: number;
  unit: MeasurementUnit;
  wastagePercent: WastagePercentage;
  ratePerSqFt: number;
}

export interface CustomPriceResult {
  widthInFeet: number;
  heightInFeet: number;
  netAreaSqFt: number;
  wastageSqFt: number;
  billableAreaSqFt: number;
  ratePerSqFt: number;
  estimatedTotal: number;
  formattedSummary: string;
}

export interface RugPriceResult {
  sizeLabel: string;
  areaSqFt: number;
  fixedPrice: number;
  inStock: boolean;
  formattedSummary: string;
}

export interface CustomerQueryPayload {
  query_type: QueryType;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  preferred_visit_date?: string;
  product_id?: string | null;
  product_title_snapshot?: string;
  selected_size_or_dimensions?: string;
  selected_quality_name?: string;
  estimated_price?: number | null;
  custom_design_notes?: string;
  reference_image_url?: string;
}

export interface CustomerQueryRecord extends CustomerQueryPayload {
  id: string;
  status: QueryStatus;
  admin_remarks: string;
  created_at: string;
}

export interface InquiryTriggerEventDetail {
  queryType: QueryType;
  productId?: string;
  productTitle?: string;
  dimensionsSummary?: string;
  qualityName?: string;
  estimatedPrice?: number;
}
