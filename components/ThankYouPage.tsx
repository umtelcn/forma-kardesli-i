// components/ThankYouPage.tsx
'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faDownload, faShareNodes, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import html2canvas from 'html2canvas';

interface ThankYouPageProps {
  onFinish: () => void;
  donorData?: {
    name?: string;
    surname?: string;
    display_name?: string;
    teamName?: string;
    imageUrl?: string;      // Forma görseli
    quantity?: number;
    teamLogo?: string;      // Takım logosu
    primaryColor?: string | null;
    accentColor?: string | null;
  };
}

export default function ThankYouPage({ onFinish, donorData }: ThankYouPageProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const [serialNumber, setSerialNumber] = useState('');
  const [cardDate, setCardDate] = useState('');

  useEffect(() => {
    setSerialNumber(`AF-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`);
    
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setCardDate(new Date().toLocaleDateString('tr-TR', options));
  }, []);

  // Renkler ve veriler
  const primary = donorData?.primaryColor || '#1A1A1A';
  const accent = donorData?.accentColor || '#e2e8f0';
  
  // DÜZELTME: Takım adından '(çocuk forması)' gibi ifadeleri temizle
  const teamName = (donorData?.teamName || 'Bir Takım').split('(')[0].trim();

  const qty = donorData?.quantity ?? 1;
  const jerseyImg = donorData?.imageUrl || '/assets/bjkforma.jpg';
  const teamLogo = donorData?.teamLogo || '/assets/bjklogo.svg';

  const displayName = useMemo(() => {
    if (donorData?.display_name?.trim()) return donorData.display_name!;
    const full = `${donorData?.name ?? ''} ${donorData?.surname ?? ''}`.trim();
    return full || 'İsimsiz Kahraman';
  }, [donorData?.display_name, donorData?.name, donorData?.surname]);

  const shareText = `Ben de Askıda Forma ile ${teamName} için ${qty} forma bağışladım!`;
  const siteUrl = 'https://askidaforma.com';

  async function downloadCard() {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `AskidaForma-Kart-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setIsGenerating(false);
    }
  }
  
  function shareTo(platform: 'instagram'|'twitter'|'whatsapp') {
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${siteUrl}`)}`,
    } as const;

    if (platform === 'instagram') {
      alert('Kart indiriliyor. Instagram Hikaye\'de paylaşabilirsin.');
      downloadCard();
      return setShowShareMenu(false);
    }
    window.open(links[platform], '_blank', 'width=600,height=520');
    setShowShareMenu(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-200">
      <div className="w-full max-w-sm">

        <div
          ref={cardRef}
          style={{ '--team-primary': primary, '--team-accent': accent } as React.CSSProperties}
          className="bg-white rounded-2xl overflow-hidden shadow-xl fade-in-up mb-6"
        >
          {/* ÜST KISIM */}
          {/* DÜZELTME: Üst üste binmeyi engellemek için alt padding (pb-20) artırıldı */}
          <div style={{ backgroundColor: 'var(--team-primary)' }} className="pt-6 px-6 pb-20 relative text-white">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <Image src={teamLogo} alt={`${teamName} Logosu`} width={48} height={48} className="drop-shadow-lg" />
                <div className="text-right">
                  <p className="text-xs opacity-80">Bağış No</p>
                  <p className="font-mono text-sm">{serialNumber}</p>
                </div>
              </div>

              <label className="text-xs font-semibold uppercase tracking-wider opacity-80">Bağışçı</label>
              <div className="w-full text-2xl font-bold text-white mt-1 p-2 rounded-md donor-input-display truncate">
                {displayName}
              </div>
            </div>
          </div>

          {/* ALT KISIM */}
          <div className="p-6 bg-slate-50 relative">
            {/* FORMA GÖRSELİ */}
            <div className="absolute -top-16 right-6 w-32 h-32 bg-white rounded-xl shadow-xl p-3 border-4 border-slate-50">
              <Image src={jerseyImg} alt={teamName} width={128} height={128} className="w-full h-full object-contain" />
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-bold text-slate-800">{teamName}</h3>
              {/* DÜZELTME: Metin güncellendi */}
              <p className="text-sm text-slate-500">Çocuk Forması Bağışı</p>
            </div>

            <div className="border-t my-4"></div>

            {/* Adet ve Onay Durumu */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Adet:</label>
                <span className="w-16 px-2 py-1 border border-slate-300 rounded-md text-sm font-medium text-center bg-white">
                  {qty}
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--team-accent)', color: 'var(--team-primary)' }} className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <span>Onaylandı</span>
              </div>
            </div>

            {/* TEŞEKKÜR MESAJI KUTUSU */}
            <div className="mt-6 bg-white p-4 rounded-lg border border-slate-200">
              <p className="text-sm text-center text-slate-600 leading-relaxed">
                Yaptığınız bu değerli bağışla bir çocuğumuzun hayallerine ortak oldunuz.
                <span className="font-semibold" style={{ color: 'var(--team-primary)' }}> Askıda Forma</span> ailesi olarak size yürekten teşekkür ederiz.
              </p>
            </div>

            {/* LOGOLU KART ALT BİLGİSİ */}
            <div className="border-t mt-6 pt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Image src="/askida-forma.svg" alt="Askıda Forma Logosu" width={20} height={20} />
                <span className="text-xs font-semibold text-slate-600">Askıda Forma</span>
              </div>
              <p className="text-xs text-slate-400">{cardDate}</p>
            </div>
          </div>
        </div>
        
        {/* Aksiyon Butonları */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadCard}
              disabled={isGenerating}
              className="bg-gray-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <FontAwesomeIcon icon={isGenerating ? faSpinner : faDownload} className={isGenerating ? 'animate-spin' : ''} />
              İndir
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(v => !v)}
                className="w-full bg-white text-gray-800 border border-gray-200 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faShareNodes} />
                Paylaş
              </button>

              {showShareMenu && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-20">
                  <button onClick={() => shareTo('instagram')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm transition">
                    <FontAwesomeIcon icon={faInstagram} className="text-pink-500 w-4" />
                    Instagram
                  </button>
                  <button onClick={() => shareTo('twitter')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm transition border-t">
                    <FontAwesomeIcon icon={faTwitter} className="text-blue-400 w-4" />
                    Twitter
                  </button>
                  <button onClick={() => shareTo('whatsapp')} className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm transition border-t">
                    <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 w-4" />
                    WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onFinish}
            style={{ backgroundColor: primary }}
            className="w-full text-white font-medium py-3 px-4 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faHome} />
            Anasayfa
          </button>
        </div>

        {showShareMenu && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowShareMenu(false)}
          />
        )}
      </div>
    </div>
  );
}