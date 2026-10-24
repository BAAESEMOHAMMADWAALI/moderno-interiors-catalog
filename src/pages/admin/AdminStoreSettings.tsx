/**
 * ADMIN STORE CONTACT & GLOBAL ANNOUNCEMENT SETTINGS (`/admin/settings`)
 * Phase 4 Locked File — Lets the shop owner update shop name, phone number,
 * WhatsApp number, physical showroom address, Google Maps link, business hours,
 * and top announcement banner live without touching code.
 */
import React, { useEffect, useState } from 'react';
import { CheckCircle2, MapPin, Phone, Save, Store } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const AdminStoreSettings: React.FC = () => {
  const { settings, saveSettings } = useStoreSettings();

  const [shopName, setShopName] = useState<string>(settings.shop_name);
  const [tagline, setTagline] = useState<string>(settings.tagline);
  const [primaryPhone, setPrimaryPhone] = useState<string>(
    settings.primary_phone
  );
  const [whatsappNumber, setWhatsappNumber] = useState<string>(
    settings.whatsapp_number
  );
  const [emailAddress, setEmailAddress] = useState<string>(
    settings.email_address
  );
  const [shopAddress, setShopAddress] = useState<string>(settings.shop_address);
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>(
    settings.google_maps_url
  );
  const [businessHours, setBusinessHours] = useState<string>(
    settings.business_hours
  );
  const [announcementText, setAnnouncementText] = useState<string>(
    settings.announcement_text
  );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setShopName(settings.shop_name);
    setTagline(settings.tagline);
    setPrimaryPhone(settings.primary_phone);
    setWhatsappNumber(settings.whatsapp_number);
    setEmailAddress(settings.email_address);
    setShopAddress(settings.shop_address);
    setGoogleMapsUrl(settings.google_maps_url);
    setBusinessHours(settings.business_hours);
    setAnnouncementText(settings.announcement_text);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    await saveSettings({
      shop_name: shopName.trim(),
      tagline: tagline.trim(),
      primary_phone: primaryPhone.trim(),
      whatsapp_number: whatsappNumber.trim(),
      email_address: emailAddress.trim(),
      shop_address: shopAddress.trim(),
      google_maps_url: googleMapsUrl.trim(),
      business_hours: businessHours.trim(),
      announcement_text: announcementText.trim(),
    });

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#E5DFD3] p-5">
        <h2 className="text-xl font-bold text-[#1E1E1C]">
          Store Contact Details, WhatsApp & Showroom Information
        </h2>
        <p className="text-xs text-[#6E6A63] mt-0.5">
          Every change saved here updates the Navbar, Footer, Mobile Sticky Bar, and WhatsApp lead routing across the entire website immediately.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-[#1F7A4C] text-white text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            Store settings updated! Header, Footer, and WhatsApp buttons now reflect your new details.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-[#E5DFD3] p-6 space-y-6"
      >
        {/* Brand Identity */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C] flex items-center gap-1.5">
            <Store className="w-4 h-4" />
            <span>1. Shop Brand & Announcement Banner</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Shop Subtitle / Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
              Top Bar Announcement Banner Text
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
            />
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="space-y-4 pt-4 border-t border-[#E5DFD3]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C] flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>2. Phone, WhatsApp & Email Routing</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Primary Display Phone Number *
              </label>
              <input
                type="text"
                required
                value={primaryPhone}
                onChange={(e) => setPrimaryPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                WhatsApp Number (With Country Code) *
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919876543210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Shop Email Address
              </label>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>
          </div>
        </div>

        {/* Showroom Location & Hours */}
        <div className="space-y-4 pt-4 border-t border-[#E5DFD3]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C] flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>3. Physical Showroom Address, Map Pin & Working Hours</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
              Full Physical Shop Address *
            </label>
            <textarea
              rows={2}
              required
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Google Maps Location Link
              </label>
              <input
                type="url"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                Showroom Business Hours
              </label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                placeholder="Mon – Sat: 10:00 AM – 8:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C]"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-bold uppercase tracking-wider transition shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Store Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
