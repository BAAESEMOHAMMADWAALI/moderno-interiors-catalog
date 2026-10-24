/**
 * CATALOG SERVICE LAYER
 * Phase 2 Locked File — Handles all reads & filtering for Categories, Products,
 * Mode A Rug Size Variants, and Mode B Material Quality Variants.
 * Includes rich seed fallback across all 16 categories so the storefront works
 * both online (Supabase) and offline (zero-config local preview).
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { CANONICAL_CATEGORIES } from '../config/categoriesSeed';
import {
  Category,
  PricingMode,
  Product,
  QualityTier,
} from '../types/database.types';

export interface CatalogFilterState {
  searchQuery: string;
  maxPrice: number;
  selectedQualityTiers: QualityTier[];
  selectedDesignStyles: string[];
  selectedRoomTypes: string[];
  selectedRugSizes: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc';
}

export interface AvailableFilterOptions {
  minPriceBoundary: number;
  maxPriceBoundary: number;
  designStyles: string[];
  roomTypes: string[];
  qualityTiers: QualityTier[];
  rugSizeLabels: string[];
}

/**
 * Rich, realistic seed products spanning all 16 categories.
 * Strictly enforces Mode A (FIXED_RUG = machine-made predefined sizes only, allows_custom_design = false)
 * and Mode B (CUSTOM_SQFT = custom dimensions + quality variants + allows_custom_design = true).
 */
export const SEED_PRODUCTS: Product[] = [
  // 1. RUGS & CARPETS (MODE A: FIXED_RUG - Machine-Made Only)
  {
    id: 'prod-rug-01',
    category_id: 'cat-01-rugs',
    title: 'Isfahan Royal Medallion Machine-Made Iranian Knotted Rug',
    slug: 'isfahan-royal-medallion-machine-made-rug',
    sku: 'RUG-MM-101',
    short_description:
      'High-density machine-made Iranian knotted area rug with stain-resistant pile and precision fringes. Available strictly in predefined standard room sizes.',
    design_style: 'Iranian / Persian Classic',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: false,
    min_display_price: 4200,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-01T10:00:00Z',
    rug_sizes: [
      { id: 'rs-101-1', product_id: 'prod-rug-01', size_label: '4×6 ft', width_ft: 4, length_ft: 6, fixed_price: 4200, in_stock: true },
      { id: 'rs-101-2', product_id: 'prod-rug-01', size_label: '5×8 ft', width_ft: 5, length_ft: 8, fixed_price: 6800, in_stock: true },
      { id: 'rs-101-3', product_id: 'prod-rug-01', size_label: '6×9 ft', width_ft: 6, length_ft: 9, fixed_price: 9500, in_stock: true },
      { id: 'rs-101-4', product_id: 'prod-rug-01', size_label: '8×10 ft', width_ft: 8, length_ft: 10, fixed_price: 13900, in_stock: true },
      { id: 'rs-101-5', product_id: 'prod-rug-01', size_label: '9×12 ft', width_ft: 9, length_ft: 12, fixed_price: 18500, in_stock: true },
    ],
  },
  {
    id: 'prod-rug-02',
    category_id: 'cat-01-rugs',
    title: 'Anatolia Coastal Sand Machine-Made Turkish Oushak Rug',
    slug: 'anatolia-coastal-sand-machine-made-oushak-rug',
    sku: 'RUG-MM-102',
    short_description:
      'Soft distressed Oushak motif machine-made rug in warm sand, terracotta, and muted sage tones. Ready-to-lay standard dimensions.',
    design_style: 'Turkish Oushak',
    room_type: 'Bedroom',
    primary_image_url:
      'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: false,
    min_display_price: 3800,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-02T10:00:00Z',
    rug_sizes: [
      { id: 'rs-102-1', product_id: 'prod-rug-02', size_label: '4×6 ft', width_ft: 4, length_ft: 6, fixed_price: 3800, in_stock: true },
      { id: 'rs-102-2', product_id: 'prod-rug-02', size_label: '5×8 ft', width_ft: 5, length_ft: 8, fixed_price: 6200, in_stock: true },
      { id: 'rs-102-3', product_id: 'prod-rug-02', size_label: '6×9 ft', width_ft: 6, length_ft: 9, fixed_price: 8900, in_stock: true },
      { id: 'rs-102-4', product_id: 'prod-rug-02', size_label: '8×10 ft', width_ft: 8, length_ft: 10, fixed_price: 12400, in_stock: true },
    ],
  },
  {
    id: 'prod-rug-03',
    category_id: 'cat-01-rugs',
    title: 'Nordic Alabaster High-Low Machine-Woven Geometric Rug',
    slug: 'nordic-alabaster-machine-woven-geometric-rug',
    sku: 'RUG-MM-103',
    short_description:
      'Minimalist architectural relief pattern in warm cream and charcoal. Machine-woven polypropylene & blended yarn for easy vacuum maintenance.',
    design_style: 'Modern Minimalist',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1534889156217-d643df14f14a?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: false,
    min_display_price: 3500,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-03T10:00:00Z',
    rug_sizes: [
      { id: 'rs-103-1', product_id: 'prod-rug-03', size_label: '4×6 ft', width_ft: 4, length_ft: 6, fixed_price: 3500, in_stock: true },
      { id: 'rs-103-2', product_id: 'prod-rug-03', size_label: '5×8 ft', width_ft: 5, length_ft: 8, fixed_price: 5600, in_stock: true },
      { id: 'rs-103-3', product_id: 'prod-rug-03', size_label: '8×10 ft', width_ft: 8, length_ft: 10, fixed_price: 11200, in_stock: true },
    ],
  },

  // 2. WALL-TO-WALL CARPETS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-w2w-01',
    category_id: 'cat-02-w2w-carpet',
    title: 'Acoustic Plush Cut-Pile Wall-to-Wall Room Carpet',
    slug: 'acoustic-plush-wall-to-wall-carpet',
    sku: 'W2W-201',
    short_description:
      'Custom-fitted full-room carpet with sound-absorbing felt backing. Ideal for bedrooms, home theaters, and executive offices.',
    design_style: 'Solid / Textured',
    room_type: 'Bedroom',
    primary_image_url:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 65,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-04T10:00:00Z',
    quality_variants: [
      { id: 'qv-w2w-1', product_id: 'prod-w2w-01', quality_name: '8mm Commercial Loop Pile', quality_tier: 'Standard', specification_note: 'High-traffic stain-resistant polypropylene loop', rate_per_sqft: 65, swatch_image_url: '', is_default: true },
      { id: 'qv-w2w-2', product_id: 'prod-w2w-01', quality_name: '12mm Soft Cut-Pile Velour', quality_tier: 'Premium', specification_note: 'Plush underfoot comfort with thermal underlay', rate_per_sqft: 110, swatch_image_url: '', is_default: false },
      { id: 'qv-w2w-3', product_id: 'prod-w2w-01', quality_name: '16mm Luxury Acoustic Saxony Pile', quality_tier: 'Luxury', specification_note: 'Heavy acoustic dampening + Scotchgard stain shield', rate_per_sqft: 165, swatch_image_url: '', is_default: false },
    ],
  },

  // 3. PVC CARPET (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-pvcc-01',
    category_id: 'cat-03-pvc-carpet',
    title: 'Heavy-Duty Waterproof Woven-Texture PVC Floor Carpet',
    slug: 'heavy-duty-waterproof-pvc-floor-carpet',
    sku: 'PVCC-301',
    short_description:
      '100% waterproof, mop-friendly PVC floor carpet roll cut to your exact room width and length.',
    design_style: 'Geometric & Woven',
    room_type: 'Dining & Hall',
    primary_image_url:
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 38,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-05T10:00:00Z',
    quality_variants: [
      { id: 'qv-pvcc-1', product_id: 'prod-pvcc-01', quality_name: '1.5mm Standard PVC Roll', quality_tier: 'Standard', specification_note: 'Waterproof domestic floor protection', rate_per_sqft: 38, swatch_image_url: '', is_default: true },
      { id: 'qv-pvcc-2', product_id: 'prod-pvcc-01', quality_name: '2.5mm Cushion-Backed PVC Carpet', quality_tier: 'Premium', specification_note: 'Anti-skid foam backing + tear resistant', rate_per_sqft: 58, swatch_image_url: '', is_default: false },
      { id: 'qv-pvcc-3', product_id: 'prod-pvcc-01', quality_name: '3.5mm Woven-Jacquard PVC Sisal Grade', quality_tier: 'Luxury', specification_note: 'Architectural woven sisal look + heavy wear layer', rate_per_sqft: 85, swatch_image_url: '', is_default: false },
    ],
  },

  // 4. MATS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-mat-01',
    category_id: 'cat-04-mats',
    title: 'Architectural Coil & S-Grip Custom Entrance Runner Mat',
    slug: 'architectural-coil-s-grip-entrance-mat',
    sku: 'MAT-401',
    short_description:
      'Custom-cut dust-trapping cushion coil and wet-area drainage mats sized to your doorway, corridor, or porch.',
    design_style: 'Solid / Textured',
    room_type: 'Balcony / Outdoor',
    primary_image_url:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 55,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-06T10:00:00Z',
    quality_variants: [
      { id: 'qv-mat-1', product_id: 'prod-mat-01', quality_name: '12mm PVC Cushion Coil Mat', quality_tier: 'Standard', specification_note: 'Traps dust & mud at residential entrances', rate_per_sqft: 55, swatch_image_url: '', is_default: true },
      { id: 'qv-mat-2', product_id: 'prod-mat-01', quality_name: '15mm Heavy S-Grip Drainage Mat', quality_tier: 'Premium', specification_note: 'Anti-slip wet area & porch drainage grip', rate_per_sqft: 78, swatch_image_url: '', is_default: false },
      { id: 'qv-mat-3', product_id: 'prod-mat-01', quality_name: '18mm Bordered Commercial Loop Mat', quality_tier: 'Luxury', specification_note: 'High-density scraper fiber with beveled rubber edge', rate_per_sqft: 115, swatch_image_url: '', is_default: false },
    ],
  },

  // 5. WALLPAPER (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-wp-01',
    category_id: 'cat-05-wallpaper',
    title: 'Venetian Linen & Warm Terracotta Arch Embossed Wallpaper',
    slug: 'venetian-linen-terracotta-embossed-wallpaper',
    sku: 'WP-501',
    short_description:
      'Tactile linen-weave architectural wallpaper with washable vinyl surface. Custom-calculated to your wall width and height.',
    design_style: 'Modern Minimalist',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 45,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-07T10:00:00Z',
    quality_variants: [
      { id: 'qv-wp-1', product_id: 'prod-wp-01', quality_name: '220 GSM Non-Woven Matte Paper', quality_tier: 'Standard', specification_note: 'Breathable eco-ink print for dry interior walls', rate_per_sqft: 45, swatch_image_url: '', is_default: true },
      { id: 'qv-wp-2', product_id: 'prod-wp-01', quality_name: '300 GSM Heavy Embossed Washable Vinyl', quality_tier: 'Premium', specification_note: 'Deep linen texture + sponge-washable coating', rate_per_sqft: 75, swatch_image_url: '', is_default: false },
      { id: 'qv-wp-3', product_id: 'prod-wp-01', quality_name: '420 GSM Silk-Backed Seamless Canvas Mural', quality_tier: 'Luxury', specification_note: 'Single-piece joint-free custom wall canvas', rate_per_sqft: 120, swatch_image_url: '', is_default: false },
    ],
  },

  // 6. SELF-ADHESIVE WALLPAPER (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-sawp-01',
    category_id: 'cat-06-self-adhesive-wallpaper',
    title: 'Nordic Travertine Peel-and-Stick Waterproof Wallpaper',
    slug: 'nordic-travertine-self-adhesive-wallpaper',
    sku: 'SAWP-601',
    short_description:
      'Self-adhesive matte stone-texture wall film. Zero glue mess—peel, align, and press onto smooth walls, wardrobes, or kitchen backsplashes.',
    design_style: 'Modern Minimalist',
    room_type: 'Bedroom',
    primary_image_url:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 35,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-08T10:00:00Z',
    quality_variants: [
      { id: 'qv-sawp-1', product_id: 'prod-sawp-01', quality_name: '0.18mm Standard Peel & Stick PVC', quality_tier: 'Standard', specification_note: 'Removable adhesive for smooth painted walls', rate_per_sqft: 35, swatch_image_url: '', is_default: true },
      { id: 'qv-sawp-2', product_id: 'prod-sawp-01', quality_name: '0.28mm Heavy Bubble-Free Textured Film', quality_tier: 'Premium', specification_note: 'Air-release channels + oil & steam resistant', rate_per_sqft: 55, swatch_image_url: '', is_default: false },
      { id: 'qv-sawp-3', product_id: 'prod-sawp-01', quality_name: '0.40mm Architectural Linen Self-Adhesive', quality_tier: 'Luxury', specification_note: 'Real fabric embossing with industrial acrylic bond', rate_per_sqft: 82, swatch_image_url: '', is_default: false },
    ],
  },

  // 7. UV MARBLE SHEETS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-uv-01',
    category_id: 'cat-07-uv-marble',
    title: 'Calacatta Gold Bookmatched High-Gloss UV Marble Wall Sheet',
    slug: 'calacatta-gold-bookmatched-uv-marble-sheet',
    sku: 'UVM-701',
    short_description:
      'Mirror-finish UV-cured poly-marble wall cladding sheet. Delivers the luxury look of Italian Calacatta marble at a fraction of stone weight and cost.',
    design_style: 'Italian Marble Vein',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 85,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-09T10:00:00Z',
    quality_variants: [
      { id: 'qv-uv-1', product_id: 'prod-uv-01', quality_name: '2.5mm Standard High-Gloss UV Sheet', quality_tier: 'Standard', specification_note: '8×4 ft sheet module, waterproof & termite proof', rate_per_sqft: 85, swatch_image_url: '', is_default: true },
      { id: 'qv-uv-2', product_id: 'prod-uv-01', quality_name: '3.2mm Double-UV Scratch-Resistant Sheet', quality_tier: 'Premium', specification_note: 'High virgin calcium-resin core + mirror gloss', rate_per_sqft: 115, swatch_image_url: '', is_default: false },
      { id: 'qv-uv-3', product_id: 'prod-uv-01', quality_name: '4.0mm Bookmatched 3D Metallic Vein Sheet', quality_tier: 'Luxury', specification_note: 'Fire-retardant B1 grade with aluminum trim support', rate_per_sqft: 155, swatch_image_url: '', is_default: false },
    ],
  },

  // 8. PVC PANELLING (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-pvcp-01',
    category_id: 'cat-08-pvc-panelling',
    title: 'Smoked Walnut & Charcoal Fluted WPC / PVC Louvre Wall Panel',
    slug: 'smoked-walnut-charcoal-fluted-pvc-wall-panel',
    sku: 'PVCP-801',
    short_description:
      'Architectural fluted slat panelling for TV units, bedroom headboards, and damp wall concealment. Interlocking tongue-and-groove fit.',
    design_style: 'Fluted Woodgrain',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 70,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-10T10:00:00Z',
    quality_variants: [
      { id: 'qv-pvcp-1', product_id: 'prod-pvcp-01', quality_name: '8mm Hollow-Core PVC Wall Panel', quality_tier: 'Standard', specification_note: '100% damp-wall proof, fast interlocking install', rate_per_sqft: 70, swatch_image_url: '', is_default: true },
      { id: 'qv-pvcp-2', product_id: 'prod-pvcp-01', quality_name: '12mm Heavy Fluted WPC Louvre Panel', quality_tier: 'Premium', specification_note: 'Deep 3D architectural flutes + wood-fiber strength', rate_per_sqft: 110, swatch_image_url: '', is_default: false },
      { id: 'qv-pvcp-3', product_id: 'prod-pvcp-01', quality_name: '18mm Charcoal Polystyrene Acoustic Panel', quality_tier: 'Luxury', specification_note: 'Ultra-matte scratch-proof veneer + impact core', rate_per_sqft: 150, swatch_image_url: '', is_default: false },
    ],
  },

  // 9. PVC CEILING / SHELLING (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-pvcs-01',
    category_id: 'cat-09-pvc-ceiling',
    title: 'Golden Teak & Warm Cove Designer PVC False Ceiling (Shelling)',
    slug: 'golden-teak-cove-pvc-false-ceiling-shelling',
    sku: 'PVCS-901',
    short_description:
      'Moisture-proof, zero-paint PVC false ceiling shelling with concealed LED cove compatibility and silver/gold groove lines.',
    design_style: 'Fluted Woodgrain',
    room_type: 'Dining & Hall',
    primary_image_url:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 75,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-11T10:00:00Z',
    quality_variants: [
      { id: 'qv-pvcs-1', product_id: 'prod-pvcs-01', quality_name: '7mm Standard Ceiling Planks (Panel Only)', quality_tier: 'Standard', specification_note: 'Lightweight moisture-resistant ceiling planks', rate_per_sqft: 75, swatch_image_url: '', is_default: true },
      { id: 'qv-pvcs-2', product_id: 'prod-pvcs-01', quality_name: '9mm Heavy Hot-Stamped Ceiling + GI Frame', quality_tier: 'Premium', specification_note: 'Includes heavy GI perimeter framing & T-bars', rate_per_sqft: 115, swatch_image_url: '', is_default: false },
      { id: 'qv-pvcs-3', product_id: 'prod-pvcs-01', quality_name: '12mm Multi-Level Cove Soffit Ceiling System', quality_tier: 'Luxury', specification_note: 'Architectural step-cove shelling with 10-yr warranty', rate_per_sqft: 155, swatch_image_url: '', is_default: false },
    ],
  },

  // 10. VERTICAL GRASS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-vg-01',
    category_id: 'cat-10-vertical-grass',
    title: 'Tropical Fern & Boxwood UV-Stabilized Vertical Garden Wall',
    slug: 'tropical-fern-boxwood-vertical-grass-wall',
    sku: 'VG-1001',
    short_description:
      'Lush multi-layered vertical green wall panels for balconies, cafe backdrops, and indoor feature walls. Zero watering required.',
    design_style: 'Botanical / Textured',
    room_type: 'Balcony / Outdoor',
    primary_image_url:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 95,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-12T10:00:00Z',
    quality_variants: [
      { id: 'qv-vg-1', product_id: 'prod-vg-01', quality_name: '4-Layer Dense Milan Boxwood Hedge', quality_tier: 'Standard', specification_note: 'Uniform green hedge mat (50×50cm interlocking)', rate_per_sqft: 95, swatch_image_url: '', is_default: true },
      { id: 'qv-vg-2', product_id: 'prod-vg-01', quality_name: 'Mixed Tropical Fern & Money-Leaf Wall', quality_tier: 'Premium', specification_note: '3D multi-foliage depth + UV fade protection', rate_per_sqft: 145, swatch_image_url: '', is_default: false },
      { id: 'qv-vg-3', product_id: 'prod-vg-01', quality_name: 'Bespoke Botanical Floral & Moss Art Wall', quality_tier: 'Luxury', specification_note: 'Hand-arranged high-density botanical composition', rate_per_sqft: 210, swatch_image_url: '', is_default: false },
    ],
  },

  // 11. WOODEN FLOORING (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-wf-01',
    category_id: 'cat-11-wooden-flooring',
    title: 'European Smoked Oak AC5 Click-Lock Wooden Laminate Flooring',
    slug: 'european-smoked-oak-ac5-wooden-flooring',
    sku: 'WF-1101',
    short_description:
      'Warm synchronized oak grain planks with wax-sealed moisture-resistant edges and acoustic foam underlay.',
    design_style: 'Fluted Woodgrain',
    room_type: 'Bedroom',
    primary_image_url:
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 115,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-13T10:00:00Z',
    quality_variants: [
      { id: 'qv-wf-1', product_id: 'prod-wf-01', quality_name: '8mm AC4 Residential HDF Laminate', quality_tier: 'Standard', specification_note: 'Scratch-resistant plank + 2mm foam underlay', rate_per_sqft: 115, swatch_image_url: '', is_default: true },
      { id: 'qv-wf-2', product_id: 'prod-wf-01', quality_name: '10mm AC5 Commercial V-Groove Herringbone', quality_tier: 'Premium', specification_note: 'Beveled 4-side wax edge + heavy footfall rating', rate_per_sqft: 165, swatch_image_url: '', is_default: false },
      { id: 'qv-wf-3', product_id: 'prod-wf-01', quality_name: '14mm Multi-Ply Real Engineered Hardwood', quality_tier: 'Luxury', specification_note: '3mm genuine European oak top layer + 20-yr life', rate_per_sqft: 280, swatch_image_url: '', is_default: false },
    ],
  },

  // 12. VINYL FLOORING (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-vf-01',
    category_id: 'cat-12-vinyl-flooring',
    title: 'Warm Ash Waterproof SPC / LVT Vinyl Plank Flooring',
    slug: 'warm-ash-waterproof-spc-vinyl-flooring',
    sku: 'VF-1201',
    short_description:
      '100% waterproof, termite-proof vinyl flooring available in cushioned rolls or rigid SPC click-lock planks.',
    design_style: 'Fluted Woodgrain',
    room_type: 'Office / Commercial',
    primary_image_url:
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 52,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-14T10:00:00Z',
    quality_variants: [
      { id: 'qv-vf-1', product_id: 'prod-vf-01', quality_name: '1.5mm Residential Vinyl Roll', quality_tier: 'Standard', specification_note: 'Seamless paste-down waterproof sheet vinyl', rate_per_sqft: 52, swatch_image_url: '', is_default: true },
      { id: 'qv-vf-2', product_id: 'prod-vf-01', quality_name: '3.0mm Dry-Back LVT Luxury Vinyl Planks', quality_tier: 'Premium', specification_note: '0.3mm commercial wear layer + realistic wood grain', rate_per_sqft: 88, swatch_image_url: '', is_default: false },
      { id: 'qv-vf-3', product_id: 'prod-vf-01', quality_name: '5.0mm Rigid Core SPC Click Flooring + IXPE', quality_tier: 'Luxury', specification_note: 'Stone-polymer core with built-in acoustic cushion', rate_per_sqft: 145, swatch_image_url: '', is_default: false },
    ],
  },

  // 13. ARTIFICIAL GRASS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-ag-01',
    category_id: 'cat-13-artificial-grass',
    title: 'Four-Tone Natural Thatch Balcony & Terrace Artificial Turf',
    slug: 'four-tone-natural-balcony-artificial-grass',
    sku: 'AG-1301',
    short_description:
      'Soft child-and-pet-friendly synthetic lawn turf with realistic olive/beige root thatch and fast rainwater drainage holes.',
    design_style: 'Botanical / Textured',
    room_type: 'Balcony / Outdoor',
    primary_image_url:
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 48,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-15T10:00:00Z',
    quality_variants: [
      { id: 'qv-ag-1', product_id: 'prod-ag-01', quality_name: '25mm Standard Balcony Turf (14,700 Stitches)', quality_tier: 'Standard', specification_note: 'Easy-sweep low pile for covered balconies', rate_per_sqft: 48, swatch_image_url: '', is_default: true },
      { id: 'qv-ag-2', product_id: 'prod-ag-01', quality_name: '35mm High-Density 4-Tone Lawn Turf', quality_tier: 'Premium', specification_note: 'Soft C-shape yarn + double SBR latex backing', rate_per_sqft: 72, swatch_image_url: '', is_default: false },
      { id: 'qv-ag-3', product_id: 'prod-ag-01', quality_name: '50mm Ultra-Plush Landscape Terrace Grass', quality_tier: 'Luxury', specification_note: 'Maximum cushion density + 8-year UV stabilization', rate_per_sqft: 105, swatch_image_url: '', is_default: false },
    ],
  },

  // 14. CURTAINS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-cur-01',
    category_id: 'cat-14-curtains',
    title: 'Belgian Oatmeal Linen & Thermal Blackout Custom Window Curtains',
    slug: 'belgian-oatmeal-linen-blackout-custom-curtains',
    sku: 'CUR-1401',
    short_description:
      'Tailor-stitched floor-to-ceiling curtains in American pleat, eyelet, or motorized ripple-fold track styles.',
    design_style: 'Modern Minimalist',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 85,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-16T10:00:00Z',
    quality_variants: [
      { id: 'qv-cur-1', product_id: 'prod-cur-01', quality_name: '260 GSM Textured Linen-Look Drape', quality_tier: 'Standard', specification_note: '70% light filtering with custom eyelet or pleat stitching', rate_per_sqft: 85, swatch_image_url: '', is_default: true },
      { id: 'qv-cur-2', product_id: 'prod-cur-01', quality_name: '380 GSM 3-Pass Thermal Blackout Curtain', quality_tier: 'Premium', specification_note: '95% room darkening + summer heat insulation', rate_per_sqft: 130, swatch_image_url: '', is_default: false },
      { id: 'qv-cur-3', product_id: 'prod-cur-01', quality_name: 'Double-Track Sheer + Heavy Velvet Hotel Combo', quality_tier: 'Luxury', specification_note: 'Includes silent aluminum ripple-fold track & lining', rate_per_sqft: 195, swatch_image_url: '', is_default: false },
    ],
  },

  // 15. BLINDS (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-bl-01',
    category_id: 'cat-15-blinds',
    title: 'Architectural Day-Night Zebra & Wooden Venetian Window Blinds',
    slug: 'architectural-day-night-zebra-window-blinds',
    sku: 'BL-1501',
    short_description:
      'Precision-measured window blinds with smooth chain drive or remote motorization. Built to your exact window recess width and drop.',
    design_style: 'Modern Minimalist',
    room_type: 'Office / Commercial',
    primary_image_url:
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 110,
    is_featured: false,
    is_active: true,
    created_at: '2026-10-17T10:00:00Z',
    quality_variants: [
      { id: 'qv-bl-1', product_id: 'prod-bl-01', quality_name: 'Sunscreen / Blackout Roller Blind', quality_tier: 'Standard', specification_note: 'Heavy aluminum tube with smooth ball-chain clutch', rate_per_sqft: 110, swatch_image_url: '', is_default: true },
      { id: 'qv-bl-2', product_id: 'prod-bl-01', quality_name: 'Dual-Layer Day & Night Zebra Blind', quality_tier: 'Premium', specification_note: 'Pelmet cassette header + sheer-to-privacy control', rate_per_sqft: 155, swatch_image_url: '', is_default: false },
      { id: 'qv-bl-3', product_id: 'prod-bl-01', quality_name: '50mm Seasoned Basswood Venetian Blind', quality_tier: 'Luxury', specification_note: 'Kiln-dried natural wood slats with ladder tape', rate_per_sqft: 240, swatch_image_url: '', is_default: false },
    ],
  },

  // 16. CUSTOM-MADE FURNITURE (MODE B: CUSTOM_SQFT)
  {
    id: 'prod-cf-01',
    category_id: 'cat-16-custom-furniture',
    title: 'Moderno Bespoke Bouclé Lounger Sofa & Upholstered Wall Bed',
    slug: 'moderno-bespoke-boucle-sofa-and-upholstered-bed',
    sku: 'CF-1601',
    short_description:
      'Custom-crafted sofas, L-shaped sectionals, channel-tufted headboards, and TV consoles built to your exact room layout and fabric choice.',
    design_style: 'Modern Minimalist',
    room_type: 'Living Room',
    primary_image_url:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    gallery_image_urls: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1000&q=80',
    ],
    allows_custom_design: true,
    min_display_price: 450,
    is_featured: true,
    is_active: true,
    created_at: '2026-10-18T10:00:00Z',
    quality_variants: [
      { id: 'qv-cf-1', product_id: 'prod-cf-01', quality_name: 'CommercialPly + 32-Density Foam + Suede Fabric', quality_tier: 'Standard', specification_note: 'Durable everyday family seating & storage build', rate_per_sqft: 450, swatch_image_url: '', is_default: true },
      { id: 'qv-cf-2', product_id: 'prod-cf-01', quality_name: 'Seasoned Marandi Timber + 40D HR Foam + Bouclé', quality_tier: 'Premium', specification_note: 'Stain-repellent European bouclé or velvet upholstery', rate_per_sqft: 680, swatch_image_url: '', is_default: false },
      { id: 'qv-cf-3', product_id: 'prod-cf-01', quality_name: 'Solid Teak Frame + Feather-Touch Pocket Spring', quality_tier: 'Luxury', specification_note: '10-year structural warranty + bespoke brass/walnut accents', rate_per_sqft: 950, swatch_image_url: '', is_default: false },
    ],
  },
];

function hydrateProductWithCategory(product: Product, categories: Category[]): Product {
  const matchedCat =
    product.category ||
    categories.find((c) => c.id === product.category_id) ||
    CANONICAL_CATEGORIES[0];

  const isFixedRug = matchedCat.pricing_mode === 'FIXED_RUG';

  return {
    ...product,
    allows_custom_design: isFixedRug ? false : product.allows_custom_design,
    category: matchedCat,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  }
  return CANONICAL_CATEGORIES.filter((c) => c.is_active);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await fetchCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function fetchAllProducts(): Promise<Product[]> {
  const categories = await fetchCategories();

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*, rug_sizes:rug_size_variants(*), quality_variants:quality_variants(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return (data as Product[]).map((p) => hydrateProductWithCategory(p, categories));
    }
  }

  return SEED_PRODUCTS.map((p) => hydrateProductWithCategory(p, categories));
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const allProducts = await fetchAllProducts();
  return allProducts.filter((p) => p.is_featured);
}

export async function fetchProductsByCategory(categorySlug: string): Promise<{
  category: Category | null;
  products: Product[];
}> {
  const categories = await fetchCategories();
  const category = categories.find((c) => c.slug === categorySlug) ?? null;
  if (!category) {
    return { category: null, products: [] };
  }

  const allProducts = await fetchAllProducts();
  const matching = allProducts.filter(
    (p) => p.category_id === category.id || p.category?.slug === categorySlug
  );
  return { category, products: matching };
}

export async function fetchProductBySlug(productSlug: string): Promise<{
  product: Product | null;
  relatedProducts: Product[];
}> {
  const allProducts = await fetchAllProducts();
  const product = allProducts.find((p) => p.slug === productSlug) ?? null;

  if (!product) {
    return { product: null, relatedProducts: [] };
  }

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category_id === product.category_id)
    .slice(0, 4);

  return { product, relatedProducts };
}

export function extractFilterOptions(
  products: Product[],
  pricingMode: PricingMode
): AvailableFilterOptions {
  if (products.length === 0) {
    return {
      minPriceBoundary: 0,
      maxPriceBoundary: pricingMode === 'FIXED_RUG' ? 25000 : 1000,
      designStyles: [],
      roomTypes: [],
      qualityTiers: ['Standard', 'Premium', 'Luxury'],
      rugSizeLabels: ['4×6 ft', '5×8 ft', '6×9 ft', '8×10 ft', '9×12 ft'],
    };
  }

  const prices = products.map((p) => p.min_display_price);
  const minPriceBoundary = Math.min(...prices, 0);
  const maxPriceBoundary = Math.max(
    ...prices,
    pricingMode === 'FIXED_RUG' ? 20000 : 300
  );

  const designStyles = Array.from(
    new Set(products.map((p) => p.design_style).filter(Boolean))
  );
  const roomTypes = Array.from(
    new Set(products.map((p) => p.room_type).filter(Boolean))
  );

  const rugSizeSet = new Set<string>();
  products.forEach((p) => {
    p.rug_sizes?.forEach((rs) => rugSizeSet.add(rs.size_label));
  });

  return {
    minPriceBoundary,
    maxPriceBoundary,
    designStyles,
    roomTypes,
    qualityTiers: ['Standard', 'Premium', 'Luxury'],
    rugSizeLabels:
      rugSizeSet.size > 0
        ? Array.from(rugSizeSet)
        : ['4×6 ft', '5×8 ft', '6×9 ft', '8×10 ft', '9×12 ft'],
  };
}

export function applyCatalogFilters(
  products: Product[],
  filters: CatalogFilterState,
  pricingMode: PricingMode
): Product[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (query) {
      const hay = `${product.title} ${product.short_description} ${product.design_style} ${product.room_type}`.toLowerCase();
      if (!hay.includes(query)) {
        return false;
      }
    }

    if (product.min_display_price > filters.maxPrice) {
      return false;
    }

    if (
      filters.selectedDesignStyles.length > 0 &&
      !filters.selectedDesignStyles.includes(product.design_style)
    ) {
      return false;
    }

    if (
      filters.selectedRoomTypes.length > 0 &&
      !filters.selectedRoomTypes.includes(product.room_type)
    ) {
      return false;
    }

    if (pricingMode === 'FIXED_RUG' && filters.selectedRugSizes.length > 0) {
      const productSizes = product.rug_sizes?.map((s) => s.size_label) ?? [];
      const hasMatchingSize = filters.selectedRugSizes.some((size) =>
        productSizes.includes(size)
      );
      if (!hasMatchingSize) {
        return false;
      }
    }

    if (pricingMode === 'CUSTOM_SQFT' && filters.selectedQualityTiers.length > 0) {
      const productTiers =
        product.quality_variants?.map((q) => q.quality_tier) ?? [];
      const hasMatchingTier = filters.selectedQualityTiers.some((tier) =>
        productTiers.includes(tier)
      );
      if (!hasMatchingTier) {
        return false;
      }
    }

    return true;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sortBy === 'price-asc') {
      return a.min_display_price - b.min_display_price;
    }
    if (filters.sortBy === 'price-desc') {
      return b.min_display_price - a.min_display_price;
    }
    return Number(b.is_featured) - Number(a.is_featured);
  });
}
