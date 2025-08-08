'use client';

import { useState } from 'react';
import { faqData } from '../lib/constants';
import { FAQ } from '../lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

interface SssFooterProps {
  onAdminClick: () => void;
}

function FaqItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none transition">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-start gap-3 text-left px-5 py-4 rounded-xl transition-colors duration-300 group
          ${isOpen ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-start gap-3">
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className={`w-5 h-5 mt-1 flex-shrink-0 transition-colors duration-300 ${
              isOpen
                ? 'text-emerald-600'
                : 'text-emerald-500 group-hover:text-emerald-600'
            }`}
          />
          <span className="text-base font-semibold">{faq.q}</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`w-4 h-4 mt-1 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-400'
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div
          className="px-6 pb-5 pl-14 text-sm text-gray-600 leading-relaxed [&_a]:text-emerald-600 [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: faq.a }}
        ></div>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <section className="mt-16 mb-12 bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Sıkça Sorulan Sorular
        </h2>
        <div className="space-y-1.5">
          {faqData.map((faq, index) => (
            <FaqItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectFooter({ onAdminClick }: { onAdminClick: () => void }) {
  return (
    <footer className="text-center py-10 text-gray-400 text-sm">
      <p className="mb-2">
        &copy; 2025{' '}
        <span className="text-gray-600 font-medium">Askıda Forma</span>
      </p>
      <p className="text-xs">
        Çocuklar Üşümesin Yardımlaşma ve Dayanışma Derneği Projesidir.
      </p>
      <button
        onClick={onAdminClick}
        className="mt-4 text-xs text-gray-400 hover:text-emerald-600 transition-colors underline"
      >
        Telif Hakkı & Yönetici Girişi
      </button>
    </footer>
  );
}

export default function SssFooter({ onAdminClick }: SssFooterProps) {
  return (
    <>
      <FaqSection />
      <ProjectFooter onAdminClick={onAdminClick} />
    </>
  );
}
