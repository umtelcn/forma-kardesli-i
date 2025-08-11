'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '../lib/supabase';
import { Donation } from '../lib/types';

interface UserInfoPageProps {
  donation: Donation;
  onBack: () => void;
  // This interface is updated to specify that onComplete will receive the donor's data.
  onComplete: (donorInfo: any) => void;
}

type IdentityType = 'name' | 'instagram' | 'twitter';

export default function UserInfoPage({ donation, onBack, onComplete }: UserInfoPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identityType, setIdentityType] = useState<IdentityType>('name');
  const [formData, setFormData] = useState({ name: '', surname: '', email: '', handle: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare the donor information object to be saved and passed on.
    const donorInfo: any = {
      name: '',
      surname: '',
      email: formData.email || null,
      instagram_handle: null,
      twitter_handle: null,
      display_name: '',
      identity_type: identityType,
    };

    if (identityType === 'name') {
      donorInfo.name = formData.name || 'İsimsiz';
      donorInfo.surname = formData.surname || 'Kahraman';
      donorInfo.display_name = `${donorInfo.name} ${donorInfo.surname}`.trim();
    } else {
      const handle = (formData.handle || 'kullanici').replace(/^@/, '');
      donorInfo.display_name = `@${handle}`;
      donorInfo[`${identityType}_handle`] = handle;
      donorInfo.name = `@${handle}`;
      // A placeholder is added to the surname field to prevent database errors.
      donorInfo.surname = `(${identityType === 'instagram' ? 'Instagram' : 'Twitter/X'})`;
    }

    try {
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .upsert(donorInfo, { onConflict: 'email' })
        .select()
        .single();

      if (donorError) throw donorError;

      const { error: donationError } = await supabase.from('donations').insert({
        donor_id: donorData.id,
        team_id: donation.teamId,
        type: donation.type,
        quantity: donation.quantity,
        amount_tl: donation.total,
      });

      if (donationError) throw donationError;

      // **CRITICAL FIX:** Pass the collected user info to the parent component.
      // This makes the data available for the ThankYouPage.
      onComplete(donorInfo);

    } catch (error: any) {
      alert(`Bir hata oluştu: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonClass = (type: IdentityType) =>
    identityType === type
      ? 'bg-emerald-600 text-white shadow-md'
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200';

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-emerald-600 mb-2 text-center">Adım 2 / 3</p>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Bağışçı Bilgileriniz</h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Bağış listesinde hangi bilginiz görünsün?
        </p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setIdentityType('name')}
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center justify-center gap-1 transition-all ${getButtonClass('name')}`}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Ad Soyad</span>
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('instagram')}
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center justify-center gap-1 transition-all ${getButtonClass('instagram')}`}
          >
            <FontAwesomeIcon icon={faInstagram} />
            <span>Instagram</span>
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('twitter')}
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center justify-center gap-1 transition-all ${getButtonClass('twitter')}`}
          >
            <FontAwesomeIcon icon={faTwitter} />
            <span>Twitter/X</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {identityType === 'name' && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg shadow-sm"
                placeholder="Adınız"
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg shadow-sm"
                placeholder="Soyadınız (isteğe bağlı)"
              />
            </>
          )}

          {(identityType === 'instagram' || identityType === 'twitter') && (
            <input
              type="text"
              name="handle"
              value={formData.handle}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg shadow-sm"
              placeholder="@kullaniciadiniz"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg shadow-sm"
            placeholder="E-posta (isteğe bağlı)"
          />

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-300 transition"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-emerald-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                'Bağışı Tamamla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
