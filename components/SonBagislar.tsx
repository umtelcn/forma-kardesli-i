// components/SonBagislar.tsx
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrophy,
  faList,
  faUser,
  faMedal,
  faChevronDown, // "Daha Fazla Göster" butonu için ikon
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Team, Total, RecentDonation } from '../lib/types';

interface SonBagislarProps {
  teams: Team[];
  totals: Total[];
  recentDonations: RecentDonation[];
}

// Donor kimliğini render eden yardımcı bileşen
const DonorIdentifier = ({ donors }: { donors: RecentDonation['donors'] }) => {
  const commonClasses = 'flex items-center gap-2 font-semibold text-gray-800';
  
  // İlk donor'ı al (çünkü donors bir array)
  const firstDonor = donors[0];
  if (!firstDonor) {
    return (
      <div className={commonClasses}>
        <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
        <span>Anonim</span>
      </div>
    );
  }

  switch (firstDonor.identity_type) {
    case 'instagram':
      return (
        <a
          href={`https://instagram.com/${firstDonor.display_name.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonClasses} text-pink-600 hover:underline`}
        >
          <FontAwesomeIcon icon={faInstagram} className="w-4 h-4" />
          <span>@{firstDonor.display_name.replace('@', '')}</span>
        </a>
      );
    case 'twitter':
      return (
        <a
          href={`https://twitter.com/${firstDonor.display_name.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${commonClasses} text-sky-500 hover:underline`}
        >
          <FontAwesomeIcon icon={faTwitter} className="w-4 h-4" />
          <span>@{firstDonor.display_name.replace('@', '')}</span>
        </a>
      );
    case 'name':
    default:
      return (
        <div className={commonClasses}>
          <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-gray-400" />
          <span>{firstDonor.display_name}</span>
        </div>
      );
  }
};

export default function SonBagislar({
  teams,
  totals,
  recentDonations,
}: SonBagislarProps) {
  const [filter, setFilter] = useState<'recent' | 'most'>('recent');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  // YENİ: Görünen bağış sayısını tutan state
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

  // Filtrelenmiş ve sıralanmış tüm bağışları döndüren fonksiyon
  const getFullFilteredDonations = useCallback(() => {
    let filtered = [...recentDonations];

    if (selectedTeam !== 'all') {
      filtered = filtered.filter((d) => 
        d.teams.some(team => team.name === selectedTeam)
      );
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
    // Her tıklandığında 10 daha göster
    setVisibleCount((prevCount) => prevCount + 10);
  };

  return (
    <div className="animate-fadeIn space-y-12">
      {/* Toplam forma bağışları */}
      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FontAwesomeIcon icon={faTrophy} className="text-amber-500 w-7 h-7" />
          Takımların Forma Katkıları
        </h3>
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
      </div>

      {/* Son Bağışlar Bölümü */}
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
                setVisibleCount(10); // Filtre değiştiğinde sayacı sıfırla
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
                  setVisibleCount(10); // Filtre değiştiğinde sayacı sıfırla
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
                  setVisibleCount(10); // Filtre değiştiğinde sayacı sıfırla
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

        <div className="space-y-3">
          {visibleDonations.map((d, i) => {
            // İlk takımı al (teams array olduğu için)
            const firstTeam = d.teams[0];
            if (!firstTeam) return null;

            return (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  {firstTeam.logo_url ? (
                    <Image
                      src={firstTeam.logo_url}
                      alt={`${firstTeam.name} logosu`}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-500">
                        {firstTeam.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <DonorIdentifier donors={d.donors} />
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(d.created_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
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
                      ? `${d.quantity} Forma`
                      : `${d.amount_tl} TL`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* YENİ: "Daha Fazla Göster" Butonu */}
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