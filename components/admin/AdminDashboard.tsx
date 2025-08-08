// components/admin/AdminDashboard.tsx
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faShirt,
  faPen,
  faImage,
  faUsers,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import TeamAddForm from './TeamAddForm';
import ProductAddForm from './ProductAddForm';
import DonorManager from './DonorManager'; // Yeni bileşeni import et

type AdminView = 'dashboard' | 'teamAdd' | 'productAdd' | 'donorManager'; // Yeni view eklendi

// Henüz oluşturulmamış bileşenler için bir yer tutucu
const Placeholder = ({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) => (
  <div className="bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
    <button
      onClick={onBack}
      className="text-sm text-gray-600 hover:text-emerald-600 font-semibold mb-6 flex items-center"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
      Geri Dön
    </button>
    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
    <p className="text-gray-600 mt-4">Bu özellik yakında aktif olacaktır.</p>
  </div>
);

export default function AdminDashboard() {
  const [view, setView] = useState<AdminView>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'teamAdd':
        return <TeamAddForm onBack={() => setView('dashboard')} />;
      case 'productAdd':
        return <ProductAddForm onBack={() => setView('dashboard')} />;
      case 'donorManager':
        return <DonorManager onBack={() => setView('dashboard')} />;
      default:
        // Ana Pano (Dashboard) görünümü
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            <DashboardButton
              title="Yeni Takım Ekle"
              icon={faPlus}
              onClick={() => setView('teamAdd')}
            />
            <DashboardButton
              title="Yeni Forma Ekle"
              icon={faShirt}
              onClick={() => setView('productAdd')}
            />
            <DashboardButton
              title="Bağışçıları Yönet"
              icon={faUsers}
              onClick={() => setView('donorManager')}
            />
            {/* Diğer butonlar ileride buraya eklenecek */}
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Yönetim Panosu
      </h2>
      {renderView()}
    </div>
  );
}

// Pano butonları için yardımcı bileşen
const DashboardButton = ({ title, icon, onClick }: any) => (
  <button
    onClick={onClick}
    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center"
  >
    <FontAwesomeIcon icon={icon} className="text-3xl text-emerald-600 mb-4" />
    <span className="font-bold text-gray-800">{title}</span>
  </button>
);
