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

export default function UserInfoPage({
  donation,
  onBack,
  onComplete,
}: UserInfoPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [identityType, setIdentityType] = useState<IdentityType>('name');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    handle: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // GÜNCELLENMİŞ handleSubmit Fonksiyonu
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const donorInfo: {
      name: string;
      surname: string;
      email?: string | null;
      instagram_handle?: string | null;
      twitter_handle?: string | null;
      display_name: string;
      identity_type: IdentityType;
    } = {
      name: '',
      surname: '',
      email: formData.email || null,
      instagram_handle: null,
      twitter_handle: null,
      display_name: '',
      identity_type: identityType,
    };

    switch (identityType) {
      case 'name':
        donorInfo.name = formData.name || 'İsimsiz';
        donorInfo.surname = formData.surname || 'Kahraman';
        donorInfo.display_name =
          `${donorInfo.name} ${donorInfo.surname}`.trim();
        break;

      case 'instagram':
      case 'twitter': // Instagram ve Twitter durumları birleştirildi
        const handle = formData.handle || 'isimsiz_kullanici';
        donorInfo.display_name = handle;
        // Dinamik olarak doğru alanı doldur: 'instagram_handle' veya 'twitter_handle'
        donorInfo[`${identityType}_handle`] = handle;

        // Eski 'name' ve 'surname' alanları için varsayılan değerler
        donorInfo.name = `@${handle}`;
        donorInfo.surname = `(${
          identityType.charAt(0).toUpperCase() + identityType.slice(1)
        })`;
        break;
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

  const getButtonClass = (type: IdentityType) => {
    return identityType === type
      ? 'bg-emerald-600 text-white'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="max-w-lg mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-xl">
        <p className="text-sm font-semibold text-emerald-600 mb-2 text-center">
          Adım 2 / 3
        </p>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Bağışçı Bilgileriniz
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Bağışınızı nasıl göstermek istersiniz?
        </p>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => setIdentityType('name')}
            className={`font-medium py-3 px-2 rounded-lg transition text-sm flex items-center justify-center ${getButtonClass(
              'name'
            )}`}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" /> Ad & Soyad
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('instagram')}
            className={`font-medium py-3 px-2 rounded-lg transition text-sm flex items-center justify-center ${getButtonClass(
              'instagram'
            )}`}
          >
            <FontAwesomeIcon icon={faInstagram} className="mr-2" /> Instagram
          </button>
          <button
            type="button"
            onClick={() => setIdentityType('twitter')}
            className={`font-medium py-3 px-2 rounded-lg transition text-sm flex items-center justify-center ${getButtonClass(
              'twitter'
            )}`}
          >
            <FontAwesomeIcon icon={faTwitter} className="mr-2" /> Twitter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {identityType === 'name' && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Adınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="İsteğe Bağlı"
                />
              </div>
              <div>
                <label
                  htmlFor="surname"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Soyadınız
                </label>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="İsteğe Bağlı"
                />
              </div>
            </>
          )}

          {(identityType === 'instagram' || identityType === 'twitter') && (
            <div>
              <label
                htmlFor="handle"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                {identityType === 'instagram' ? 'Instagram' : 'Twitter'}{' '}
                Kullanıcı Adınız
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  @
                </div>
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  value={formData.handle}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-7 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
                  placeholder="kullaniciadiniz"
                />
              </div>
            </div>
          )}

          <hr className="my-4" />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              E-posta Adresiniz
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="bağış takibi için önerilir"
            />
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-300 transition"
            >
              Geri
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex justify-center items-center disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="loader-small"></div>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPaperPlane}
                    className="mr-2 w-5 h-5"
                  />
                  Bağışı Tamamla
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
