// components/FormaKartlar.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import TeamCard from './TeamCard';
import PoolDonationCard from './PoolDonationCard';
import { ProductWithTeam, Team, Donation } from '../lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Yüklenirken gösterilecek iskelet kart
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-lg p-5 animate-pulse">
    <div className="h-56 bg-gray-200 rounded-xl mb-4"></div>
    <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded-md"></div>
  </div>
);

interface FormaKartlarProps {
  onStartDonation: (d: Donation) => void;
}

export default function FormaKartlar({ onStartDonation }: FormaKartlarProps) {
  const [products, setProducts] = useState<ProductWithTeam[]>([]);
  const [teams, setTeams] = useState<Team[]>([]); // Havuz bağışı için hala gerekli
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, teamsRes] = await Promise.all([
          // DÜZELTME: 'products' tablosundan tüm formaları ve ilişkili takım bilgilerini çek
          supabase.from('products').select('*, teams(*)').order('id'),
          // Havuz bağışı kartı için takımları çekmeye devam et
          supabase.from('teams').select('*').order('name'),
        ]);

        if (productsRes.error) throw productsRes.error;
        setProducts(productsRes.data || []);

        if (teamsRes.error) throw teamsRes.error;
        setTeams(teamsRes.data || []);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-yellow-500 text-4xl mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-700">
          Gösterilecek Forma Bulunamadı
        </h3>
        <p className="text-gray-500 mt-2">
          Lütfen admin panelinden yeni bir forma ekleyin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <TeamCard
            key={product.id}
            product={product} // DÜZELTME: Kart bileşenine 'team' yerine 'product' gönderiliyor
            onStartDonation={onStartDonation}
          />
        ))}
      </div>

      <div className="relative flex items-center my-16">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-6 text-lg font-medium text-gray-500">
          VEYA
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <PoolDonationCard teams={teams} onStartDonation={onStartDonation} />
    </div>
  );
}
