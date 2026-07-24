'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/lib/i18n/language-context';
import { Layers, TestTube, Rocket, Star, LayoutDashboard, Menu, X, PlusCircle, User as UserIcon, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { OrderModal } from './OrderModal';
import { useAuth } from '@/lib/auth';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { user, logout, openAuthModal } = useAuth();
  const { t } = useLanguage();

  // Base public links
  const navLinks = [
    { href: '/', label: t('nav_home'), icon: Layers },
    { href: '/services/testing', label: t('nav_testing'), icon: TestTube },
    { href: '/services/publishing', label: t('nav_publishing'), icon: Rocket },
    { href: '/services/promotion', label: t('nav_promotion'), icon: Star },
    { href: '/analyzer', label: t('nav_analyzer'), icon: Sparkles },
  ];

  // If user is Admin, dynamically append Admin Portal link to nav
  if (user?.role === 'admin') {
    navLinks.push({ href: '/admin', label: t('nb_admin_link'), icon: LayoutDashboard });
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 border-b border-slate-200/80 shadow-apple-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="TE2SR Tester"
              className="h-9 w-auto max-w-[160px] object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isAdminLink = link.href === '/admin';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? isAdminLink
                        ? 'bg-slate-900 text-white shadow-apple-sm'
                        : 'bg-white text-brand-blue shadow-apple-sm'
                      : isAdminLink
                      ? 'text-slate-900 hover:bg-slate-200/70 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? (isAdminLink ? 'text-white' : 'text-brand-blue') : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <LanguageSelector />

            {/* Account Role Badge */}
            {user ? (
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-brand-blue text-xs font-bold shadow-apple-sm transition-all"
                    title={t('nb_admin_panel_title')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('nb_admin_prefix')}{user.name}</span>
                  </Link>
                ) : (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:border-brand-blue hover:text-brand-blue transition-all"
                    title={t('nb_order_progress_title')}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{user.name}</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-red-500 text-xs transition-colors"
                  title={t('nb_logout_title')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 hover:border-brand-blue hover:text-brand-blue transition-all"
              >
                <UserIcon className="w-3.5 h-3.5 text-brand-blue" />
                <span>{t('nb_login')}</span>
              </button>
            )}

            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-blue-600 shadow-brand-blue hover:scale-[1.02] transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('btn_start')}</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-black"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-blue/10 text-brand-blue font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-blue" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsOrderModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-brand-blue shadow-brand-blue"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('btn_start')}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Service Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};
