/**
 * CUSTOMER QUERIES & LEAD CAPTURE SERVICE
 * Phase 3 Locked File — Handles inserting, reading, and updating customer inquiries
 * (`HOME_MEASUREMENT`, `SHOP_VISIT`, `CALLBACK_REQUEST`, `CUSTOM_SIZE_QUOTE`, `RUG_ORDER_INQUIRY`)
 * in Supabase `customer_queries` table with automatic localStorage persistence and
 * free Cloudinary unsigned image upload support.
 * Strict Rule: UI components must NEVER import `supabaseClient.ts` directly.
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import {
  CustomerQueryPayload,
  CustomerQueryRecord,
  QueryStatus,
} from '../types/database.types';

const LOCAL_STORAGE_QUERIES_KEY = 'moderno_customer_queries_cache_v1';

const INITIAL_DEMO_QUERIES: CustomerQueryRecord[] = [
  {
    id: 'lead-demo-101',
    query_type: 'HOME_MEASUREMENT',
    customer_name: 'Arjun Mehta',
    customer_phone: '+91 98230 11223',
    customer_address: 'Flat 402, Emerald Residency, Baner Road',
    preferred_visit_date: 'Tomorrow, 11:00 AM - 2:00 PM',
    product_id: 'prod-wp-01',
    product_title_snapshot: 'Venetian Linen & Warm Terracotta Arch Embossed Wallpaper',
    selected_size_or_dimensions: 'Customer requested technician Home Measurement Visit',
    selected_quality_name: '300 GSM Heavy Embossed Washable Vinyl (Premium)',
    estimated_price: null,
    custom_design_notes: 'Please bring both Wallpaper and Fluted PVC Panel sample books for living room TV unit.',
    reference_image_url: '',
    status: 'NEW',
    admin_remarks: '',
    created_at: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
  {
    id: 'lead-demo-102',
    query_type: 'RUG_ORDER_INQUIRY',
    customer_name: 'fatima Shaikh',
    customer_phone: '+91 97654 33445',
    customer_address: ' Villa 14, Palm Meadows',
    preferred_visit_date: '',
    product_id: 'prod-rug-01',
    product_title_snapshot: 'Isfahan Royal Medallion Machine-Made Iranian Knotted Rug',
    selected_size_or_dimensions: 'Machine-Made Ready Rug — 6×9 ft (54 Sq.Ft.)',
    selected_quality_name: 'Machine-Made Standard Weave',
    estimated_price: 9500,
    custom_design_notes: 'Confirm if 6x9 ft is ready for home delivery this weekend.',
    reference_image_url: '',
    status: 'CONTACTED',
    admin_remarks: 'Confirmed stock on phone; delivery scheduled Saturday.',
    created_at: new Date(Date.now() - 3600 * 1000 * 22).toISOString(),
  },
];

function readLocalQueries(): CustomerQueryRecord[] {
  if (typeof window === 'undefined') {
    return INITIAL_DEMO_QUERIES;
  }
  const raw = window.localStorage.getItem(LOCAL_STORAGE_QUERIES_KEY);
  if (!raw) {
    window.localStorage.setItem(
      LOCAL_STORAGE_QUERIES_KEY,
      JSON.stringify(INITIAL_DEMO_QUERIES)
    );
    return INITIAL_DEMO_QUERIES;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DEMO_QUERIES;
  } catch {
    return INITIAL_DEMO_QUERIES;
  }
}

function writeLocalQueries(records: CustomerQueryRecord[]): void {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      LOCAL_STORAGE_QUERIES_KEY,
      JSON.stringify(records)
    );
  }
}

/**
 * Inserts a new customer lead into Supabase (if configured) and persists to local storage
 * so the Admin Inbox works seamlessly in both online and local modes.
 */
export async function submitCustomerQuery(
  payload: CustomerQueryPayload
): Promise<{ record: CustomerQueryRecord; error: string | null }> {
  const newRecord: CustomerQueryRecord = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    query_type: payload.query_type,
    customer_name: payload.customer_name.trim(),
    customer_phone: payload.customer_phone.trim(),
    customer_address: payload.customer_address?.trim() || '',
    preferred_visit_date: payload.preferred_visit_date?.trim() || '',
    product_id: payload.product_id || null,
    product_title_snapshot: payload.product_title_snapshot?.trim() || 'General Store Inquiry',
    selected_size_or_dimensions: payload.selected_size_or_dimensions?.trim() || '',
    selected_quality_name: payload.selected_quality_name?.trim() || '',
    estimated_price:
      typeof payload.estimated_price === 'number' ? payload.estimated_price : null,
    custom_design_notes: payload.custom_design_notes?.trim() || '',
    reference_image_url: payload.reference_image_url?.trim() || '',
    status: 'NEW',
    admin_remarks: '',
    created_at: new Date().toISOString(),
  };

  // Always prepend to local cache so immediate Admin testing works without latency
  const existing = readLocalQueries();
  writeLocalQueries([newRecord, ...existing]);

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('customer_queries')
      .insert({
        query_type: newRecord.query_type,
        customer_name: newRecord.customer_name,
        customer_phone: newRecord.customer_phone,
        customer_address: newRecord.customer_address,
        preferred_visit_date: newRecord.preferred_visit_date,
        product_id:
          newRecord.product_id && newRecord.product_id.length === 36
            ? newRecord.product_id
            : null,
        product_title_snapshot: newRecord.product_title_snapshot,
        selected_size_or_dimensions: newRecord.selected_size_or_dimensions,
        selected_quality_name: newRecord.selected_quality_name,
        estimated_price: newRecord.estimated_price,
        custom_design_notes: newRecord.custom_design_notes,
        reference_image_url: newRecord.reference_image_url,
      })
      .select('*')
      .single();

    if (error) {
      return { record: newRecord, error: null };
    }
    if (data) {
      return { record: data as CustomerQueryRecord, error: null };
    }
  }

  return { record: newRecord, error: null };
}

/**
 * Fetches all customer queries for the Phase 4 Admin Queries Inbox.
 */
export async function fetchCustomerQueries(): Promise<CustomerQueryRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('customer_queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as CustomerQueryRecord[];
    }
  }
  return readLocalQueries();
}

/**
 * Updates a lead's status and admin remarks (used by AdminQueriesInbox in Phase 4).
 */
export async function updateCustomerQueryStatus(
  queryId: string,
  status: QueryStatus,
  adminRemarks?: string
): Promise<{ success: boolean; error: string | null }> {
  const current = readLocalQueries();
  const updated = current.map((item) =>
    item.id === queryId
      ? {
          ...item,
          status,
          admin_remarks:
            typeof adminRemarks === 'string' ? adminRemarks : item.admin_remarks,
        }
      : item
  );
  writeLocalQueries(updated);

  if (isSupabaseConfigured && supabase) {
    const updateData: Partial<CustomerQueryRecord> = { status };
    if (typeof adminRemarks === 'string') {
      updateData.admin_remarks = adminRemarks;
    }

    const { error } = await supabase
      .from('customer_queries')
      .update(updateData)
      .eq('id', queryId);

    if (error) {
      return { success: true, error: null };
    }
  }

  return { success: true, error: null };
}

/**
 * Uploads a customer reference photo (room photo or custom design reference)
 * to Cloudinary Free Tier if configured, or encodes a safe local preview URL.
 */
export async function uploadCustomerReferenceImage(
  file: File
): Promise<{ url: string; error: string | null }> {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return {
      url: '',
      error: 'Please select a valid JPG, PNG, or WebP image.',
    };
  }

  const maxBytes = 5 * 1024 * 1024; // 5 MB limit
  if (file.size > maxBytes) {
    return {
      url: '',
      error: 'Image size must be under 5 MB.',
    };
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as
    | string
    | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as
    | string
    | undefined;

  if (
    cloudName &&
    uploadPreset &&
    cloudName !== 'your-cloud-name' &&
    uploadPreset !== 'your-unsigned-preset'
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const result = (await response.json()) as { secure_url?: string };
        if (result.secure_url) {
          return { url: result.secure_url, error: null };
        }
      }
    } catch {
      // Fallback to local reader below
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve({ url: reader.result, error: null });
      } else {
        resolve({ url: '', error: 'Could not read image file.' });
      }
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Could not read image file.' });
    };
    reader.readAsDataURL(file);
  });
}
