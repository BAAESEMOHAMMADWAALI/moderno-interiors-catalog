/**
 * STORE SETTINGS SERVICE
 * Handles reading and updating the single-row `store_settings` table in Supabase,
 * with automatic fallback to `DEFAULT_STORE_SETTINGS` when running offline/unconfigured.
 */
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DEFAULT_STORE_SETTINGS } from '../config/categoriesSeed';
import { StoreSettings } from '../types/database.types';

const LOCAL_STORAGE_SETTINGS_KEY = 'moderno_store_settings_cache_v1';

export async function fetchStoreSettings(): Promise<StoreSettings> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (!error && data) {
      const merged: StoreSettings = { ...DEFAULT_STORE_SETTINGS, ...data };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(merged));
      }
      return merged;
    }
  }

  if (typeof window !== 'undefined') {
    const cached = window.localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (cached) {
      try {
        return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(cached) };
      } catch {
        return DEFAULT_STORE_SETTINGS;
      }
    }
  }

  return DEFAULT_STORE_SETTINGS;
}

export async function updateStoreSettings(
  updates: Partial<Omit<StoreSettings, 'id' | 'updated_at'>>
): Promise<{ data: StoreSettings; error: string | null }> {
  const updatedPayload: StoreSettings = {
    ...(await fetchStoreSettings()),
    ...updates,
    id: 1,
    updated_at: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(
      LOCAL_STORAGE_SETTINGS_KEY,
      JSON.stringify(updatedPayload)
    );
  }

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('store_settings')
      .upsert(updatedPayload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      return { data: updatedPayload, error: error.message };
    }
    return { data: data as StoreSettings, error: null };
  }

  return { data: updatedPayload, error: null };
}
