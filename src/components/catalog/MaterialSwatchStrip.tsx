/**
 * TACTILE MATERIAL SWATCH STRIP (INSPIRED BY OPTION 1 "lano")
 * Phase 2 Locked File — Lets customers inspect paper GSM, PVC panel thickness,
 * UV marble sheet gloss, wooden flooring grain, and turf density, or request
 * physical sample books at home.
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Home, Sparkles } from 'lucide-react';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

interface SwatchItem {
  id: string;
  name: string;
  categorySlug: string;
  gradeLabel: string;
  rateLabel: string;
  specs: string;
  textureGradient: string;
  imageUrl: string;
}

const MATERIAL_SWATCHES: SwatchItem[] = [
  {
    id: 'sw-1',
    name: '300 GSM Heavy Embossed Vinyl Wallpaper',
    categorySlug: 'wallpaper',
    gradeLabel: 'Washable Linen Texture',
    rateLabel: 'From ₹45 / Sq.Ft.',
    specs: 'Sponge-washable, breathable backing, custom wall sizing.',
    textureGradient: 'from-[#D8CFC2] to-[#B7A996]',
    imageUrl:
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sw-2',
    name: '3.2mm High-Gloss UV Marble Sheet',
    categorySlug: 'uv-marble-sheets',
    gradeLabel: 'Bookmatched Italian Vein',
    rateLabel: 'From ₹85 / Sq.Ft.',
    specs: '100% waterproof, termite-proof, mirror UV curing coat.',
    textureGradient: 'from-[#EAE6DF] to-[#C5B9A5]',
    imageUrl:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sw-3',
    name: '12mm Smoked Walnut Fluted PVC Panel',
    categorySlug: 'pvc-panelling',
    gradeLabel: 'Interlocking Louvre Core',
    rateLabel: 'From ₹70 / Sq.Ft.',
    specs: 'Conceals damp walls immediately; zero paint or curing delay.',
    textureGradient: 'from-[#5D4037] to-[#3E2723]',
    imageUrl:
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sw-4',
    name: 'AC5 European Oak Click Wooden Flooring',
    categorySlug: 'wooden-flooring',
    gradeLabel: 'Wax-Sealed Beveled Edge',
    rateLabel: 'From ₹115 / Sq.Ft.',
    specs: 'High abrasion resistance with acoustic underlay included.',
    textureGradient: 'from-[#9C6B43] to-[#6E4726]',
    imageUrl:
      'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sw-5',
    name: '40mm Four-Tone Balcony Artificial Grass',
    categorySlug: 'artificial-grass',
    gradeLabel: 'UV-Stabilized Drainage Turf',
    rateLabel: 'From ₹48 / Sq.Ft.',
    specs: 'Child-safe soft C-yarn blades with rapid rainwater drainage.',
    textureGradient: 'from-[#3B5E3C] to-[#243D25]',
    imageUrl:
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=600&q=80',
  },
];

export const MaterialSwatchStrip: React.FC = () => {
  const [selectedSwatch, setSelectedSwatch] = useState<SwatchItem>(
    MATERIAL_SWATCHES[0]
  );

  return (
    <section className="py-12 bg-[#F0ECE1]/70 border-y border-[#E5DFD3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
              <Sparkles className="w-3.5 h-3.5" />
              Tactile Material Quality Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1E1C] mt-1">
              We Bring Physical Sample Books to Your Home — Free
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6A63] mt-1 max-w-2xl">
              Compare paper GSM, PVC panel thickness, UV sheet mirror gloss, and flooring grades in person before finalizing your order.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              triggerGlobalInquiryModal({
                queryType: 'HOME_MEASUREMENT',
                qualityName: selectedSwatch.name,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-semibold transition shrink-0"
          >
            <Home className="w-4 h-4" />
            <span>Request Sample Book Visit 🏡</span>
          </button>
        </div>

        {/* Horizontal Touch-Scroll Swatch Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {MATERIAL_SWATCHES.map((swatch) => {
            const isSelected = swatch.id === selectedSwatch.id;
            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setSelectedSwatch(swatch)}
                className={`text-left rounded-2xl p-3 transition-all border ${
                  isSelected
                    ? 'bg-white border-[#1E1E1C] shadow-md ring-1 ring-[#1E1E1C]'
                    : 'bg-white/70 border-[#E5DFD3] hover:bg-white'
                }`}
              >
                <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3 bg-gradient-to-br">
                  <img
                    src={swatch.imageUrl}
                    alt={swatch.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute top-2 right-2 p-1 rounded-full bg-[#1E1E1C] text-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-[#9C5A3C]">
                  {swatch.gradeLabel}
                </span>
                <h3 className="text-xs font-bold text-[#1E1E1C] mt-0.5 line-clamp-2">
                  {swatch.name}
                </h3>
                <p className="text-xs font-semibold text-[#1F7A4C] mt-1.5">
                  {swatch.rateLabel}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Swatch Inspector Bar */}
        <div className="mt-5 bg-white rounded-2xl border border-[#E5DFD3] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#F0ECE1] text-[#9C5A3C]">
                Selected Texture
              </span>
              <span className="text-sm font-bold text-[#1E1E1C]">
                {selectedSwatch.name}
              </span>
            </div>
            <p className="text-xs text-[#6E6A63] mt-1">{selectedSwatch.specs}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={`/category/${selectedSwatch.categorySlug}`}
              className="px-4 py-2.5 rounded-xl border border-[#1E1E1C] text-[#1E1E1C] hover:bg-[#1E1E1C] hover:text-white text-xs font-semibold transition"
            >
              Browse Category →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
