/**
 * PUBLIC HOMEPAGE (MODERNO + lano ARCHITECTURAL MINIMALIST DESIGN)
 * Phase 2 Locked File — Showcases all 16 categories across 4 pillars, tactile material
 * swatches, Featured Machine-Made Rugs (Mode A), Featured Custom-Measured Products (Mode B),
 * and instant Home Measurement / Callback triggers.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Home,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CANONICAL_CATEGORIES, NAV_GROUPS } from '../../config/categoriesSeed';
import { Product } from '../../types/database.types';
import { fetchAllProducts } from '../../services/catalogService';
import { ProductCard } from '../../components/catalog/ProductCard';
import { MaterialSwatchStrip } from '../../components/catalog/MaterialSwatchStrip';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activePillar, setActivePillar] = useState<string>('ALL');

  useEffect(() => {
    void fetchAllProducts().then(setProducts);
  }, []);

  const readyRugProducts = products.filter(
    (p) => p.category?.pricing_mode === 'FIXED_RUG'
  );
  const customMeasuredProducts = products
    .filter((p) => p.category?.pricing_mode === 'CUSTOM_SQFT')
    .slice(0, 6);

  const visibleCategories =
    activePillar === 'ALL'
      ? CANONICAL_CATEGORIES
      : CANONICAL_CATEGORIES.filter((c) => c.nav_group === activePillar);

  return (
    <div className="space-y-14">
      {/* HERO SECTION (MODERNO Aesthetic) */}
      <section className="relative overflow-hidden bg-[#F0ECE1] border-b border-[#E5DFD3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E5DFD3] text-xs font-semibold text-[#9C5A3C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>16 Complete Interior & Furnishing Categories</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-[#1E1E1C] leading-[1.12] tracking-tight">
              Architectural Walls, Flooring, Custom Decor & Machine-Made Rugs.
            </h1>

            <p className="text-sm sm:text-base text-[#6E6A63] max-w-2xl leading-relaxed">
              Browse ready-sized machine-made rugs or calculate instant custom prices for Wallpapers, UV Marble Sheets, Fluted PVC Panels, Wooden & Vinyl Flooring, Artificial Grass, Curtains, Blinds, and Custom Furniture.
            </p>

            {/* Primary Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#shop-by-category"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() =>
                  triggerGlobalInquiryModal({ queryType: 'HOME_MEASUREMENT' })
                }
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#1E1E1C] border border-[#1E1E1C] text-xs sm:text-sm font-bold transition"
              >
                <Home className="w-4 h-4 text-[#9C5A3C]" />
                <span>Call to House for Size 🏡</span>
              </button>
            </div>

            {/* Trust Micro-Bar */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-[#E5DFD3] text-xs text-[#1E1E1C]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] shrink-0" />
                <span>Machine-Made Ready Rugs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] shrink-0" />
                <span>Live Sq.Ft. Price Calculator</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F7A4C] shrink-0" />
                <span>Home Sample Book Visit</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-[#E5DFD3] bg-white shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Interior Showroom"
                className="w-full h-72 sm:h-96 object-cover"
              />
              <div className="p-4 sm:p-5 bg-white flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9C5A3C]">
                    Need On-Site Measurement?
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#1E1E1C]">
                    Our Technician Visits Your House With Sample Books
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    triggerGlobalInquiryModal({ queryType: 'CALLBACK_REQUEST' })
                  }
                  className="px-3.5 py-2.5 rounded-xl bg-[#1F7A4C] text-white text-xs font-bold shrink-0 flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Me 🤙</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOP BY ALL 16 CATEGORIES */}
      <section id="shop-by-category" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
              Complete Store Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] mt-1">
              Shop by Product Category (16 Lines)
            </h2>
          </div>

          {/* Pillar Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              type="button"
              onClick={() => setActivePillar('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activePillar === 'ALL'
                  ? 'bg-[#1E1E1C] text-white'
                  : 'bg-white border border-[#E5DFD3] text-[#1E1E1C]'
              }`}
            >
              All 16 Categories
            </button>
            {NAV_GROUPS.map((grp) => (
              <button
                key={grp.key}
                type="button"
                onClick={() => setActivePillar(grp.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                  activePillar === grp.key
                    ? 'bg-[#1E1E1C] text-white'
                    : 'bg-white border border-[#E5DFD3] text-[#1E1E1C]'
                }`}
              >
                {grp.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {visibleCategories.map((cat) => {
            const isFixedRug = cat.pricing_mode === 'FIXED_RUG';
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group p-4 rounded-2xl bg-white border border-[#E5DFD3] hover:border-[#1E1E1C] hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isFixedRug
                          ? 'bg-[#1E1E1C] text-white'
                          : 'bg-[#F0ECE1] text-[#9C5A3C]'
                      }`}
                    >
                      {isFixedRug ? 'Ready Sizes Only' : 'Custom Size + Quality'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#6E6A63] group-hover:text-[#1E1E1C] group-hover:translate-x-0.5 transition-transform" />
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#1E1E1C] group-hover:text-[#9C5A3C] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#6E6A63] mt-1 line-clamp-2">
                    {cat.short_description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] text-[#6E6A63]">
                  <span>Filter by: {cat.material_filter_label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: TACTILE MATERIAL SWATCH STRIP ("lano" inspired) */}
      <MaterialSwatchStrip />

      {/* SECTION 4: MACHINE-MADE READY RUGS SHOWCASE (MODE A) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
              <ShieldCheck className="w-4 h-4 text-[#9C5A3C]" />
              Mode A • Predefined Standard Sizes Only
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] mt-1">
              Machine-Made Rugs & Carpets
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6A63]">
              Ready-to-lay machine-woven Iranian & Turkish Oushak designs in fixed standard house sizes (4×6 ft to 9×12 ft).
            </p>
          </div>
          <Link
            to="/category/rugs-and-carpets"
            className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C] hover:underline"
          >
            View All Machine-Made Rugs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readyRugProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 5: CUSTOM-MEASURED WALLS, FLOORING & WINDOWS (MODE B) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
              <Ruler className="w-4 h-4" />
              Mode B • Custom Dimensions & Material Quality Tiers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] mt-1">
              Custom-Sized Wallpapers, Panels, Flooring & Drapes
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6A63]">
              Enter your wall or floor Width × Height for an instant price estimate, or book a technician visit to measure your house.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {customMeasuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
