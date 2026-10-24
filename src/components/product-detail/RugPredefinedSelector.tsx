/**
 * MODE A ONLY: MACHINE-MADE RUG PREDEFINED SIZE SELECTOR
 * Phase 2 Locked File — Strictly enforces Domain Invariant #1:
 * Machine-made rugs offer predefined standard sizes ONLY.
 * No custom Width x Height inputs, no per-sq.ft. calculators, and no handmade labels.
 */
import React, { useState } from 'react';
import { Check, PhoneCall, ShieldCheck, Store } from 'lucide-react';
import { Product, RugSizeVariant } from '../../types/database.types';
import {
  calculatePredefinedRugPrice,
  formatCurrencyINR,
  triggerGlobalInquiryModal,
} from '../../utils/pricingEngine';

interface RugPredefinedSelectorProps {
  product: Product;
}

export const RugPredefinedSelector: React.FC<RugPredefinedSelectorProps> = ({
  product,
}) => {
  const sizes: RugSizeVariant[] =
    product.rug_sizes && product.rug_sizes.length > 0
      ? product.rug_sizes
      : [
          {
            id: 'default-4x6',
            product_id: product.id,
            size_label: '4×6 ft',
            width_ft: 4,
            length_ft: 6,
            fixed_price: product.min_display_price || 4200,
            in_stock: true,
          },
          {
            id: 'default-5x8',
            product_id: product.id,
            size_label: '5×8 ft',
            width_ft: 5,
            length_ft: 8,
            fixed_price: Math.round((product.min_display_price || 4200) * 1.6),
            in_stock: true,
          },
          {
            id: 'default-6x9',
            product_id: product.id,
            size_label: '6×9 ft',
            width_ft: 6,
            length_ft: 9,
            fixed_price: Math.round((product.min_display_price || 4200) * 2.2),
            in_stock: true,
          },
        ];

  const [selectedVariant, setSelectedVariant] = useState<RugSizeVariant>(sizes[0]);
  const priceResult = calculatePredefinedRugPrice(selectedVariant);

  const handleOrderInquiry = () => {
    triggerGlobalInquiryModal({
      queryType: 'RUG_ORDER_INQUIRY',
      productId: product.id,
      productTitle: product.title,
      dimensionsSummary: priceResult.formattedSummary,
      qualityName: 'Machine-Made Standard Weave',
      estimatedPrice: priceResult.fixedPrice,
    });
  };

  const handleShopVisit = () => {
    triggerGlobalInquiryModal({
      queryType: 'SHOP_VISIT',
      productId: product.id,
      productTitle: product.title,
      dimensionsSummary: priceResult.formattedSummary,
      estimatedPrice: priceResult.fixedPrice,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5DFD3] p-5 sm:p-6 space-y-6">
      {/* Machine-Made Specification Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3]">
        <ShieldCheck className="w-5 h-5 text-[#1E1E1C] shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            100% Machine-Made Ready Rug • Predefined Standard Sizes Only
          </span>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            This rug is precision machine-woven in fixed standard dimensions. Select your preferred ready room size below for the exact price.
          </p>
        </div>
      </div>

      {/* Size Selector Pills */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            Select Predefined Rug Size:
          </label>
          <span className="text-xs text-[#6E6A63]">
            Coverage: <strong>{priceResult.areaSqFt} Sq. Ft.</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {sizes.map((variant) => {
            const isSelected = variant.id === selectedVariant.id;
            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariant(variant)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#1E1E1C] text-white border-[#1E1E1C] shadow-sm'
                    : 'bg-[#FAF8F5] text-[#1E1E1C] border-[#E5DFD3] hover:border-[#9C5A3C]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-bold">{variant.size_label}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#F0ECE1]" />}
                </div>
                <span
                  className={`text-xs font-semibold mt-1 ${
                    isSelected ? 'text-[#F0ECE1]' : 'text-[#9C5A3C]'
                  }`}
                >
                  {formatCurrencyINR(variant.fixed_price)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Price Display Box */}
      <div className="p-4 rounded-2xl bg-[#F0ECE1]/70 border border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6A63]">
            Selected Ready Rug Price ({priceResult.sizeLabel})
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] mt-0.5">
            {formatCurrencyINR(priceResult.fixedPrice)}
          </div>
          <span className="text-[11px] text-[#1F7A4C] font-semibold">
            ✓ In Stock • Ready for Store Pickup or Home Delivery
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleOrderInquiry}
            className="px-5 py-3 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition"
          >
            Reserve / Order This Size
          </button>
        </div>
      </div>

      {/* Secondary Shop Visit & Call Triggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#E5DFD3]">
        <button
          type="button"
          onClick={handleShopVisit}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] hover:border-[#1E1E1C] text-xs font-semibold text-[#1E1E1C] transition"
        >
          <Store className="w-4 h-4 text-[#9C5A3C]" />
          <span>Visit Shop to Inspect Rug</span>
        </button>

        <button
          type="button"
          onClick={() =>
            triggerGlobalInquiryModal({
              queryType: 'CALLBACK_REQUEST',
              productId: product.id,
              productTitle: product.title,
              dimensionsSummary: priceResult.formattedSummary,
              estimatedPrice: priceResult.fixedPrice,
            })
          }
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1F7A4C] hover:bg-[#17613B] text-white text-xs font-semibold transition"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Request Callback 🤙</span>
        </button>
      </div>
    </div>
  );
};
