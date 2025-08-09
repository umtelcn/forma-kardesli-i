// components/SonBagislar.tsx
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faList,
  faUser,
  faMedal,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Team, Total, RecentDonation } from '../lib/types';

// Donor kimliğini render eden yardımcı bileşen
const DonorIdentifier = ({ donor }: { donor: RecentDonation['donors'] }) => {
  const commonClasses = 'flex items-center gap-2 font-semibold text-gray-800';
  
  if (!donor) {
    return (
      <div className={commonClasses}>
        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
        <span>Anonim</span>
      </div>
    );
  }

  // DÜZELTME: Gelen veriyi daha doğru işleyen mantık
  switch (donor.identity_type) {
    case 'instagram':
      // Eğer instagram_handle alanı doluysa onu kullan, değilse display_name'i kullan
      const instagramHandle = donor.instagram_handle || donor.display_name;
      if (!instagramHandle) break; // Eğer ikisi de boşsa, varsayılana düş
      return (
        <a
          href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonClasses} text-pink-600 hover:underline`}
        >
          <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
          <span>@{instagramHandle.replace('@', '')}</span>
        </a>
      );
    case 'twitter':
      // Eğer twitter_handle alanı doluysa onu kullan, değilse display_name'i kullan
      const twitterHandle = donor.twitter_handle || donor.display_name;
      if (!twitterHandle) break; // Eğer ikisi de boşsa, varsayılana düş
      return (
        <a
          href={`https://twitter.com/${twitterHandle.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonClasses} text-sky-500 hover:underline`}
        >
          <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
          <span>@{twitterHandle.replace('@', '')}</span>
        </a>
      );
    case 'name':
    default:
      // display_name doluysa onu, değilse ad ve soyadı birleştirerek göster
      const displayName = donor.display_name || `${donor.name || ''} ${donor.surname || ''}`.trim();
      return (
        <div className={commonClasses}>
          <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
          <span>{displayName || 'İsimsiz Kahraman'}</span>
        </div>
      );
  }

  // Herhangi bir bilgi bulunamazsa gösterilecek varsayılan durum
  return (
    <div className={commonClasses}>
      <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
      <span>İsimsiz Kahraman</span>
    </div>
  );
};

export default function SonBagislar({
  teams,
  totals,
  recentDonations,
}: SonBagislarProps) {
  const [filter, setFilter] = useState<'recent' | 'most'>('recent');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(10);

  const sortedTotals = [...totals].sort(
    (a, b) => (b.total_jerseys || 0) - (a.total_jerseys || 0)
  );

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-500';
    return 'hidden';
  };

  const getFullFilteredDonations = useCallback(() => {
    if (!recentDonations || recentDonations.length === 0) {
      return [];
    }
    let filtered = [...recentDonations];
    if (selectedTeam !== 'all') {
      filtered = filtered.filter((d) => d.teams?.name === selectedTeam);
    }
    if (filter === 'most') {
      filtered.sort((a, b) => b.amount_tl - a.amount_tl);
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return filtered;
  }, [recentDonations, filter, selectedTeam]);

  const allFilteredDonations = getFullFilteredDonations();
  const visibleDonations = allFilteredDonations.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="animate-fadeIn space-y-12">
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FontAwesomeIcon icon={faTrophy} className="text-amber-500 w-7 h-7" />
          Takımların Forma Katkıları
        </h3>
        {sortedTotals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedTotals.map((t, index) => (
              <div
                key={t.name}
                className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between transition-transform hover:scale-105"
              >
                <div className="flex items-center space-x-3">
                  <FontAwesomeIcon
                    icon={faMedal}
                    className={`w-6 h-6 ${getMedalColor(index)}`}
                  />
                  {t.logo_url ? (
                    <Image
                      src={t.logo_url}
                      alt={`${t.name} logosu`}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {t.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <p className="text-lg font-bold text-gray-700">{t.name}</p>
                </div>
                <p className="text-4xl font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {t.total_jerseys || 0}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Henüz takım katkısı bulunmuyor.</p>
          </div>
        )}
      </div>

      <div>
        <div className="md:flex justify-between items-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3 mb-4 md:mb-0">
            <FontAwesomeIcon
              icon={faList}
              className="text-emerald-600 w-7 h-7"
            />
            Son Bağışlar
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setVisibleCount(10);
              }}
              className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Tüm Takımlar</option>
              {teams.map((team) => (
                <option key={team.id} value={team.name}>
                  {team.name}
                </option>
              ))}
            </select>
            <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-100">
              <button
                onClick={() => {
                  setFilter('recent');
                  setVisibleCount(10);
                }}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                  filter === 'recent'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-600'
                }`}
              >
                En Yeni
              </button>
              <button
                onClick={() => {
                  setFilter('most');
                  setVisibleCount(10);
                }}
                className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                  filter === 'most'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-600'
                }`}
              >
                En Yüksek
              </button>
            </div>
          </div>
        </div>

        {visibleDonations.length > 0 ? (
          <div className="space-y-3">
            {visibleDonations.map((d, i) => (
              <div
                key={i} // Benzersiz bir ID kullanmak daha iyidir, örneğin d.id
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {d.teams?.logo_url ? (
                    <Image
                      src={d.teams.logo_url}
                      alt={`${d.teams.name} logosu`}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {d.teams?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <DonorIdentifier donor={d.donors} />
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(d.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })} • {d.teams?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg rounded-full px-3 py-1 ${
                      d.type === 'jersey'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {d.type === 'jersey'
                      ? `${d.quantity || 0} Forma`
                      : `${d.amount_tl} TL`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FontAwesomeIcon icon={faList} className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Henüz bağış bulunmuyor</p>
            <p className="text-sm mt-2">
              {selectedTeam !== 'all' 
                ? `${selectedTeam} takımı için bağış bulunamadı.`
                : 'İlk bağışçı siz olun!'
              }
            </p>
          </div>
        )}

        {visibleCount < allFilteredDonations.length && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors flex items-center justify-center mx-auto"
            >
              <FontAwesomeIcon icon={faChevronDown} className="mr-2 h-4 w-4" />
              Daha Fazla Göster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
