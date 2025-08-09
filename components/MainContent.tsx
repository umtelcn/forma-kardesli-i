'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGift,
  faListCheck,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import FormaKartlar from './FormaKartlar';
import SonBagislar from './SonBagislar';
import SssFooter from './SssFooter';
import { Team, Donation, Total, RecentDonation } from '../lib/types';

// Helper: Renk stilleri
function getColorClasses(color: string) {
  const colorMap = {
    emerald: {
      gradient: 'from-emerald-400 to-emerald-600',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
    },
    blue: {
      gradient: 'from-blue-400 to-blue-600',
      border: 'border-blue-200',
      text: 'text-blue-700',
    },
    purple: {
      gradient: 'from-purple-400 to-purple-600',
      border: 'border-purple-200',
      text: 'text-purple-700',
    },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
}

interface TabData {
  id: string;
  label: string;
  icon: any;
  color: string;
}

interface TabButtonProps {
  tab: TabData;
  isActive: boolean;
  onClick: () => void;
}

// Masaüstü sekme butonu
function TabButtonDesktop({ tab, isActive, onClick }: TabButtonProps) {
  const colorClasses = getColorClasses(tab.color);
  return (
    <button
      onClick={onClick}
      className="relative z-10 flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 group"
    >
      <div
        className={`p-2 rounded-lg transition-all duration-300 ${
          isActive
            ? `bg-gradient-to-br ${colorClasses.gradient} shadow-sm`
            : 'bg-gray-100 group-hover:bg-gray-200'
        }`}
      >
        <FontAwesomeIcon
          icon={tab.icon}
          className={`text-base transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
          }`}
        />
      </div>
      <span
        className={`font-semibold text-sm transition-colors duration-300 ${
          isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
        }`}
      >
        {tab.label}
      </span>
    </button>
  );
}

// Mobil sekme butonu
function TabButtonMobile({ tab, isActive, onClick }: TabButtonProps) {
  const colorClasses = getColorClasses(tab.color);
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 px-4 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 min-w-24 ${
        isActive
          ? `bg-white shadow-lg border-2 ${colorClasses.border}`
          : 'bg-white/80 border-2 border-gray-200 hover:bg-white hover:shadow-md'
      }`}
    >
      <div
        className={`p-2 rounded-xl transition-all duration-300 ${
          isActive ? `bg-gradient-to-br ${colorClasses.gradient} shadow-sm` : 'bg-gray-100'
        }`}
      >
        <FontAwesomeIcon
          icon={tab.icon}
          className={`text-sm transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-600'
          }`}
        />
      </div>
      <span
        className={`text-xs font-medium transition-colors duration-300 text-center leading-tight ${
          isActive ? colorClasses.text : 'text-gray-600'
        }`}
      >
        {tab.label}
      </span>
    </button>
  );
}

// "Çok Yakında" alanı
function ComingSoonSection() {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 rounded-3xl shadow-lg border border-gray-100">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl shadow-purple-500/25 mb-8">
        <FontAwesomeIcon icon={faImages} className="text-white text-4xl drop-shadow-sm" />
      </div>
      <h3 className="text-4xl font-bold text-gray-800 mb-4">Çok Yakında!</h3>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Bu bölüm, bağışlarınızla formalarına kavuşan çocukların mutluluk anılarıyla dolacak.
      </p>
    </div>
  );
}

interface MainContentProps {
  onStartDonation: (d: Donation) => void;
  initialTab: string;
  onAdminClick: () => void;
}

export default function MainContent({
  onStartDonation,
  initialTab,
  onAdminClick,
}: MainContentProps) {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [teams, setTeams] = useState<Team[]>([]);
  const [totals, setTotals] = useState<Total[]>([]);
  const [recentDonations, setRecentDonations] = useState<RecentDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [teamsRes, totalsRes, donationsRes] = await Promise.all([
        supabase.from('teams').select('*').order('name'),
        supabase.rpc('get_team_donation_totals'),
        supabase.from('donations').select('*, teams(*), donors(*)')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (!teamsRes.error) setTeams(teamsRes.data || []);
      if (!totalsRes.error) setTotals(totalsRes.data || []);
      if (!donationsRes.error) setRecentDonations(donationsRes.data as RecentDonation[]);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const tabs: TabData[] = [
    { id: 'donate', label: 'Forma Bağışla', icon: faGift, color: 'emerald' },
    { id: 'donations', label: 'Bağış Listesi', icon: faListCheck, color: 'blue' },
    { id: 'happiness', label: 'Mutluluk Galerisi', icon: faImages, color: 'purple' },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Masaüstü sekmeler */}
      <div className="hidden md:block mb-8">
        <div className="relative bg-gray-50 p-2 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex relative">
            <div
              className="absolute top-0 bottom-0 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 ease-out"
              style={{
                left: `${tabs.findIndex((tab) => tab.id === currentTab) * (100 / tabs.length)}%`,
                width: `${100 / tabs.length}%`,
              }}
            />
            {tabs.map((tab) => (
              <TabButtonDesktop
                key={tab.id}
                tab={tab}
                isActive={currentTab === tab.id}
                onClick={() => setCurrentTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobil sekmeler */}
      <div className="md:hidden mb-8">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 px-1 pb-1" style={{ width: 'max-content' }}>
            {tabs.map((tab) => (
              <TabButtonMobile
                key={tab.id}
                tab={tab}
                isActive={currentTab === tab.id}
                onClick={() => setCurrentTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
              <span>Yükleniyor...</span>
            </div>
          </div>
        )}

        {currentTab === 'donate' && (
          <div className="animate-fadeIn">
            <FormaKartlar onStartDonation={onStartDonation} />
            <SssFooter onAdminClick={onAdminClick} />
          </div>
        )}
        {currentTab === 'donations' && (
          <div className="animate-fadeIn">
            <SonBagislar
              teams={teams}
              totals={totals}
              recentDonations={recentDonations}
            />
          </div>
        )}
        {currentTab === 'happiness' && (
          <div className="animate-fadeIn">
            <ComingSoonSection />
          </div>
        )}
      </div>
    </main>
  );
}