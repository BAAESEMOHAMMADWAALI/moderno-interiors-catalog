/**
 * MODE B ONLY: CUSTOM DIMENSION CALCULATOR & 3-PATH SIZING ENGINE
 * Phase 2 Locked File — Serves the 15 custom-measured categories (Wallpaper,
 * UV Marble Sheets, PVC Panels, PVC Ceiling, Flooring, Grass, Curtains, Blinds, Furniture).
 * Includes touch-friendly +/- steppers, material quality tiers, and wastage toggle.
 */
import React, { useState, useEffect } from 'react';
import {
  Calculator,
  CheckCircle2,
  Home,
  Minus,
  PhoneCall,
  Plus,
  Store,
} from 'lucide-react';
import {
  MeasurementUnit,
  Product,
  QualityVariant,
  WastagePercentage,
} from '../../types/database.types';
import {
  calculateCustomSqFtPrice,
  formatCurrencyINR,
  triggerGlobalInquiryModal,
} from '../../utils/pricingEngine';
import { useStoreSettings } from '../../context/StoreSettingsContext';

interface CustomDimensionCalcProps {
  product: Product;
  customDesignNotes: string;
  referenceImageUrl: string;
}

type SizingTab = 'SELF_SIZE' | 'HOME_VISIT' | 'SHOP_OR_CALL';

export const CustomDimensionCalc: React.FC<CustomDimensionCalcProps> = ({
  product,
  customDesignNotes,
  referenceImageUrl,
}) => {
  const { settings } = useStoreSettings();

  const variants: QualityVariant[] =
    product.quality_variants && product.quality_variants.length > 0
      ? product.quality_variants
      : [
          {
            id: 'default-std',
            product_id: product.id,
            quality_name: 'Standard Commercial Grade',
            quality_tier: 'Standard',
            specification_note: 'Durable everyday residential grade',
            rate_per_sqft: product.min_display_price || 55,
            swatch_image_url: '',
            is_default: true,
          },
          {
            id: 'default-prem',
            product_id: product.id,
            quality_name: 'Premium Heavy-Duty Grade',
            quality_tier: 'Premium',
            specification_note: 'Enhanced thickness, moisture & stain resistance',
            rate_per_sqft: Math.round((product.min_display_price || 55) * 1.45),
            swatch_image_url: '',
            is_default: false,
          },
          {
            id: 'default-lux',
            product_id: product.id,
            quality_name: 'Luxury Architectural Grade',
            quality_tier: 'Luxury',
            specification_note: 'Top-tier acoustic/UV/fire-rated finish with warranty',
            rate_per_sqft: Math.round((product.min_display_price || 55) * 2.0),
            swatch_image_url: '',
            is_default: false,
          },
        ];

  const [activeTab, setActiveTab] = useState<SizingTab>('SELF_SIZE');
  const [unit, setUnit] = useState<MeasurementUnit>('ft');
  const [width, setWidth] = useState<number>(10);
  const [height, setHeight] = useState<number>(10);
  const [wastagePercent, setWastagePercent] = useState<WastagePercentage>(5);
  const [selectedQuality, setSelectedQuality] = useState<QualityVariant>(
    variants.find((v) => v.is_default) || variants[0]
  );

  useEffect(() => {
    setSelectedQuality(variants.find((v) => v.is_default) || variants[0]);
  }, [product.id]);

  const calcResult = calculateCustomSqFtPrice({
    width,
    height,
    unit,
    wastagePercent,
    ratePerSqFt: selectedQuality.rate_per_sqft,
  });

  const adjustDimension = (
    field: 'width' | 'height',
    delta: number
  ) => {
    if (field === 'width') {
      setWidth((prev) => Math.max(1, Number((prev + delta).toFixed(1))));
    } else {
      setHeight((prev) => Math.max(1, Number((prev + delta).toFixed(1))));
    }
  };

  const buildCombinedNotes = () => {
    const parts: string[] = [];
    if (customDesignNotes.trim()) {
      parts.push(`Custom Design Request: ${customDesignNotes.trim()}`);
    }
    if (referenceImageUrl.trim()) {
      parts.push(`Reference Image: ${referenceImageUrl.trim()}`);
    }
    return parts.join(' | ');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 sm:p-6 space-y-6">
      {/* 3 Customer Sizing Mode Tabs */}
      <div>
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#9C5A3C] mb-2">
          How Would You Like to Provide Your Size?
        </span>
        <div className="grid grid-cols-3 gap-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E5DFD3]">
          <button
            type="button"
            onClick={() => setActiveTab('SELF_SIZE')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'SELF_SIZE'
                ? 'bg-[#1E1E1C] text-white shadow-xs'
                : 'text-[#6E6A63] hover:text-[#1E1E1C]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>1. Enter My Size</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('HOME_VISIT')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'HOME_VISIT'
                ? 'bg-[#1E1E1C] text-white shadow-xs'
                : 'text-[#6E6A63] hover:text-[#1E1E1C]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>2. Home Visit 🏡</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SHOP_OR_CALL')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 ${
              activeTab === 'SHOP_OR_CALL'
                ? 'bg-[#1E1E1C] text-white shadow-xs'
                : 'text-[#6E6A63] hover:text-[#1E1E1C]'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>3. Shop / Call 🤙</span>
          </button>
        </div>
      </div>

      {/* Step 1: Material & Quality Tier Selection (Always visible so price & inquiry include quality) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            Select {product.category?.material_filter_label || 'Material Quality'}:
          </label>
          <span className="text-xs font-semibold text-[#9C5A3C]">
            {selectedQuality.quality_tier} Tier
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {variants.map((qv) => {
            const isSelected = qv.id === selectedQuality.id;
            return (
              <button
                key={qv.id}
                type="button"
                onClick={() => setSelectedQuality(qv)}
                className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-[#1E1E1C] ring-1 ring-[#1E1E1C]'
                    : 'bg-white border-[#E5DFD3] hover:border-[#9C5A3C]'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1E1E1C]">
                      {qv.quality_name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F0ECE1] text-[#9C5A3C]">
                      {qv.quality_tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6E6A63]">
                    {qv.specification_note}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="block text-sm font-bold text-[#1E1E1C]">
                    {formatCurrencyINR(qv.rate_per_sqft)}
                  </span>
                  <span className="text-[10px] text-[#6E6A63]">per Sq. Ft.</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1 CONTENT: ENTER MY OWN SIZE */}
      {activeTab === 'SELF_SIZE' && (
        <div className="space-y-5 pt-2 border-t border-[#E5DFD3]">
          {/* Unit Switcher */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
              Enter Wall / Floor / Window Dimensions:
            </span>
            <div className="inline-flex rounded-lg border border-[#E5DFD3] bg-[#FAF8F5] p-0.5">
              {(['ft', 'inch', 'meter'] as MeasurementUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase transition ${
                    unit === u
                      ? 'bg-[#1E1E1C] text-white'
                      : 'text-[#6E6A63] hover:text-[#1E1E1C]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile-Friendly Touch Steppers for Width & Height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Width Box */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3]">
              <label
                htmlFor="calc-width-input"
                className="block text-xs font-semibold text-[#6E6A63] mb-2"
              >
                Width ({unit.toUpperCase()})
              </label>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => adjustDimension('width', -1)}
                  aria-label="Decrease Width"
                  className="w-11 h-11 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center text-[#1E1E1C] active:scale-95 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="calc-width-input"
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={width}
                  onChange={(e) =>
                    setWidth(Math.max(0.5, Number(e.target.value) || 0))
                  }
                  className="w-full text-center text-lg font-bold text-[#1E1E1C] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustDimension('width', 1)}
                  aria-label="Increase Width"
                  className="w-11 h-11 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center text-[#1E1E1C] active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Height / Length Box */}
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3]">
              <label
                htmlFor="calc-height-input"
                className="block text-xs font-semibold text-[#6E6A63] mb-2"
              >
                Height / Length ({unit.toUpperCase()})
              </label>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => adjustDimension('height', -1)}
                  aria-label="Decrease Height"
                  className="w-11 h-11 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center text-[#1E1E1C] active:scale-95 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  id="calc-height-input"
                  type="number"
                  min={0.5}
                  step={0.5}
                  value={height}
                  onChange={(e) =>
                    setHeight(Math.max(0.5, Number(e.target.value) || 0))
                  }
                  className="w-full text-center text-lg font-bold text-[#1E1E1C] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => adjustDimension('height', 1)}
                  aria-label="Increase Height"
                  className="w-11 h-11 rounded-xl bg-white border border-[#E5DFD3] flex items-center justify-center text-[#1E1E1C] active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Roll / Cutting Wastage Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-xs text-[#6E6A63]">
              Roll / Sheet Cutting Allowance:
            </span>
            <div className="flex items-center gap-1.5">
              {([0, 5, 10] as WastagePercentage[]).map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setWastagePercent(pct)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                    wastagePercent === pct
                      ? 'bg-[#1E1E1C] text-white border-[#1E1E1C]'
                      : 'bg-[#FAF8F5] text-[#1E1E1C] border-[#E5DFD3]'
                  }`}
                >
                  {pct === 0 ? 'Exact (0%)' : `+${pct}% Wastage`}
                </button>
              ))}
            </div>
          </div>

          {/* Live Calculated Price Summary Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F0ECE1] border border-[#E5DFD3] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6A63]">
              <span>Calculated Area: {calcResult.formattedSummary}</span>
              <span>
                Quality Rate: ₹{calcResult.ratePerSqFt}/Sq.Ft.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#E5DFD3]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9C5A3C]">
                  Estimated Material Price
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#1E1E1C]">
                  {formatCurrencyINR(calcResult.estimatedTotal)}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  triggerGlobalInquiryModal({
                    queryType: 'CUSTOM_SIZE_QUOTE',
                    productId: product.id,
                    productTitle: `${product.title} (${
                      buildCombinedNotes() || 'Standard Design'
                    })`,
                    dimensionsSummary: calcResult.formattedSummary,
                    qualityName: `${selectedQuality.quality_name} (${selectedQuality.quality_tier})`,
                    estimatedPrice: calcResult.estimatedTotal,
                  })
                }
                className="px-5 py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition"
              >
                Lock Estimate & Request Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 CONTENT: BOOK HOME MEASUREMENT VISIT */}
      {activeTab === 'HOME_VISIT' && (
        <div className="p-5 rounded-2xl bg-[#F0ECE1]/80 border border-[#E5DFD3] space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#1E1E1C] text-white shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E1E1C]">
                Call Technician to My House for Exact Measurement 🏡
              </h4>
              <p className="text-xs text-[#6E6A63] mt-1 leading-relaxed">
                Not sure how many rolls, panels, or square feet your room needs? Our measurement specialist will visit your house, laser-measure your walls/floors, and show you physical sample books for{' '}
                <strong>{selectedQuality.quality_name}</strong>.
              </p>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-[#1E1E1C]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F7A4C]" />
              <span>Exact wall/floor mapping with zero customer measurement risk</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#1F7A4C]" />
              <span>Touch & compare Standard, Premium, and Luxury material samples at home</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={() =>
              triggerGlobalInquiryModal({
                queryType: 'HOME_MEASUREMENT',
                productId: product.id,
                productTitle: product.title,
                dimensionsSummary: 'Customer requested technician Home Measurement Visit',
                qualityName: `${selectedQuality.quality_name} (${selectedQuality.quality_tier})`,
              })
            }
            className="w-full py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition"
          >
            🏡 Schedule Home Measurement Visit Now
          </button>
        </div>
      )}

      {/* TAB 3 CONTENT: VISIT SHOP OR REQUEST CALLBACK */}
      {activeTab === 'SHOP_OR_CALL' && (
        <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#1F7A4C] text-white shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1E1E1C]">
                Visit Our Showroom or Get an Instant Callback 🤙
              </h4>
              <p className="text-xs text-[#6E6A63] mt-1">
                <strong>Shop Address:</strong> {settings.shop_address}
              </p>
              <p className="text-xs text-[#6E6A63] mt-0.5">
                <strong>Hours:</strong> {settings.business_hours}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() =>
                triggerGlobalInquiryModal({
                  queryType: 'CALLBACK_REQUEST',
                  productId: product.id,
                  productTitle: product.title,
                  qualityName: selectedQuality.quality_name,
                })
              }
              className="py-3 px-4 rounded-xl bg-[#1F7A4C] hover:bg-[#17613B] text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Callback 🤙</span>
            </button>

            <button
              type="button"
              onClick={() =>
                triggerGlobalInquiryModal({
                  queryType: 'SHOP_VISIT',
                  productId: product.id,
                  productTitle: product.title,
                  qualityName: selectedQuality.quality_name,
                })
              }
              className="py-3 px-4 rounded-xl border border-[#1E1E1C] text-[#1E1E1C] hover:bg-[#1E1E1C] hover:text-white text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <Store className="w-4 h-4" />
              <span>Book Shop Visit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
