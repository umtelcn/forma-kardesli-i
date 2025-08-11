// components/TeamCard.tsx
'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProductWithTeam, Donation } from '../lib/types';

interface TeamCardProps {
  product: ProductWithTeam;
  onStartDonation: (d: Donation) => void;
}

// Helper function to prevent text from being unreadable on very light backgrounds
function ensureContrast(bg: string, fallback = '#1f2937') {
  try {
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.8 ? fallback : bg; // If color is too light, use the dark gray fallback
  } catch {
    return fallback;
  }
}

export default function TeamCard({ product, onStartDonation }: TeamCardProps) {
  const [quantity, setQuantity] = useState(1);

  const team = product.teams;
  const primaryColorRaw = team.primary_color || '#4A5568';
  const primaryColor = ensureContrast(primaryColorRaw);
  const secondaryColor = team.secondary_color || '#FFFFFF';

  const price = product.price ?? 0;

  // Memoize the currency formatter for performance
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 0,
      }),
    []
  );

  const total = quantity * price;

  const handleDecrement = () => setQuantity((p) => (p > 1 ? p - 1 : 1));
  const handleIncrement = () => setQuantity((p) => (p < 10 ? p + 1 : 10));

  return (
    <article
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg flex flex-col"
      style={{ borderTop: `6px solid ${primaryColor}` }}
    >
      {/* Product Image */}
      <div className="relative w-full bg-gray-50">
        <div className="relative mx-auto w-full max-w-[520px] aspect-[16/10]">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.description || `${team.name} ürünü`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, (max-width:1024px) 60vw, 520px"
              priority
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <span>Görsel Yükleniyor...</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Header and Logo */}
        <div className="flex items-center gap-2">
          {team.logo_url ? (
            <Image
              src={team.logo_url}
              alt={`${team.name} logosu`}
              width={28}
              height={28}
              className="object-contain shrink-0"
            />
          ) : (
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gray-500">
                {team.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <h3 className="text-lg font-bold tracking-tight text-gray-900 truncate">
            {team.name}
          </h3>
        </div>

        {/* Description and Tags */}
        {product.description && (
          <p className="mt-2 text-sm text-gray-700 line-clamp-2 h-10">
            {product.description}
          </p>
        )}
        {product.age_range && (
          <div className="mt-2">
            <span className="inline-block text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
              {product.age_range}
            </span>
          </div>
        )}

        {/* Price / Quantity / Total */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500">Fiyat</p>
              <p className="text-2xl font-extrabold text-gray-900 leading-none">
                {formatter.format(price)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Toplam</p>
              <p
                className="text-xl font-bold text-gray-900 leading-none"
                aria-live="polite"
              >
                {formatter.format(total)}
              </p>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-gray-700">Adet</span>
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
              <button
                onClick={handleDecrement}
                className="w-11 h-11 rounded-full transition hover:opacity-90 disabled:opacity-40 grid place-items-center text-sm"
                style={{ backgroundColor: primaryColor, color: secondaryColor }}
                aria-label="Adet Azalt"
                disabled={quantity <= 1}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span
                className="w-10 text-center text-base font-bold text-gray-900"
                aria-live="polite"
                aria-atomic="true"
              >
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-11 h-11 rounded-full transition hover:opacity-90 disabled:opacity-40 grid place-items-center text-sm"
                style={{ backgroundColor: primaryColor, color: secondaryColor }}
                aria-label="Adet Artır"
                disabled={quantity >= 10}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() =>
              onStartDonation({
                type: 'jersey',
                teamId: team.id,
                teamName: `${team.name}${
                  product.description ? ` (${product.description})` : ''
                }`,
                quantity,
                total,
                imageUrl: product.image_url,
                // DÜZELTME: Teşekkür kartının doğru renklenmesi için
                // bu bilgileri de gönderiyoruz.
                teamLogo: team.logo_url,
                primaryColor: team.primary_color,
                secondaryColor: team.secondary_color,
              })
            }
            className="w-full mt-1 text-base font-bold py-3 rounded-xl transition-transform hover:scale-[1.015] active:scale-[0.99] shadow-sm"
            style={{ backgroundColor: primaryColor, color: secondaryColor }}
          >
            Askıya Bırak
          </button>
        </div>
      </div>
    </article>
  );
}
