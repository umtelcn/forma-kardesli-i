// components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  setInitialTab: (tab: string) => void;
}

export default function Header({ setCurrentPage, setInitialTab }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerHeight = 'h-16 sm:h-20';

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentPage('main');
    setInitialTab('donate');
  };

  return (
    <>
      <div className={headerHeight} />

      <header
        className={[
          'fixed inset-x-0 top-0 z-30',
          'border-b transition-all duration-300',
          'bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80',
          isScrolled ? 'shadow-sm border-gray-200' : 'border-transparent',
          headerHeight,
        ].join(' ')}
        role="banner"
      >
        <nav
          className="container mx-auto flex h-full items-center justify-between gap-4 px-4 sm:px-6"
          aria-label="Primary"
        >
          {/* Logo + Marka */}
          <Link
            href="#"
            onClick={goHome}
            className="group flex items-center gap-3"
            aria-label="Askıda Forma ana sayfa"
          >
            {/* Yuvarlak çerçeve içinde forma ikonu */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <FontAwesomeIcon icon={faShirt} className="h-6 w-6 text-emerald-600" />
            </div>

            {/* Marka adı + slogan */}
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-semibold text-slate-900 tracking-[-0.01em]">
                Askıda Forma
              </span>
              <span className="text-xs sm:text-sm text-emerald-600 font-medium italic">
                “Bir forma, bir umut, bin gülümseme”
              </span>
            </div>
          </Link>

          {/* Instagram ikonu */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Instagram"
              className="p-2 rounded-full border border-slate-200 bg-white text-pink-500 hover:text-pink-600 hover:border-pink-300 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70"
              // TODO: href ekle
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {/* Alt vurgu çizgisi */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/15 to-transparent" />
      </header>
    </>
  );
}