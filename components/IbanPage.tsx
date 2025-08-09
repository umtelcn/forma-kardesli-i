// components/IbanPage.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCopy,
  faCheck,
  faCircleInfo,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Donation } from '../lib/types';

interface IbanPageProps {
  donation: Donation;
  onBack: () => void;
  onContinue: () => void;
}

export default function IbanPage({
  donation,
  onBack,
  onContinue,
}: IbanPageProps) {
  const [isAlıcıCopied, setIsAlıcıCopied] = useState(false);
  const [isIbanCopied, setIsIbanCopied] = useState(false);

  const aliciAdi = 'Çocuklar Üşümesin Yardımlaşma ve Dayanışma Derneği';
  const iban = 'TR36 0001 0011 5098 1058 3050 01';

  const handleCopy = (textToCopy: string, type: 'alici' | 'iban') => {
    navigator.clipboard.writeText(textToCopy);
    if (type === 'alici') {
      setIsAlıcıCopied(true);
      setTimeout(() => setIsAlıcıCopied(false), 2000);
    } else {
      setIsIbanCopied(true);
      setTimeout(() => setIsIbanCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-500 mb-2">Adım 1 / 3</div>
          <h1 className="text-3xl font-bold text-gray-900">
            Banka Bilgileri
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Donation Summary */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-lg p-2 border border-gray-200 flex items-center justify-center">
                <Image
                  src={donation.imageUrl || ''}
                  alt={donation.teamName || ''}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm mb-1">
                  {donation.type === 'jersey'
                    ? `${donation.quantity} Adet ${donation.teamName} Forması`
                    : `${donation.teamName} Havuzuna Nakdi Yardım`}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {donation.total.toFixed(2)} TL
                </p>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="p-6 space-y-6">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alıcı Adı
              </label>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4 pr-28">
                  <p className="text-gray-900 text-sm font-medium truncate">
                    {aliciAdi}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(aliciAdi, 'alici')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isAlıcıCopied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={isAlıcıCopied ? faCheck : faCopy}
                    className="w-3 h-3 mr-1.5"
                  />
                  {isAlıcıCopied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

            {/* IBAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN Numarası
              </label>
              <div className="relative">
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4 pr-28">
                  <p className="font-mono text-gray-900 text-sm font-semibold">
                    {iban}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(iban, 'iban')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    isIbanCopied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon
                    icon={isIbanCopied ? faCheck : faCopy}
                    className="w-3 h-3 mr-1.5"
                  />
                  {isIbanCopied ? 'Kopyalandı' : 'Kopyala'}
                </button>
              </div>
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex gap-3">
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Bilgilendirme</p>
                  <p>
                    Alıcı adı kısmına {'"Çocuklar Üşümesin"'}
                    yazmanız yeterlidir. 
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50/75 rounded-b-lg">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
                Geri
              </button>
              <button
                onClick={onContinue}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4" />
                Havale/EFT Yaptım, Devam Et
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
