/**
 * SUB-CLASS FILTER SIDEBAR & MOBILE DRAWER
 * Phase 2 Locked File — Provides instant filtering by Price Range, Material Quality Tier
 * (or Predefined Rug Size for Mode A), Design Style, and Room Suitability.
 */
import React from 'react';
import { RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { PricingMode, QualityTier } from '../../types/database.types';
import {
  AvailableFilterOptions,
  CatalogFilterState,
} from '../../services/catalogService';
import { formatCurrencyINR } from '../../utils/pricingEngine';

interface FilterSidebarProps {
  pricingMode: PricingMode;
  materialFilterLabel: string;
  options: AvailableFilterOptions;
  filters: CatalogFilterState;
  onChangeFilters: (next: CatalogFilterState) => void;
  onResetFilters: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  pricingMode,
  materialFilterLabel,
  options,
  filters,
  onChangeFilters,
  onResetFilters,
  mobileOpen,
  onCloseMobile,
}) => {
  const toggleArrayItem = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#9C5A3C]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E1E1C]">
            Sub-Class Filters
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#9C5A3C] hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Price Filter Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="price-range-slider"
            className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]"
          >
            {pricingMode === 'FIXED_RUG'
              ? 'Max Ready Rug Price'
              : 'Max Rate / Sq. Ft.'}
          </label>
          <span className="text-xs font-bold text-[#9C5A3C]">
            Up to {formatCurrencyINR(filters.maxPrice)}
          </span>
        </div>
        <input
          id="price-range-slider"
          type="range"
          min={options.minPriceBoundary}
          max={options.maxPriceBoundary}
          step={pricingMode === 'FIXED_RUG' ? 500 : 10}
          value={filters.maxPrice}
          onChange={(e) =>
            onChangeFilters({
              ...filters,
              maxPrice: Number(e.target.value),
            })
          }
          className="w-full accent-[#1E1E1C] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#6E6A63]">
          <span>{formatCurrencyINR(options.minPriceBoundary)}</span>
          <span>{formatCurrencyINR(options.maxPriceBoundary)}</span>
        </div>
      </div>

      {/* 2. Mode-Specific Filter: Predefined Size (Mode A) OR Material Quality Tier (Mode B) */}
      {pricingMode === 'FIXED_RUG' ? (
        <div className="space-y-2.5 pt-4 border-t border-[#E5DFD3]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            Predefined Rug Size
          </h4>
          <div className="flex flex-wrap gap-2">
            {options.rugSizeLabels.map((sizeLabel) => {
              const active = filters.selectedRugSizes.includes(sizeLabel);
              return (
                <button
                  key={sizeLabel}
                  type="button"
                  onClick={() =>
                    onChangeFilters({
                      ...filters,
                      selectedRugSizes: toggleArrayItem(
                        filters.selectedRugSizes,
                        sizeLabel
                      ),
                    })
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    active
                      ? 'bg-[#1E1E1C] text-white border-[#1E1E1C]'
                      : 'bg-[#FAF8F5] text-[#1E1E1C] border-[#E5DFD3] hover:border-[#9C5A3C]'
                  }`}
                >
                  {sizeLabel}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 pt-4 border-t border-[#E5DFD3]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            {materialFilterLabel || 'Material Quality Tier'}
          </h4>
          <div className="space-y-2">
            {options.qualityTiers.map((tier: QualityTier) => {
              const checked = filters.selectedQualityTiers.includes(tier);
              return (
                <label
                  key={tier}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] cursor-pointer hover:border-[#9C5A3C] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onChangeFilters({
                          ...filters,
                          selectedQualityTiers: toggleArrayItem(
                            filters.selectedQualityTiers,
                            tier
                          ),
                        })
                      }
                      className="rounded accent-[#1E1E1C] w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-[#1E1E1C]">
                      {tier} Grade
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white text-[#6E6A63] border border-[#E5DFD3]">
                    {tier === 'Standard'
                      ? 'Economy'
                      : tier === 'Premium'
                      ? 'Best Seller'
                      : 'Heavy Duty'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Design / Pattern Filter */}
      {options.designStyles.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-[#E5DFD3]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            Design & Pattern Style
          </h4>
          <div className="space-y-1.5">
            {options.designStyles.map((style) => {
              const checked = filters.selectedDesignStyles.includes(style);
              return (
                <label
                  key={style}
                  className="flex items-center gap-2.5 text-xs text-[#1E1E1C] cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChangeFilters({
                        ...filters,
                        selectedDesignStyles: toggleArrayItem(
                          filters.selectedDesignStyles,
                          style
                        ),
                      })
                    }
                    className="rounded accent-[#1E1E1C] w-4 h-4"
                  />
                  <span>{style}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Room Type Filter */}
      {options.roomTypes.length > 0 && (
        <div className="space-y-2.5 pt-4 border-t border-[#E5DFD3]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1E1C]">
            Room Suitability
          </h4>
          <div className="space-y-1.5">
            {options.roomTypes.map((room) => {
              const checked = filters.selectedRoomTypes.includes(room);
              return (
                <label
                  key={room}
                  className="flex items-center gap-2.5 text-xs text-[#1E1E1C] cursor-pointer py-1"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      onChangeFilters({
                        ...filters,
                        selectedRoomTypes: toggleArrayItem(
                          filters.selectedRoomTypes,
                          room
                        ),
                      })
                    }
                    className="rounded accent-[#1E1E1C] w-4 h-4"
                  />
                  <span>{room}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 bg-white rounded-2xl border border-[#E5DFD3] p-5">
          {filterContent}
        </div>
      </aside>

      {/* Mobile Slide-Up Filter Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-5 space-y-5 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5DFD3]">
              <span className="text-base font-bold text-[#1E1E1C]">
                Filter Products
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 rounded-full bg-[#FAF8F5] text-[#1E1E1C]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {filterContent}

            <div className="pt-3 sticky bottom-0 bg-white border-t border-[#E5DFD3]">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3.5 rounded-xl bg-[#1E1E1C] text-white text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
