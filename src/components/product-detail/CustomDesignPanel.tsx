/**
 * MODE B ONLY: BESPOKE CUSTOMIZATION & DESIGN REQUEST PANEL
 * Phase 2 Locked File — Allows customers ordering custom-measured products
 * (Wallpaper murals, PVC combinations, Curtains, Custom Furniture) to specify
 * bespoke pattern/color demands and attach a reference design link/photo note.
 */
import React from 'react';
import { ImagePlus, Palette } from 'lucide-react';

interface CustomDesignPanelProps {
  categoryName: string;
  customDesignNotes: string;
  onChangeNotes: (notes: string) => void;
  referenceImageUrl: string;
  onChangeReferenceUrl: (url: string) => void;
}

export const CustomDesignPanel: React.FC<CustomDesignPanelProps> = ({
  categoryName,
  customDesignNotes,
  onChangeNotes,
  referenceImageUrl,
  onChangeReferenceUrl,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5DFD3] p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-[#F0ECE1] text-[#9C5A3C] shrink-0">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#1E1E1C]">
            Custom Design & Bespoke Pattern Options ({categoryName})
          </h3>
          <p className="text-xs text-[#6E6A63] mt-0.5">
            Want a specific color shade, custom wallpaper mural print, curtain pleat style, or custom furniture modification? Describe your requirement below.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label
            htmlFor="custom-design-notes"
            className="block text-xs font-semibold text-[#1E1E1C] mb-1"
          >
            Your Custom Design / Color / Pattern Instructions (Optional)
          </label>
          <textarea
            id="custom-design-notes"
            rows={3}
            value={customDesignNotes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Example: Need warmer beige tone to match oak bed, or need blackout lining with golden eyelet rings..."
            className="w-full rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1E1E1C] placeholder:text-[#6E6A63]/70 focus:outline-none focus:border-[#1E1E1C]"
          />
        </div>

        <div>
          <label
            htmlFor="custom-ref-url"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#1E1E1C] mb-1"
          >
            <ImagePlus className="w-3.5 h-3.5 text-[#9C5A3C]" />
            <span>Reference Image Link / Pinterest / Room Photo URL (Optional)</span>
          </label>
          <input
            id="custom-ref-url"
            type="url"
            value={referenceImageUrl}
            onChange={(e) => onChangeReferenceUrl(e.target.value)}
            placeholder="https://... (Or upload directly when submitting quote in next step)"
            className="w-full rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1E1E1C] placeholder:text-[#6E6A63]/70 focus:outline-none focus:border-[#1E1E1C]"
          />
        </div>
      </div>
    </div>
  );
};
