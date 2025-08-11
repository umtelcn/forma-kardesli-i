// components/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

  const headerHeight = 'h-20 sm:h-24 md:h-28';

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
          className="container mx-auto flex h-full items-center justify-between gap-6 px-4 sm:px-6"
          aria-label="Primary"
        >
          {/* Logo + Başlık + Slogan */}
          <Link
            href="#"
            onClick={goHome}
            className="group flex items-center gap-4 hover:opacity-90 transition-opacity duration-200"
            aria-label="Askıda Forma ana sayfa"
          >
            {/* İkon */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src="/askida-forma.svg"
                alt="Askıda Forma Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Metin */}
            <div className="flex flex-col">
              <span className="font-sugo-light text-2xl sm:text-3xl md:text-4xl text-slate-800 leading-none">
                Askıda Forma
              </span>
              <span className="text-xs sm:text-sm md:text-base text-[#77b65d]">
                Bir forma, bir umut, bin gülümse
              </span>
            </div>
          </Link>

          {/* Sağ taraf - Instagram */}
          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com/askidaforma"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram'da takip edin"
              className="p-2.5 rounded-full border border-slate-200 bg-white text-pink-500 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70 shadow-sm"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </a>
          </div>
        </nav>

        {/* Alt dekoratif çizgi */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </header>
    </>
  );
}