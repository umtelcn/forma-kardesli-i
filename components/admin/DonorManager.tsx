// components/admin/DonorManager.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faPen,
  faTrash,
  faSave,
  faTimes,
  faSpinner,
  faExclamationTriangle,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

// Donors tipini Supabase'den gelen veriye göre tanımlıyoruz
type Donor = {
  id: number;
  name: string | null;
  surname: string | null;
  email: string | null;
  instagram_handle: string | null;
  twitter_handle: string | null;
  display_name: string | null;
  identity_type: string | null;
  created_at: string;
};

interface DonorManagerProps {
  onBack: () => void;
}

export default function DonorManager({ onBack }: DonorManagerProps) {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDonor, setEditingDonor] = useState<Partial<Donor> | null>(null);
  const [deletingDonorId, setDeletingDonorId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDonors = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError('Bağışçılar yüklenirken bir hata oluştu.');
      console.error(error);
    } else {
      setDonors(data as Donor[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleSave = async () => {
    if (!editingDonor || !editingDonor.id) return;

    const { id, created_at, ...updateData } = editingDonor;

    const { error } = await supabase
      .from('donors')
      .update(updateData)
      .eq('id', editingDonor.id);

    if (error) {
      alert('Güncelleme sırasında bir hata oluştu: ' + error.message);
    } else {
      setEditingDonor(null);
      fetchDonors(); // Listeyi yenile
    }
  };

  const handleDelete = async (donorId: number) => {
    const { error } = await supabase.from('donors').delete().eq('id', donorId);
    if (error) {
      alert('Silme işlemi sırasında bir hata oluştu: ' + error.message);
    } else {
      setDeletingDonorId(null);
      fetchDonors(); // Listeyi yenile
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingDonor) return;
    setEditingDonor({ ...editingDonor, [e.target.name]: e.target.value });
  };

  const filteredDonors = useMemo(() => {
    if (!searchTerm) return donors;
    return donors.filter(
      (donor) =>
        donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.display_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [donors, searchTerm]);

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl text-emerald-600"
        />
        <p className="mt-4 font-semibold">Bağışçılar Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl animate-fadeIn">
      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-emerald-600 font-semibold mb-6 flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Geri Dön
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Bağışçıları Yönet
      </h2>

      <div className="relative mb-6">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="İsim, soyisim veya e-posta ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pl-10 border rounded-md"
        />
      </div>

      <div className="space-y-4">
        {filteredDonors.map((donor) => (
          <div key={donor.id} className="bg-gray-50 p-4 rounded-lg border">
            {editingDonor?.id === donor.id ? (
              // Düzenleme Modu
              <div className="space-y-3">
                <input
                  name="name"
                  value={editingDonor.name || ''}
                  onChange={handleInputChange}
                  placeholder="İsim"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  name="surname"
                  value={editingDonor.surname || ''}
                  onChange={handleInputChange}
                  placeholder="Soyisim"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  name="email"
                  value={editingDonor.email || ''}
                  onChange={handleInputChange}
                  placeholder="E-posta"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  name="instagram_handle"
                  value={editingDonor.instagram_handle || ''}
                  onChange={handleInputChange}
                  placeholder="Instagram"
                  className="w-full p-2 border rounded-md"
                />
                <input
                  name="twitter_handle"
                  value={editingDonor.twitter_handle || ''}
                  onChange={handleInputChange}
                  placeholder="Twitter"
                  className="w-full p-2 border rounded-md"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} /> Kaydet
                  </button>
                  <button
                    onClick={() => setEditingDonor(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faTimes} /> İptal
                  </button>
                </div>
              </div>
            ) : (
              // Görüntüleme Modu
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">
                      {donor.display_name || `${donor.name} ${donor.surname}`}
                    </p>
                    <p className="text-sm text-gray-600">{donor.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDonor(donor)}
                      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingDonorId(donor.id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {deletingDonorId === donor.id && (
                  <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-r-lg">
                    <p className="font-bold">
                      Bu bağışçıyı silmek istediğinizden emin misiniz?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDelete(donor.id)}
                        className="bg-red-600 text-white px-3 py-1 text-sm rounded-md"
                      >
                        Evet, Sil
                      </button>
                      <button
                        onClick={() => setDeletingDonorId(null)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 text-sm rounded-md"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
