/**
 * OFFICIAL TERMS OF SERVICE, CUSTOM MEASUREMENT POLICY & PRIVACY PAGE (`/legal`)
 * Phase 5 Locked File — Protects the shop owner regarding online Sq.Ft. price
 * estimates, customer self-measured dimensions vs. official technician Home
 * Measurement Visits (🏡), Machine-Made Rug specifications, custom-cut material
 * non-cancellation rules, and customer data privacy.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Home,
  Lock,
  Ruler,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const LegalTermsPage: React.FC = () => {
  const { settings } = useStoreSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1E1C] hover:text-[#9C5A3C] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Storefront</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F0ECE1] text-[#9C5A3C]">
          <Scale className="w-3.5 h-3.5" />
          Official Store Policies
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-[#E5DFD3] p-6 sm:p-8 space-y-3">
        <h1 className="text-2xl sm:text-4xl font-bold text-[#1E1E1C]">
          Terms of Service, Custom Measurement Disclaimer & Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
          Applicable to all catalogue browsing, online dimension calculations, Home Measurement Visits (🏡), Showroom consultations, and orders placed with{' '}
          <strong className="text-[#1E1E1C]">{settings.shop_name}</strong>.
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-6">
        {/* Section 1: Online Price Estimates */}
        <section className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#F0ECE1] text-[#9C5A3C]">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E1C]">
              1. Scope of Catalogue & Indicative Online Price Estimates
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            All prices calculated on this website for custom-measured products—including Wallpaper, Self-Adhesive Wallpaper, UV Marble Sheets, PVC Panelling, PVC Ceiling (Shelling), Wooden Flooring, Vinyl Flooring, Artificial Grass, Vertical Grass, Wall-to-Wall Carpets, PVC Carpets, Mats, Curtains, Blinds, and Custom-Made Furniture—are indicative material estimates based on the dimensions and material quality tier selected by the customer.
          </p>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Final payable billing is confirmed upon verification of actual site dimensions, wall/floor surface preparation needs, standard roll/sheet cutting wastage allowance, and installation hardware requirements.
          </p>
        </section>

        {/* Section 2: Self-Measurement vs Technician Visit */}
        <section className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#F0ECE1] text-[#9C5A3C]">
              <Ruler className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E1C]">
              2. Customer-Supplied Dimensions vs. Official Home Measurement Visit (🏡)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Customers may either enter their own wall/floor/window dimensions online or book an Official Home Measurement Visit. Where a customer instructs{' '}
            <strong>{settings.shop_name}</strong> to cut or fabricate materials based solely on customer-supplied measurements without opting for a technician site visit, the shop shall not be responsible for dimensional shortages, joint misalignments, or excess material resulting from inaccurate customer measurement.
          </p>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-[#1E1E1C]">
                Want 100% Measurement Accuracy?
              </span>
              <p className="text-xs text-[#6E6A63]">
                Book our technician to visit your house with physical sample books and laser measurement tools.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                triggerGlobalInquiryModal({ queryType: 'HOME_MEASUREMENT' })
              }
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold shrink-0 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Book Home Visit 🏡</span>
            </button>
          </div>
        </section>

        {/* Section 3: Machine-Made Rugs Policy */}
        <section className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#1E1E1C] text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E1C]">
              3. Machine-Made Ready Rugs Specification & Predefined Sizing Policy
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            All area rugs listed under our <strong>Rugs & Carpets (Ready Sizes)</strong> category are strictly{' '}
            <strong className="text-[#1E1E1C]">machine-made rugs</strong> offered in predefined standard dimensions (such as 4×6 ft, 5×8 ft, 6×9 ft, 8×10 ft, and 9×12 ft). They are neither marketed nor sold as handmade or hand-knotted Kashmiri carpets.
          </p>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Predefined machine-made rugs are sold at the fixed price listed for each size and are not eligible for custom per-square-foot cutting. Industry-standard loom dimension tolerances of ±2% to ±3% and slight shade variations due to screen lighting may occur.
          </p>
        </section>

        {/* Section 4: Custom-Cut & Bespoke Orders */}
        <section className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#F0ECE1] text-[#1F7A4C]">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E1C]">
              4. Custom-Cut Materials, Advance Booking & Cancellation Terms
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Orders involving materials cut to custom customer dimensions (wallpapers, PVC sheets/panels, wooden/vinyl flooring, artificial grass, wall-to-wall carpets, mats, custom-stitched curtains, window blinds) or custom-made furniture require an advance booking deposit upon quotation approval.
          </p>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Once rolls, sheets, panels, fabrics, or timber have been custom-cut, printed, or fabricated to your room specifications, the order cannot be cancelled, returned, or refunded except in the case of verified manufacturing defects.
          </p>
        </section>

        {/* Section 5: Customer Data & Privacy */}
        <section className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#F0ECE1] text-[#9C5A3C]">
              <Lock className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#1E1E1C]">
              5. Customer Privacy & Inquiry Data Protection
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
            Personal contact details (Name, Phone/WhatsApp Number, House Address, and Room Reference Images) submitted through our{' '}
            <strong>Book Home Measurement</strong>, <strong>Request Callback</strong>, or <strong>Custom Quote</strong> forms are used exclusively by{' '}
            <strong>{settings.shop_name}</strong> to schedule technician visits, prepare quotations, and fulfill orders. We never sell, rent, or trade customer phone numbers or addresses to third-party telemarketers.
          </p>
        </section>
      </div>

      {/* Bottom Store Contact Card */}
      <div className="bg-[#F0ECE1] rounded-3xl p-6 border border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1E1E1C]">
            Questions About Measurements, Material Grades, or Store Policies?
          </h3>
          <p className="text-[#6E6A63]">
            {settings.shop_address} • {settings.business_hours}
          </p>
        </div>
        <a
          href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`}
          className="px-5 py-3 rounded-xl bg-[#1E1E1C] text-white font-bold text-center shrink-0"
        >
          Call Shop: {settings.primary_phone}
        </a>
      </div>
    </div>
  );
};
