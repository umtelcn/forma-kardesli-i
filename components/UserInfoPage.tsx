'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '../lib/supabase';
import { Donation } from '../lib/types';

interface UserInfoPageProps {
  donation: Donation;
  onBack: () => void;
  onComplete: () => void;
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
      donorInfo.surname = formData.surname || '';
      donorInfo.display_name = `${donorInfo.name} ${donorInfo.surname}`.trim();
    } else {
      const handle = (formData.handle || 'kullanici').replace(/^@/, '');
      donorInfo.display_name = `@${handle}`;
      donorInfo[`${identityType}_handle`] = handle;
      donorInfo.name = `@${handle}`;
      donorInfo.surname = '';
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

      onComplete();
    } catch (error: any) {
      alert(`Bir hata oluştu: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonClass = (type: IdentityType) =>
    identityType === type
      ? 'bg-emerald-600 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

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
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center ${getButtonClass('name')}`}
          >
            <FontAwesomeIcon icon={faUser} className="mb-1" />
            Ad Soyad
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('instagram')}
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center ${getButtonClass('instagram')}`}
          >
            <FontAwesomeIcon icon={faInstagram} className="mb-1" />
            Instagram
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('twitter')}
            className={`py-3 px-2 rounded-lg text-sm flex flex-col items-center ${getButtonClass('twitter')}`}
          >
            <FontAwesomeIcon icon={faTwitter} className="mb-1" />
            Twitter/X
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
                className="w-full p-3 border rounded-lg"
                placeholder="Adınız"
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Soyadınız"
              />
            </>
          )}

          {(identityType === 'instagram' || identityType === 'twitter') && (
            <input
              type="text"
              name="handle"
              value={formData.handle}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg"
              placeholder="@kullaniciadiniz"
            />
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-lg"
            placeholder="E-posta (isteğe bağlı)"
          />

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 bg-gray-200 text-gray-700 py-3 rounded-xl"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-emerald-600 text-white py-3 rounded-xl"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Bağışı Tamamla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}