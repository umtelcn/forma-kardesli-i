// components/admin/ProductAddForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';

interface ProductAddFormProps {
  onBack: () => void;
}

// Helper component for file inputs with preview
const FileInputWithPreview = ({ label, onFileChange, id }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={64}
              height={64}
              className="object-contain h-full w-full rounded-md"
            />
          ) : (
            <span className="text-xs text-gray-400">Önizleme</span>
          )}
        </div>
        <label
          htmlFor={id}
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Dosya Seç</span>
          <input
            id={id}
            name={id}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
          />
        </label>
      </div>
    </div>
  );
};

export default function ProductAddForm({ onBack }: ProductAddFormProps) {
  const [teamName, setTeamName] = useState('');
  const [price, setPrice] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const resetForm = () => {
    setTeamName('');
    setPrice('');
    setLogoFile(null);
    setImageFile(null);
    // This is a trick to reset the file input previews
    // In a real app, you might manage the preview state more globally or pass a reset prop
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !price || !logoFile || !imageFile) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      // 1. Upload logo
      const logoFileName = `public/${Date.now()}-${logoFile.name}`;
      const { error: logoUploadError } = await supabase.storage
        .from('logos')
        .upload(logoFileName, logoFile);
      if (logoUploadError)
        throw new Error(`Logo yüklenemedi: ${logoUploadError.message}`);
      const { data: logoUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(logoFileName);

      // 2. Upload jersey image
      const imageFileName = `public/${Date.now()}-${imageFile.name}`;
      const { error: imageUploadError } = await supabase.storage
        .from('images')
        .upload(imageFileName, imageFile);
      if (imageUploadError)
        throw new Error(
          `Forma görseli yüklenemedi: ${imageUploadError.message}`
        );
      const { data: imageUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(imageFileName);

      // 3. Insert into database
      const { error: insertError } = await supabase.from('teams').insert({
        name: teamName,
        price: parseFloat(price),
        logo_url: logoUrlData.publicUrl,
        image_url: imageUrlData.publicUrl,
      });
      if (insertError)
        throw new Error(`Veritabanına kaydedilemedi: ${insertError.message}`);

      setMessage({ type: 'success', text: `"${teamName}" başarıyla eklendi!` });
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
        Yeni Ürün Ekle
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-700"
          >
            Takım Adı
          </label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md shadow-sm"
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
          id="logo-upload"
          label="Takım Logosu"
          onFileChange={setLogoFile}
        />
        <FileInputWithPreview
          id="image-upload"
          label="Forma Görseli"
          onFileChange={setImageFile}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <FontAwesomeIcon
              icon={isSaving ? faSpinner : faUpload}
              className={isSaving ? 'animate-spin mr-2' : 'mr-2'}
            />
            {isSaving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
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
