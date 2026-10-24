/**
 * GLOBAL INQUIRY MODAL CONTEXT
 * Phase 3 Locked File — Listens for `INQUIRY_MODAL_EVENT` ('moderno:open-inquiry-modal')
 * dispatched by Phase 1 (Navbar, Footer, MobileStickyBar) and Phase 2 (ProductCard,
 * MaterialSwatchStrip, RugPredefinedSelector, CustomDimensionCalc, HomePage, CategoryPage).
 * Zero Phase 1 or Phase 2 files ever need to be modified!
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { InquiryTriggerEventDetail } from '../types/database.types';
import { INQUIRY_MODAL_EVENT } from '../utils/pricingEngine';

interface InquiryModalContextValue {
  isOpen: boolean;
  activeDetail: InquiryTriggerEventDetail | null;
  openInquiryModal: (detail: InquiryTriggerEventDetail) => void;
  closeInquiryModal: () => void;
}

const InquiryModalContext = createContext<InquiryModalContextValue | undefined>(
  undefined
);

export const InquiryModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeDetail, setActiveDetail] =
    useState<InquiryTriggerEventDetail | null>(null);

  const openInquiryModal = useCallback((detail: InquiryTriggerEventDetail) => {
    setActiveDetail(detail);
    setIsOpen(true);
  }, []);

  const closeInquiryModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleCustomOpenEvent = (event: Event) => {
      const customEvent = event as CustomEvent<InquiryTriggerEventDetail>;
      if (customEvent.detail) {
        openInquiryModal(customEvent.detail);
      } else {
        openInquiryModal({ queryType: 'CALLBACK_REQUEST' });
      }
    };

    window.addEventListener(INQUIRY_MODAL_EVENT, handleCustomOpenEvent);
    return () => {
      window.removeEventListener(INQUIRY_MODAL_EVENT, handleCustomOpenEvent);
    };
  }, [openInquiryModal]);

  return (
    <InquiryModalContext.Provider
      value={{
        isOpen,
        activeDetail,
        openInquiryModal,
        closeInquiryModal,
      }}
    >
      {children}
    </InquiryModalContext.Provider>
  );
};

export function useInquiryModal(): InquiryModalContextValue {
  const ctx = useContext(InquiryModalContext);
  if (!ctx) {
    throw new Error(
      'useInquiryModal must be used within an InquiryModalProvider'
    );
  }
  return ctx;
}
