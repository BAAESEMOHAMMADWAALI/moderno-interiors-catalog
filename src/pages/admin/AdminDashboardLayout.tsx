/**
 * PROTECTED ADMIN DASHBOARD SHELL (`/admin/*`)
 * Phase 4 Locked File — Provides sidebar & mobile navigation between:
 * 1. Products, Rug Sizes & Quality Pricing Manager (`/admin/products`)
 * 2. Customer Queries & Home Measurement Inbox (`/admin/queries`)
 * 3. Store Contact & Announcement Settings (`/admin/settings`)
 */
import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Inbox,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import {
  AdminUserSession,
  getAdminSession,
  signOutAdmin,
} from '../../services/adminProductService';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const AdminDashboardLayout: React.FC = () => {
  const { settings } = useStoreSettings();
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminUserSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    void getAdminSession().then((found) => {
      if (!found) {
        navigate('/admin/login', { replace: true });
      } else {
        setSession(found);
      }
      setCheckingAuth(false);
    });
  }, [navigate]);

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/admin/login', { replace: true });
  };

  if (checkingAuth || !session) {
    return null;
  }

  const navItems = [
    {
      to: '/admin/products',
      label: 'Products & Quality Prices',
      icon: <Package className="w-4 h-4" />,
      badge: '16 Categories',
    },
    {
      to: '/admin/queries',
      label: 'Customer Leads & Visits 🏡',
      icon: <Inbox className="w-4 h-4" />,
      badge: 'Calls & Quotes',
    },
    {
      to: '/admin/settings',
      label: 'Store Contact & Info',
      icon: <Settings className="w-4 h-4" />,
      badge: 'Phone & Map',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      {/* Top Admin Control Header */}
      <header className="bg-[#1E1E1C] text-white border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#9C5A3C] text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-sm sm:text-base font-bold leading-tight">
                {settings.shop_name} — Admin Control Panel
              </h1>
              <p className="text-[11px] text-[#F0ECE1]/70">
                Logged in as {session.email} ({session.mode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
            >
              <span>Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-xs font-semibold transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        {/* Sidebar / Mobile Pill Navigation */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar bg-white p-2.5 rounded-2xl border border-[#E5DFD3]">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-[#1E1E1C] text-white shadow-xs'
                      : 'text-[#1E1E1C] hover:bg-[#FAF8F5]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="hidden xl:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#F0ECE1] text-[#9C5A3C]">
                  {item.badge}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Active Admin Page Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
