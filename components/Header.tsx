// components/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  setInitialTab: (tab: string) => void;
}

export default function Header({ setCurrentPage, setInitialTab }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerHeight = 'h-20';

  const handleNavClick = (page: string, tab: string) => {
    setCurrentPage(page);
    setInitialTab(tab);
  };

  return (
    <>
      <div className={headerHeight} />

      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${headerHeight} ${
          isScrolled
            ? 'bg-white/90 shadow-2xl backdrop-blur-xl border-b border-white/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto flex h-full items-center justify-center px-6">
          {/* Logo Bölümü */}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('main', 'donate');
            }}
            className="flex items-center gap-4 group"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute -inset-2 bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Ana Logo Container */}
              <div className="relative bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 p-3 rounded-2xl shadow-lg group-hover:shadow-emerald-500/25 group-hover:shadow-xl transition-all duration-500 group-hover:scale-110">
                <FontAwesomeIcon
                  icon={faShirt}
                  className="h-6 w-6 text-white drop-shadow-sm"
                />
              </div>

              {/* Pulse Ring */}
              <div className="absolute inset-0 rounded-2xl border-2 border-emerald-400/50 opacity-0 group-hover:opacity-100 animate-ping"></div>
            </div>

            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-800 transition-all duration-500">
                Forma Kardeşliği
              </span>
              <span className="text-xs text-gray-500 group-hover:text-emerald-600 transition-colors duration-500 font-medium tracking-wide">
                Çocuklara umut, forma ile mutluluk
              </span>
            </div>
          </Link>

          {/* Boş alan - sadece logo ve slogan */}
          <div></div>
        </nav>

        {/* Decorative Bottom Border */}
        <div
          className={`h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent transition-opacity duration-500 ${
            isScrolled ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
      </header>
    </>
  );
}
