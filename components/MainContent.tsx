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

// #region Helper Functions & Components (Moved outside for better organization)

// Helper function to get color styles for tabs
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

// Data structure for a tab
interface TabData {
  id: string;
  label: string;
  icon: any;
  description: string;
  color: string;
}

interface TabButtonProps {
  tab: TabData;
  isActive: boolean;
  onClick: () => void;
}

// Desktop Tab Button Component
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
      <div className="text-left min-w-0">
        <div
          className={`font-semibold text-sm transition-colors duration-300 ${
            isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
          }`}
        >
          {tab.label}
        </div>
        <div
          className={`text-xs mt-0.5 transition-colors duration-300 ${
            isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
          }`}
        >
          {tab.description}
        </div>
      </div>
    </button>
  );
}

// Mobile Tab Button Component
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

// "Coming Soon" Placeholder Component
function ComingSoonSection() {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-white via-gray-50 to-purple-50/30 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/20 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl shadow-purple-500/25 mb-8">
          <FontAwesomeIcon icon={faImages} className="text-white text-4xl drop-shadow-sm" />
        </div>
        <div className="space-y-4 mb-8">
          <h3 className="text-4xl font-bold text-gray-800 tracking-tight">
            Çok Yakında!
          </h3>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mx-auto"></div>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Bu bölüm, bağışlarınızla formalarına kavuşan çocukların paha biçilmez
          sevinçlerini yansıtan fotoğraf ve videolarla dolacak.
        </p>
        <div className="flex items-center justify-center gap-2 text-purple-600">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-sm font-medium">Hazırlanıyor</span>
        </div>
      </div>
    </div>
  );
}

// #endregion

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
        supabase
          .from('donations')
          .select('*, teams(*), donors(*)') // Fetch all related data
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (teamsRes.error) throw teamsRes.error;
      setTeams(teamsRes.data || []);

      if (totalsRes.error) throw totalsRes.error;
      setTotals(totalsRes.data || []);

      if (donationsRes.error) throw donationsRes.error;
      // The data from Supabase should already match the RecentDonation type if the select query is correct.
      // No need for manual mapping.
      setRecentDonations((donationsRes.data as RecentDonation[]) || []);

    } catch (error) {
      console.error('Veri yüklenirken bir hata oluştu:', error);
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
    { id: 'donate', label: 'Forma Bağışla', icon: faGift, description: 'Çocuklara forma hediye edin', color: 'emerald' },
    { id: 'donations', label: 'Bağış Listesi', icon: faListCheck, description: 'Son yapılan bağışları görüntüleyin', color: 'blue' },
    { id: 'happiness', label: 'Mutluluk Galerisi', icon: faImages, description: 'Çocukların sevinç dolu anları', color: 'purple' },
  ];

  const activeTab = tabs.find((t) => t.id === currentTab) || tabs[0];

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Modern Tab Navigation */}
      <div className="mb-8">
        {/* Desktop Tabs */}
        <div className="hidden md:block">
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

        {/* Mobile Tabs */}
        <div className="md:hidden">
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

        {/* Tab Content Header */}
        <div className="mt-6 mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${getColorClasses(activeTab.color).gradient} shadow-sm`}>
              <FontAwesomeIcon icon={activeTab.icon} className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{activeTab.label}</h2>
              <p className="text-gray-600 text-sm">{activeTab.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
              <span>Yükleniyor...</span>
            </div>
          </div>
        )}

        <div className="transition-all duration-300 ease-out">
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
      </div>
    </main>
  );
}
