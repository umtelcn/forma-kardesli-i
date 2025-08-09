'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTurkishLiraSign,
  faArrowLeft,
  faHandHoldingHeart,
} from '@fortawesome/free-solid-svg-icons';
import { Team, Donation } from '../lib/types';

interface PoolDonationCardProps {
  teams: Team[];
  onStartDonation: (d: Donation) => void;
}

export default function PoolDonationCard({
  teams,
  onStartDonation,
}: PoolDonationCardProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [poolAmount, setPoolAmount] = useState('');
  const selectedTeam = teams.find((team) => team.id === selectedTeamId);

  const quickAmounts = [50, 100, 250];

  const handleDonationSubmit = () => {
    const amount = parseFloat(poolAmount);
    if (!selectedTeam || !amount || amount <= 0) {
      alert('Lütfen geçerli bir tutar giriniz.');
      return;
    }
    onStartDonation({
      type: 'pool',
      teamId: selectedTeam.id,
      teamName: selectedTeam.name,
      quantity: null,
      total: amount,
      imageUrl: selectedTeam.logo_url || null,
    });
  };

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <div className="flex items-center justify-center gap-2 mb-4 text-emerald-600">
        <FontAwesomeIcon icon={faHandHoldingHeart} className="w-5 h-5" />
        <h3 className="text-lg font-semibold text-gray-800">Havuz Bağışı</h3>
      </div>

      {!selectedTeamId ? (
        // Adım 1: Takım Seçimi
        <div className="animate-fadeIn">
          <p className="text-sm text-center font-medium text-gray-600 mb-3">
            Takımını Seç
          </p>
          <div className="grid grid-cols-3 gap-3">
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className="p-2 rounded-lg bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 flex flex-col items-center transition"
              >
                {team.logo_url ? (
                  <Image
                    src={team.logo_url}
                    alt={`${team.name} logosu`}
                    width={36}
                    height={36}
                    className="object-contain mb-1"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center mb-1">
                    <span className="text-sm font-bold text-gray-500">
                      {team.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {team.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Adım 2: Tutar Girişi
        <div className="animate-fadeIn">
          <button
            onClick={() => setSelectedTeamId(null)}
            className="text-xs text-gray-500 hover:text-emerald-600 font-medium mb-3 flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
            Değiştir
          </button>

          {selectedTeam && (
            <div className="flex items-center gap-2 mb-3">
              {selectedTeam.logo_url ? (
                <Image
                  src={selectedTeam.logo_url}
                  alt={`${selectedTeam.name} logosu`}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              ) : (
                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-500">
                    {selectedTeam.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <p className="font-medium text-gray-700 text-sm">
                {selectedTeam.name}
              </p>
            </div>
          )}

          {/* Hızlı Tutarlar */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setPoolAmount(amount.toString())}
                className={`py-2 rounded-md text-sm font-semibold transition ${
                  poolAmount === amount.toString()
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {amount} TL
              </button>
            ))}
          </div>

          {/* Manuel Giriş */}
          <div className="relative mb-3">
            <FontAwesomeIcon
              icon={faTurkishLiraSign}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5"
            />
            <input
              type="number"
              value={poolAmount}
              onChange={(e) => setPoolAmount(e.target.value)}
              className="w-full text-sm text-center py-2 pl-8 border border-gray-300 rounded-md focus:ring-1 focus:ring-emerald-500"
              placeholder="Tutar Gir"
              min="1"
              step="1"
            />
          </div>

          <button
            onClick={handleDonationSubmit}
            disabled={!poolAmount || parseFloat(poolAmount) <= 0}
            className="w-full bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bağış Yap ({poolAmount || 0} TL)
          </button>
        </div>
      )}
    </div>
  );
}