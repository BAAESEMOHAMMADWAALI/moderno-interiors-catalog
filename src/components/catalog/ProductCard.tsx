/**
 * MINIMALIST PRODUCT CARD COMPONENT
 * Phase 2 Locked File — Clearly distinguishes Mode A (Machine-Made Ready Rugs with
 * predefined sizes) from Mode B (Custom Sq.Ft. products with material quality tiers).
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Home, Layers, Ruler, ShieldCheck } from 'lucide-react';
import { Product } from '../../types/database.types';
import {
  formatCurrencyINR,
  triggerGlobalInquiryModal,
} from '../../utils/pricingEngine';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isFixedRug = product.category?.pricing_mode === 'FIXED_RUG';
  const rugSizes = product.rug_sizes ?? [];
  const qualityVariants = product.quality_variants ?? [];

  const handleQuickHomeVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    triggerGlobalInquiryModal({
      queryType: 'HOME_MEASUREMENT',
      productId: product.id,
      productTitle: product.title,
    });
  };

  return (
    <article className="group bg-white rounded-2xl border border-[#E5DFD3] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-[#9C5A3C]/50">
      <div>
        {/* Product Image & Mode Badge */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-[#F0ECE1]"
        >
          <img
            src={product.primary_image_url}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Left Mode Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isFixedRug ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#1E1E1C]/90 text-white backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3 text-[#F0ECE1]" />
                Machine-Made • Ready Size
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#1E1E1C] border border-[#E5DFD3] backdrop-blur-sm">
                <Ruler className="w-3 h-3 text-[#9C5A3C]" />
                Custom Size • {product.category?.unit_label || 'Sq. Ft.'}
              </span>
            )}
          </div>

          {/* Style Tag */}
          <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
            {product.design_style}
          </span>
        </Link>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-[11px] text-[#6E6A63] mb-1">
            <span className="font-medium text-[#9C5A3C]">
              {product.category?.name || 'Interior Collection'}
            </span>
            <span>{product.room_type}</span>
          </div>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-[#1E1E1C] group-hover:text-[#9C5A3C] transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-[#6E6A63] mt-1.5 line-clamp-2 leading-relaxed">
            {product.short_description}
          </p>

          {/* Mode-Specific Variant Preview Pills */}
          <div className="mt-3.5 pt-3 border-t border-[#E5DFD3]/80">
            {isFixedRug ? (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5">
                  Predefined Sizes Available (No Custom Cut):
                </p>
                <div className="flex flex-wrap gap-1">
                  {rugSizes.slice(0, 4).map((sz) => (
                    <span
                      key={sz.id}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DFD3] text-[#1E1E1C] font-medium"
                    >
                      {sz.size_label}
                    </span>
                  ))}
                  {rugSizes.length > 4 && (
                    <span className="text-[11px] px-1.5 py-0.5 text-[#9C5A3C] font-semibold">
                      +{rugSizes.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6E6A63] mb-1.5 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-[#9C5A3C]" />
                  <span>{qualityVariants.length || 3} Material Quality Grades:</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {qualityVariants.slice(0, 3).map((qv) => (
                    <span
                      key={qv.id}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5DFD3] text-[#1E1E1C] truncate max-w-[140px]"
                    >
                      {qv.quality_tier}: ₹{qv.rate_per_sqft}/sqft
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer Price & Actions */}
      <div className="px-4 sm:px-5 pb-4 pt-2 flex items-center justify-between gap-2 border-t border-[#FAF8F5]">
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-[#6E6A63]">
            {isFixedRug ? 'Starting Ready Size' : 'Starting Material Rate'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-[#1E1E1C]">
              {formatCurrencyINR(product.min_display_price)}
            </span>
            {!isFixedRug && (
              <span className="text-xs font-medium text-[#6E6A63]">
                / {product.category?.unit_label || 'Sq. Ft.'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isFixedRug && (
            <button
              type="button"
              onClick={handleQuickHomeVisit}
              title="Book Home Measurement Visit"
              className="p-2.5 rounded-xl bg-[#F0ECE1] hover:bg-[#9C5A3C] text-[#1E1E1C] hover:text-white transition"
            >
              <Home className="w-4 h-4" />
            </button>
          )}

          <Link
            to={`/product/${product.slug}`}
            className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-semibold transition"
          >
            <span>{isFixedRug ? 'Pick Size' : 'Calculate'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
