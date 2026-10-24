/**
 * GLOBAL FOOTER COMPONENT
 * Displays all 16 product category links, store contact details from StoreSettingsContext,
 * measurement policy highlights, and links to Legal Terms & Admin Portal.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Phone, Ruler, ShieldCheck } from 'lucide-react';
import { CANONICAL_CATEGORIES, NAV_GROUPS } from '../../config/categoriesSeed';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const Footer: React.FC = () => {
  const { settings } = useStoreSettings();

  return (
    <footer className="bg-[#1E1E1C] text-[#FAF8F5] border-t border-[#E5DFD3]/20 mt-16">
      {/* Top Value Proposition Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#9C5A3C]/20 text-[#F0ECE1] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Machine-Made Ready Rugs (Predefined Sizes)
              </h4>
              <p className="text-xs text-[#F0ECE1]/75 mt-1 leading-relaxed">
                Precision machine-made area rugs in standard house dimensions with instant fixed pricing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#9C5A3C]/20 text-[#F0ECE1] shrink-0">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Custom Wall, Floor & Window Sizing
              </h4>
              <p className="text-xs text-[#F0ECE1]/75 mt-1 leading-relaxed">
                Enter your own Width × Height online for an instant quality-tier estimate or book a technician visit.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1F7A4C]/30 text-[#F0ECE1] shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">
                Home Measurement Visit (🏡) & Shop Consultation
              </h4>
              <p className="text-xs text-[#F0ECE1]/75 mt-1 leading-relaxed">
                Our team visits your house with physical wallpaper, PVC, flooring & curtain sample books.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
        {/* Store Info Column (2 cols wide on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">
              {settings.shop_name}
            </h3>
            <p className="text-xs text-[#F0ECE1]/70 mt-1">{settings.tagline}</p>
          </div>

          <div className="space-y-2.5 text-xs text-[#F0ECE1]/85">
            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#9C5A3C] shrink-0 mt-0.5" />
              <span>{settings.shop_address}</span>
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#9C5A3C] shrink-0" />
              <a
                href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`}
                className="hover:underline font-medium"
              >
                {settings.primary_phone}
              </a>
            </p>
            <p className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#9C5A3C] shrink-0 mt-0.5" />
              <span>{settings.business_hours}</span>
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                triggerGlobalInquiryModal({ queryType: 'HOME_MEASUREMENT' })
              }
              className="px-3.5 py-2 rounded-xl bg-[#9C5A3C] hover:bg-[#84492F] text-white text-xs font-semibold transition"
            >
              🏡 Book Home Measurement
            </button>
            {settings.google_maps_url && (
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition"
              >
                Open Shop in Google Maps ↗
              </a>
            )}
          </div>
        </div>

        {/* 4 Category Pillar Columns */}
        {NAV_GROUPS.map((group) => {
          const groupCats = CANONICAL_CATEGORIES.filter(
            (c) => c.nav_group === group.key && c.is_active
          );
          return (
            <div key={group.key} className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
                {group.label}
              </h4>
              <ul className="space-y-2 text-xs text-[#F0ECE1]/80">
                {groupCats.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/category/${cat.slug}`}
                      className="hover:text-white transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F0ECE1]/60">
          <p>
            © {new Date().getFullYear()} {settings.shop_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/legal" className="hover:text-white transition">
              Terms of Service & Measurement Disclaimer
            </Link>
            <Link to="/admin" className="hover:text-white transition">
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
