/**
 * GLOBAL NAVBAR (4-PILLAR MEGA MENU + MOBILE HAMBURGER DRAWER)
 * Phase 1 Locked File — Renders all 16 categories grouped logically, plus instant
 * triggers for 'Book Home Measurement 🏡' and 'Request Callback 🤙'.
 */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Home,
  Menu,
  PhoneCall,
  Ruler,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  CANONICAL_CATEGORIES,
  NAV_GROUPS,
} from '../../config/categoriesSeed';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { NavGroupKey } from '../../types/database.types';
import { triggerGlobalInquiryModal } from '../../utils/pricingEngine';

export const Navbar: React.FC = () => {
  const { settings } = useStoreSettings();
  const location = useLocation();
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<NavGroupKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const getCategoriesByGroup = (groupKey: NavGroupKey) =>
    CANONICAL_CATEGORIES.filter((cat) => cat.nav_group === groupKey && cat.is_active);

  const handleOpenHomeVisit = () => {
    setMobileMenuOpen(false);
    triggerGlobalInquiryModal({ queryType: 'HOME_MEASUREMENT' });
  };

  const handleOpenCallback = () => {
    setMobileMenuOpen(false);
    triggerGlobalInquiryModal({ queryType: 'CALLBACK_REQUEST' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E5DFD3]">
      {/* Top Announcement & Store Hours Bar */}
      <div className="bg-[#1E1E1C] text-[#FAF8F5] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium truncate">{settings.announcement_text}</p>
          <div className="hidden md:flex items-center gap-5 text-[#F0ECE1]">
            <span>{settings.business_hours}</span>
            <a
              href={`tel:${settings.primary_phone.replace(/\s+/g, '')}`}
              className="hover:text-white underline underline-offset-4 font-semibold"
            >
              {settings.primary_phone}
            </a>
            <Link
              to="/admin"
              className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex flex-col group focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[#1E1E1C] group-hover:text-[#9C5A3C] transition-colors">
            {settings.shop_name.toUpperCase()}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#6E6A63]">
            Rugs • Walls • Flooring • Custom Decor
          </span>
        </Link>

        {/* Desktop 4-Pillar Mega Menu */}
        <nav
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setActiveDesktopGroup(null)}
        >
          <Link
            to="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
              location.pathname === '/'
                ? 'bg-[#F0ECE1] text-[#1E1E1C]'
                : 'text-[#1E1E1C] hover:bg-[#F0ECE1]/60'
            }`}
          >
            Home
          </Link>

          {NAV_GROUPS.map((group) => {
            const groupCategories = getCategoriesByGroup(group.key);
            const isOpen = activeDesktopGroup === group.key;

            return (
              <div
                key={group.key}
                className="relative"
                onMouseEnter={() => setActiveDesktopGroup(group.key)}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDesktopGroup(isOpen ? null : group.key)
                  }
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isOpen
                      ? 'bg-[#1E1E1C] text-[#FAF8F5]'
                      : 'text-[#1E1E1C] hover:bg-[#F0ECE1]/70'
                  }`}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-150 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Mega Panel */}
                {isOpen && (
                  <div className="absolute left-0 top-full pt-2 w-80 z-50">
                    <div className="bg-white rounded-2xl shadow-xl border border-[#E5DFD3] p-4">
                      <div className="mb-3 pb-2 border-b border-[#E5DFD3]">
                        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F0ECE1] text-[#9C5A3C]">
                          {group.badgeText}
                        </span>
                        <p className="text-xs text-[#6E6A63] mt-1">
                          {group.description}
                        </p>
                      </div>
                      <ul className="space-y-1">
                        {groupCategories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              to={`/category/${cat.slug}`}
                              onClick={() => setActiveDesktopGroup(null)}
                              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF8F5] transition group/item"
                            >
                              <div>
                                <p className="text-sm font-medium text-[#1E1E1C] group-hover/item:text-[#9C5A3C]">
                                  {cat.name}
                                </p>
                                <p className="text-[11px] text-[#6E6A63] line-clamp-1">
                                  {cat.short_description}
                                </p>
                              </div>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                                  cat.pricing_mode === 'FIXED_RUG'
                                    ? 'bg-[#1E1E1C] text-white'
                                    : 'bg-[#F0ECE1] text-[#9C5A3C]'
                                }`}
                              >
                                {cat.pricing_mode === 'FIXED_RUG'
                                  ? 'Ready Size'
                                  : 'Custom Sq.Ft'}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop Right-Side Action Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenHomeVisit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E1E1C] hover:bg-[#9C5A3C] text-white text-xs font-semibold transition shadow-sm"
          >
            <Ruler className="w-4 h-4" />
            <span>Book Home Visit 🏡</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCallback}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#1F7A4C] hover:bg-[#17613B] text-white text-xs font-semibold transition shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Me 🤙</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={handleOpenCallback}
            aria-label="Request Callback"
            className="p-2.5 rounded-xl bg-[#1F7A4C] text-white md:hidden"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
            className="p-2.5 rounded-xl border border-[#E5DFD3] bg-white text-[#1E1E1C]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer (All 16 Categories + Store Actions) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5DFD3] max-h-[82vh] overflow-y-auto px-4 pt-3 pb-8 space-y-5">
          {/* Quick Mobile CTA Banner */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#F0ECE1] p-3 rounded-2xl">
            <button
              type="button"
              onClick={handleOpenHomeVisit}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#1E1E1C] text-white text-xs font-semibold"
            >
              <Home className="w-4 h-4" />
              <span>Home Size Visit 🏡</span>
            </button>
            <button
              type="button"
              onClick={handleOpenCallback}
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#1F7A4C] text-white text-xs font-semibold"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Request Call 🤙</span>
            </button>
          </div>

          {/* 4 Category Pillars */}
          {NAV_GROUPS.map((group) => {
            const cats = getCategoriesByGroup(group.key);
            return (
              <div key={group.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#9C5A3C]">
                    {group.label}
                  </h3>
                  <span className="text-[10px] text-[#6E6A63]">{group.badgeText}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {cats.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-xl border border-[#E5DFD3] bg-[#FAF8F5] hover:border-[#9C5A3C] transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-[#1E1E1C] leading-snug">
                        {cat.name}
                      </span>
                      <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-[#6E6A63]">
                        {cat.pricing_mode === 'FIXED_RUG' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-[#1E1E1C]" />
                            Machine-Made Ready Size
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-[#9C5A3C]" />
                            Custom Size & Quality
                          </>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Mobile Footer Links */}
          <div className="pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#6E6A63]">
            <Link
              to="/legal"
              onClick={() => setMobileMenuOpen(false)}
              className="underline"
            >
              Terms & Measurement Policy
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="font-semibold text-[#1E1E1C]"
            >
              Admin Login →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
