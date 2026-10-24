/**
 * GLOBAL STORE SETTINGS CONTEXT
 * Supplies shop name, phone, WhatsApp, physical address, and announcement text
 * to Navbar, Footer, MobileStickyBar, and Admin Settings without prop drilling.
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { StoreSettings } from '../types/database.types';
import { DEFAULT_STORE_SETTINGS } from '../config/categoriesSeed';
import { fetchStoreSettings, updateStoreSettings } from '../services/settingsService';

interface StoreSettingsContextValue {
  settings: StoreSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  saveSettings: (
    updates: Partial<Omit<StoreSettings, 'id' | 'updated_at'>>
  ) => Promise<{ success: boolean; error: string | null }>;
}

const StoreSettingsContext = createContext<StoreSettingsContextValue | undefined>(
  undefined
);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const latest = await fetchStoreSettings();
      setSettings(latest);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  const saveSettings = useCallback(
    async (updates: Partial<Omit<StoreSettings, 'id' | 'updated_at'>>) => {
      const { data, error } = await updateStoreSettings(updates);
      setSettings(data);
      return { success: !error, error };
    },
    []
  );

  return (
    <StoreSettingsContext.Provider
      value={{ settings, isLoading, refreshSettings, saveSettings }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export function useStoreSettings(): StoreSettingsContextValue {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return ctx;
}
