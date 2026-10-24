/**
 * FINAL PRODUCTION APPLICATION ROUTER (`src/App.tsx`)
 * Phase 5 Locked File — Connects all Public Storefront routes (`/`, `/category/:slug`,
 * `/product/:slug`, `/legal`), Protected Admin routes (`/admin/login`, `/admin/products`,
 * `/admin/queries`, `/admin/settings`), automatic scroll-to-top on route change,
 * and a clean fallback route.
 */
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { InquiryModalProvider } from './context/InquiryModalContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { LeadCaptureModal } from './components/modals/LeadCaptureModal';
import { HomePage } from './pages/public/HomePage';
import { CategoryPage } from './pages/public/CategoryPage';
import { ProductDetailPage } from './pages/public/ProductDetailPage';
import { LegalTermsPage } from './pages/public/LegalTermsPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardLayout } from './pages/admin/AdminDashboardLayout';
import { AdminProductsManager } from './pages/admin/AdminProductsManager';
import { AdminQueriesInbox } from './pages/admin/AdminQueriesInbox';
import { AdminStoreSettings } from './pages/admin/AdminStoreSettings';

const ScrollToTopOnNavigate: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const PublicStorefrontLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1E1C]">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <MobileStickyBar />
    <LeadCaptureModal />
  </div>
);

export const App: React.FC = () => {
  return (
    <StoreSettingsProvider>
      <InquiryModalProvider>
        <BrowserRouter>
          <ScrollToTopOnNavigate />
          <Routes>
            {/* Public Customer Storefront Routes */}
            <Route element={<PublicStorefrontLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/legal" element={<LegalTermsPage />} />
            </Route>

            {/* Protected Admin Portal Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<Navigate to="/admin/products" replace />} />
              <Route path="products" element={<AdminProductsManager />} />
              <Route path="queries" element={<AdminQueriesInbox />} />
              <Route path="settings" element={<AdminStoreSettings />} />
            </Route>

            {/* Catch-All Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </InquiryModalProvider>
    </StoreSettingsProvider>
  );
};

export default App;
