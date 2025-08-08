// components/admin/ProductAddForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Team } from '../../lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faShirt,
} from '@fortawesome/free-solid-svg-icons';

interface ProductAddFormProps {
  onBack: () => void;
}

// Dosya seçme ve önizleme için yardımcı bileşen
const FileInputWithPreview = ({ onFileChange, resetKey }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  return (
    <div key={resetKey}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Forma Görseli
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border">
          {preview ? (
            <Image
              src={preview}
              alt="Forma Preview"
              width={64}
              height={64}
              className="object-contain h-full w-full rounded-md"
            />
          ) : (
            <span className="text-xs text-gray-400">Önizleme</span>
          )}
        </div>
        <label
          htmlFor="image-upload"
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Görsel Seç</span>
          <input
            id="image-upload"
            name="image-upload"
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

export default function ProductAddForm({ onBack }: ProductAddFormProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [formResetKey, setFormResetKey] = useState(Date.now());

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');
      setTeams(data || []);
    };
    fetchTeams();
  }, []);

  const resetForm = () => {
    setSelectedTeamId('');
    setDescription('');
    setAgeRange('');
    setPrice('');
    setImageFile(null);
    setFormResetKey(Date.now());
  };

  const sanitizeFilename = (name: string) =>
    name.replace(/[^a-zA-Z0-9.\-_]/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !price || !imageFile || !description || !ageRange) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      // 1. Forma görselini Supabase Storage'a yükle
      const sanitizedImageName = sanitizeFilename(imageFile.name);
      const imageFileName = `public/${Date.now()}-${sanitizedImageName}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(imageFileName, imageFile);
      if (uploadError)
        throw new Error(`Forma görseli yüklenemedi: ${uploadError.message}`);

      // 2. Yüklenen dosyanın genel URL'ini al
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(imageFileName);

      // 3. Yeni formayı (ürünü) veritabanına kaydet
      const { error: insertError } = await supabase.from('products').insert({
        team_id: parseInt(selectedTeamId, 10),
        description: description,
        age_range: ageRange,
        price: parseFloat(price),
        image_url: urlData.publicUrl,
      });
      if (insertError)
        throw new Error(`Veritabanına kaydedilemedi: ${insertError.message}`);

      const selectedTeam = teams.find(
        (t) => t.id.toString() === selectedTeamId
      );
      setMessage({
        type: 'success',
        text: `"${selectedTeam?.name}" takımı için yeni forma başarıyla eklendi!`,
      });
      resetForm();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

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
        Yeni Forma Ekle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700"
          >
            Takım Seç
          </label>
          <select
            id="team"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md shadow-sm bg-white"
            required
          >
            <option value="" disabled>
              Bir takım seçin...
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Ürün Açıklaması
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
            placeholder="Örn: 2024-2025 Sezonu İç Saha Forması"
            required
          />
        </div>

        <div>
          <label
            htmlFor="ageRange"
            className="block text-sm font-medium text-gray-700"
          >
            Yaş Aralığı
          </label>
          <input
            type="text"
            id="ageRange"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
            placeholder="Örn: 7-8 Yaş"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Fiyat (TL)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
            required
          />
        </div>

        <FileInputWithPreview
          onFileChange={setImageFile}
          resetKey={formResetKey}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <FontAwesomeIcon
              icon={isSaving ? faSpinner : faShirt}
              className={isSaving ? 'animate-spin mr-2' : 'mr-2'}
            />
            {isSaving ? 'Kaydediliyor...' : 'Formayı Kaydet'}
          </button>
        </div>
        {message && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <FontAwesomeIcon
              icon={message.type === 'success' ? faCheckCircle : faTimesCircle}
            />
            <span>{message.text}</span>
          </div>
        )}
      </form>
    </div>
  );
}
