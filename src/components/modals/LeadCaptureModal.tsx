/**
 * UNIFIED LEAD CAPTURE MODAL (HOME VISIT 🏡, CALLBACK 🤙, SHOP VISIT & QUOTES)
 * Phase 3 Locked File — Mobile-first bottom-sheet / desktop modal that captures
 * customer inquiries, attaches calculated dimensions & material quality tiers,
 * supports optional room/design photo upload, saves to `customer_queries`, and
 * provides instant WhatsApp + Email dispatch.
 */
import React, { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Home,
  ImagePlus,
  Loader2,
  MapPin,
  MessageCircle,
  PhoneCall,
  Ruler,
  Store,
  User,
  X,
} from 'lucide-react';
import { useInquiryModal } from '../../context/InquiryModalContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import {
  CustomerQueryPayload,
  QueryType,
} from '../../types/database.types';
import { formatCurrencyINR } from '../../utils/pricingEngine';
import {
  buildWhatsAppInquiryUrl,
  getQueryTypeMeta,
  sendWeb3FormsNotification,
} from '../../utils/whatsappHelper';
import {
  submitCustomerQuery,
  uploadCustomerReferenceImage,
} from '../../services/queryService';

const QUICK_MODE_TABS: { type: QueryType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'HOME_MEASUREMENT',
    label: 'Home Visit 🏡',
    icon: <Home className="w-3.5 h-3.5" />,
  },
  {
    type: 'CALLBACK_REQUEST',
    label: 'Call Me 🤙',
    icon: <PhoneCall className="w-3.5 h-3.5" />,
  },
  {
    type: 'SHOP_VISIT',
    label: 'Visit Shop 🏪',
    icon: <Store className="w-3.5 h-3.5" />,
  },
];

export const LeadCaptureModal: React.FC = () => {
  const { isOpen, activeDetail, closeInquiryModal } = useInquiryModal();
  const { settings } = useStoreSettings();

  const [queryType, setQueryType] = useState<QueryType>('HOME_MEASUREMENT');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('Tomorrow Morning (10 AM – 1 PM)');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [referenceImageUrl, setReferenceImageUrl] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] =
    useState<CustomerQueryPayload | null>(null);

  useEffect(() => {
    if (isOpen && activeDetail) {
      setQueryType(activeDetail.queryType || 'HOME_MEASUREMENT');
      setFormError(null);
      setSubmittedPayload(null);
    }
  }, [isOpen, activeDetail]);

  if (!isOpen) {
    return null;
  }

  const meta = getQueryTypeMeta(queryType);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setFormError(null);
    const { url, error } = await uploadCustomerReferenceImage(file);
    setIsUploadingImage(false);

    if (error) {
      setFormError(error);
    } else {
      setReferenceImageUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (customerName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }

    const digitsOnly = customerPhone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (meta.requiresAddress && customerAddress.trim().length < 5) {
      setFormError(
        'Please enter your house address or area landmark so our team can assist you.'
      );
      return;
    }

    const payload: CustomerQueryPayload = {
      query_type: queryType,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_address: customerAddress.trim(),
      preferred_visit_date: meta.requiresDate ? preferredDate.trim() : '',
      product_id: activeDetail?.productId || null,
      product_title_snapshot:
        activeDetail?.productTitle || 'General Storefront Inquiry',
      selected_size_or_dimensions: activeDetail?.dimensionsSummary || '',
      selected_quality_name: activeDetail?.qualityName || '',
      estimated_price:
        typeof activeDetail?.estimatedPrice === 'number'
          ? activeDetail.estimatedPrice
          : null,
      custom_design_notes: customNotes.trim(),
      reference_image_url: referenceImageUrl,
    };

    setIsSubmitting(true);
    await submitCustomerQuery(payload);
    void sendWeb3FormsNotification(payload, settings.shop_name);
    setIsSubmitting(false);
    setSubmittedPayload(payload);
  };

  const resetAndClose = () => {
    setSubmittedPayload(null);
    setFormError(null);
    closeInquiryModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-[#E5DFD3] shadow-2xl max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        {/* Sticky Modal Top Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-[#E5DFD3] flex items-center justify-between">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0ECE1] text-[#9C5A3C]">
              {meta.badgeText}
            </span>
            <h2 className="text-lg font-bold text-[#1E1E1C] mt-0.5">
              {meta.label}
            </h2>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close modal"
            className="p-2 rounded-full bg-[#FAF8F5] hover:bg-[#F0ECE1] text-[#1E1E1C] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {submittedPayload ? (
            /* CONFIRMATION & INSTANT WHATSAPP SCREEN */
            <div className="py-4 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#1F7A4C]/15 text-[#1F7A4C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-[#1E1E1C]">
                  Request Logged Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-[#6E6A63] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{submittedPayload.customer_name}</strong>. Our team at{' '}
                  <strong>{settings.shop_name}</strong> has received your request and will contact you on{' '}
                  <strong>{submittedPayload.customer_phone}</strong>.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E5DFD3] text-left text-xs space-y-1.5">
                {submittedPayload.product_title_snapshot && (
                  <p>
                    <span className="text-[#6E6A63]">Product:</span>{' '}
                    <strong className="text-[#1E1E1C]">
                      {submittedPayload.product_title_snapshot}
                    </strong>
                  </p>
                )}
                {submittedPayload.selected_size_or_dimensions && (
                  <p>
                    <span className="text-[#6E6A63]">Dimensions / Size:</span>{' '}
                    <strong className="text-[#1E1E1C]">
                      {submittedPayload.selected_size_or_dimensions}
                    </strong>
                  </p>
                )}
                {submittedPayload.selected_quality_name && (
                  <p>
                    <span className="text-[#6E6A63]">Material Quality:</span>{' '}
                    <strong className="text-[#9C5A3C]">
                      {submittedPayload.selected_quality_name}
                    </strong>
                  </p>
                )}
                {typeof submittedPayload.estimated_price === 'number' &&
                  submittedPayload.estimated_price > 0 && (
                    <p>
                      <span className="text-[#6E6A63]">Estimated Price:</span>{' '}
                      <strong className="text-[#1F7A4C]">
                        {formatCurrencyINR(submittedPayload.estimated_price)}
                      </strong>
                    </p>
                  )}
              </div>

              {/* Instant WhatsApp Fast-Track Button */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={buildWhatsAppInquiryUrl(submittedPayload, settings)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 rounded-xl bg-[#1F7A4C] hover:bg-[#17613B] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also Send Details on WhatsApp Now ↗</span>
                </a>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full py-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F0ECE1] text-[#1E1E1C] text-xs font-semibold transition"
                >
                  Done & Return to Store
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE FORM */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mode Switcher Pills (When opened generically) */}
              {queryType !== 'CUSTOM_SIZE_QUOTE' &&
                queryType !== 'RUG_ORDER_INQUIRY' && (
                  <div className="grid grid-cols-3 gap-1.5 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E5DFD3]">
                    {QUICK_MODE_TABS.map((tab) => (
                      <button
                        key={tab.type}
                        type="button"
                        onClick={() => setQueryType(tab.type)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                          queryType === tab.type
                            ? 'bg-[#1E1E1C] text-white'
                            : 'text-[#6E6A63] hover:text-[#1E1E1C]'
                        }`}
                      >
                        {tab.icon}
                        <span className="truncate">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                )}

              <p className="text-xs text-[#6E6A63] leading-relaxed">
                {meta.subtitle}
              </p>

              {/* Pre-Filled Product & Dimension Context Banner */}
              {(activeDetail?.productTitle ||
                activeDetail?.dimensionsSummary ||
                activeDetail?.qualityName) && (
                <div className="p-3.5 rounded-2xl bg-[#F0ECE1]/80 border border-[#E5DFD3] space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#1E1E1C]">
                    <Ruler className="w-3.5 h-3.5 text-[#9C5A3C]" />
                    <span className="line-clamp-1">
                      {activeDetail.productTitle || 'Selected Configuration'}
                    </span>
                  </div>
                  {activeDetail.dimensionsSummary && (
                    <p className="text-[#6E6A63]">
                      Size: <strong className="text-[#1E1E1C]">{activeDetail.dimensionsSummary}</strong>
                    </p>
                  )}
                  {activeDetail.qualityName && (
                    <p className="text-[#6E6A63]">
                      Material Grade: <strong className="text-[#9C5A3C]">{activeDetail.qualityName}</strong>
                    </p>
                  )}
                  {typeof activeDetail.estimatedPrice === 'number' &&
                    activeDetail.estimatedPrice > 0 && (
                      <p className="text-[#1E1E1C] font-bold pt-0.5">
                        Estimated Price: {formatCurrencyINR(activeDetail.estimatedPrice)}
                      </p>
                    )}
                </div>
              )}

              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {formError}
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label
                    htmlFor="lead-name"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#6E6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="lead-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g., Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lead-phone"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-[#6E6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
                    />
                  </div>
                </div>
              </div>

              {/* House Address (Shown when required or helpful) */}
              {(meta.requiresAddress || queryType === 'SHOP_VISIT') && (
                <div>
                  <label
                    htmlFor="lead-address"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    {meta.requiresAddress
                      ? 'House Address & Landmark (For Measurement / Delivery) *'
                      : 'Your Area / City (Optional)'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#6E6A63] absolute left-3 top-3" />
                    <textarea
                      id="lead-address"
                      rows={2}
                      required={meta.requiresAddress}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="House/Flat No., Society, Road & Landmark..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
                    />
                  </div>
                </div>
              )}

              {/* Preferred Date/Time Slot */}
              {meta.requiresDate && (
                <div>
                  <label
                    htmlFor="lead-date"
                    className="block text-xs font-bold text-[#1E1E1C] mb-1"
                  >
                    Preferred Visit Day & Time Slot
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#6E6A63] absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      id="lead-date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
                    >
                      <option value="Today Evening (4 PM – 8 PM)">
                        Today Evening (4 PM – 8 PM)
                      </option>
                      <option value="Tomorrow Morning (10 AM – 1 PM)">
                        Tomorrow Morning (10 AM – 1 PM)
                      </option>
                      <option value="Tomorrow Afternoon (2 PM – 6 PM)">
                        Tomorrow Afternoon (2 PM – 6 PM)
                      </option>
                      <option value="This Weekend (Saturday / Sunday)">
                        This Weekend (Saturday / Sunday)
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Optional Reference Photo Upload (Strictly Mode B / Home Visit Only) */}
              {meta.allowReferenceUpload && (
                <div>
                  <label className="block text-xs font-bold text-[#1E1E1C] mb-1">
                    Upload Room Photo or Design Reference (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-[#9C5A3C] bg-[#FAF8F5] hover:bg-[#F0ECE1]/60 text-xs font-semibold text-[#1E1E1C] transition">
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-[#9C5A3C]" />
                          <span>Processing Image...</span>
                        </>
                      ) : (
                        <>
                          <ImagePlus className="w-4 h-4 text-[#9C5A3C]" />
                          <span>
                            {referenceImageUrl
                              ? 'Change Reference Image'
                              : 'Choose Photo (.jpg, .png, .webp)'}
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    {referenceImageUrl && (
                      <img
                        src={referenceImageUrl}
                        alt="Reference preview"
                        className="w-11 h-11 rounded-xl object-cover border border-[#E5DFD3]"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Additional Notes / Sample Book Preferences */}
              <div>
                <label
                  htmlFor="lead-notes"
                  className="block text-xs font-bold text-[#1E1E1C] mb-1"
                >
                  Sample Books or Specific Requirements (Optional)
                </label>
                <input
                  id="lead-notes"
                  type="text"
                  value={customNotes}
                  onChange={(e) => setCustomNotes(e.target.value)}
                  placeholder="e.g., Bring Wallpaper, UV Marble Sheet & Curtain sample catalogues..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] text-xs text-[#1E1E1C] focus:outline-none focus:border-[#1E1E1C]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="w-full py-3.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Your Request...</span>
                  </>
                ) : (
                  <span>Confirm & Submit Request</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
