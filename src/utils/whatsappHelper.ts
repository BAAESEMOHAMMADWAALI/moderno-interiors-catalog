/**
 * WHATSAPP URL BUILDER & WEB3FORMS EMAIL NOTIFICATION HELPER
 * Phase 3 Locked File — Formats customer inquiries (Home Visit, Shop Visit,
 * Callback, Custom Sq.Ft. Quote, and Machine-Made Rug Order) into structured
 * WhatsApp messages and non-blocking Web3Forms email dispatches.
 */
import {
  CustomerQueryPayload,
  QueryType,
  StoreSettings,
} from '../types/database.types';
import { formatCurrencyINR } from './pricingEngine';

export interface QueryTypeMeta {
  type: QueryType;
  label: string;
  shortLabel: string;
  badgeText: string;
  subtitle: string;
  requiresAddress: boolean;
  requiresDate: boolean;
  allowReferenceUpload: boolean;
}

export const QUERY_TYPE_META_MAP: Record<QueryType, QueryTypeMeta> = {
  HOME_MEASUREMENT: {
    type: 'HOME_MEASUREMENT',
    label: 'Book Home Measurement Visit 🏡',
    shortLabel: 'Home Visit 🏡',
    badgeText: 'Technician Site Visit + Sample Books',
    subtitle:
      'Our specialist visits your house to take exact wall/floor measurements and show physical material sample books.',
    requiresAddress: true,
    requiresDate: true,
    allowReferenceUpload: true,
  },
  CALLBACK_REQUEST: {
    type: 'CALLBACK_REQUEST',
    label: 'Request an Instant Callback 🤙',
    shortLabel: 'Call Me 🤙',
    badgeText: 'Quick Phone Consultation',
    subtitle:
      'Enter your phone number and our shop specialist will call you shortly to discuss rates, quality grades, and availability.',
    requiresAddress: false,
    requiresDate: false,
    allowReferenceUpload: false,
  },
  SHOP_VISIT: {
    type: 'SHOP_VISIT',
    label: 'Schedule a Showroom Visit 🏪',
    shortLabel: 'Shop Visit',
    badgeText: 'In-Store Catalogue Inspection',
    subtitle:
      'Let us know when you are visiting our shop so we keep your selected rug sizes and material sample books ready.',
    requiresAddress: false,
    requiresDate: true,
    allowReferenceUpload: false,
  },
  CUSTOM_SIZE_QUOTE: {
    type: 'CUSTOM_SIZE_QUOTE',
    label: 'Lock Custom Size & Material Quote 📐',
    shortLabel: 'Custom Quote',
    badgeText: 'Custom Width × Height Estimate',
    subtitle:
      'Submit your self-measured dimensions and selected material quality tier for final billing confirmation.',
    requiresAddress: true,
    requiresDate: false,
    allowReferenceUpload: true,
  },
  RUG_ORDER_INQUIRY: {
    type: 'RUG_ORDER_INQUIRY',
    label: 'Reserve Machine-Made Ready Rug 🧶',
    shortLabel: 'Ready Rug Order',
    badgeText: 'Predefined Standard Rug Size',
    subtitle:
      'Confirm availability and delivery/pickup for your selected predefined machine-made rug size.',
    requiresAddress: true,
    requiresDate: false,
    allowReferenceUpload: false,
  },
};

export function getQueryTypeMeta(queryType: QueryType): QueryTypeMeta {
  return QUERY_TYPE_META_MAP[queryType] || QUERY_TYPE_META_MAP.CALLBACK_REQUEST;
}

/**
 * Builds a clean, pre-filled WhatsApp URL (`https://wa.me/...`) containing all
 * customer, dimension, material quality, and price details.
 */
export function buildWhatsAppInquiryUrl(
  payload: CustomerQueryPayload,
  settings: StoreSettings
): string {
  const meta = getQueryTypeMeta(payload.query_type);
  const cleanPhone = settings.whatsapp_number.replace(/[^0-9]/g, '');

  const lines: string[] = [
    `*New Inquiry — ${settings.shop_name}*`,
    `*Type:* ${meta.label}`,
    `────────────────────`,
    `*Customer Name:* ${payload.customer_name}`,
    `*Phone:* ${payload.customer_phone}`,
  ];

  if (payload.customer_address?.trim()) {
    lines.push(`*Address / Location:* ${payload.customer_address.trim()}`);
  }

  if (payload.preferred_visit_date?.trim()) {
    lines.push(`*Preferred Visit Slot:* ${payload.preferred_visit_date.trim()}`);
  }

  if (payload.product_title_snapshot?.trim()) {
    lines.push(`*Product / Category:* ${payload.product_title_snapshot.trim()}`);
  }

  if (payload.selected_size_or_dimensions?.trim()) {
    lines.push(`*Size / Dimensions:* ${payload.selected_size_or_dimensions.trim()}`);
  }

  if (payload.selected_quality_name?.trim()) {
    lines.push(`*Material Quality:* ${payload.selected_quality_name.trim()}`);
  }

  if (
    typeof payload.estimated_price === 'number' &&
    payload.estimated_price > 0
  ) {
    lines.push(
      `*Estimated Price:* ${formatCurrencyINR(payload.estimated_price)}`
    );
  }

  if (payload.custom_design_notes?.trim()) {
    lines.push(`*Customer Notes:* ${payload.custom_design_notes.trim()}`);
  }

  if (payload.reference_image_url?.trim() && !payload.reference_image_url.startsWith('data:')) {
    lines.push(`*Reference Image:* ${payload.reference_image_url.trim()}`);
  }

  const textParam = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanPhone}?text=${textParam}`;
}

/**
 * Dispatches a free email notification via Web3Forms if `VITE_WEB3FORMS_ACCESS_KEY`
 * is configured in `.env`. Fails gracefully without blocking lead storage.
 */
export async function sendWeb3FormsNotification(
  payload: CustomerQueryPayload,
  shopName: string
): Promise<boolean> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as
    | string
    | undefined;

  if (
    !accessKey ||
    accessKey === 'your-web3forms-key' ||
    accessKey.trim() === ''
  ) {
    return false;
  }

  const meta = getQueryTypeMeta(payload.query_type);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `[${shopName}] ${meta.shortLabel} from ${payload.customer_name}`,
        from_name: payload.customer_name,
        phone: payload.customer_phone,
        inquiry_type: meta.label,
        address: payload.customer_address || 'N/A',
        preferred_date: payload.preferred_visit_date || 'N/A',
        product: payload.product_title_snapshot || 'General Store Inquiry',
        dimensions: payload.selected_size_or_dimensions || 'N/A',
        material_quality: payload.selected_quality_name || 'N/A',
        estimated_price:
          typeof payload.estimated_price === 'number' && payload.estimated_price > 0
            ? formatCurrencyINR(payload.estimated_price)
            : 'To be measured',
        notes: payload.custom_design_notes || 'None',
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
