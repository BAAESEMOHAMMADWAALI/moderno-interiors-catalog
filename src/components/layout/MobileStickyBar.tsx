/**
 * MOBILE STICKY BOTTOM ACTION BAR (< 768px)
 * Gives mobile shoppers one-tap access to 'Book Home Visit 🏡', 'Request Call 🤙',
 * and direct WhatsApp chat from any scroll position.
 */
import React from 'react';
import { Home, MessageCircle, PhoneCall } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const MobileStickyBar: React.FC = () => {
  const { settings } = useStoreSettings();

  const cleanWhatsApp = settings.whatsapp_number.replace(/[^0-9]/g, '');
  const whatsappHref = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
    `Hello ${settings.shop_name}, I would like to inquire about product prices / home measurement.`
  )}`;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E5DFD3] px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        <button
          type="button"
          onClick={() =>
            triggerGlobalInquiryModal({ queryType: 'HOME_MEASUREMENT' })
          }
          className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1E1E1C] text-white text-[11px] font-semibold active:scale-[0.98] transition"
        >
          <Home className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Home Visit 🏡</span>
        </button>

        <button
          type="button"
          onClick={() =>
            triggerGlobalInquiryModal({ queryType: 'CALLBACK_REQUEST' })
          }
          className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#9C5A3C] text-white text-[11px] font-semibold active:scale-[0.98] transition"
        >
          <PhoneCall className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Call Me 🤙</span>
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#1F7A4C] text-white text-[11px] font-semibold active:scale-[0.98] transition"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
