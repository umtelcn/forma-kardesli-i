// components/admin/TeamAddForm.tsx
'use client'; // DÜZELTME: 'use client' direktifi dosyanın en üstüne taşındı ve parantezleri kaldırıldı.

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

interface TeamAddFormProps {
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
        Takım Logosu
      </label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border">
          {preview ? (
            <Image
              src={preview}
              alt="Logo Preview"
              width={64}
              height={64}
              className="object-contain h-full w-full rounded-md"
            />
          ) : (
            <span className="text-xs text-gray-400">Önizleme</span>
          )}
        </div>
        <label
          htmlFor="logo-upload"
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Logo Seç</span>
          <input
            id="logo-upload"
            name="logo-upload"
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

export default function TeamAddForm({ onBack }: TeamAddFormProps) {
  const [teamName, setTeamName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [formResetKey, setFormResetKey] = useState(Date.now());

  const resetForm = () => {
    setTeamName('');
    setLogoFile(null);
    setPrimaryColor('#000000');
    setSecondaryColor('#FFFFFF');
    setFormResetKey(Date.now());
  };

  const sanitizeFilename = (name: string) =>
    name.replace(/[^a-zA-Z0-9.\-_]/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !logoFile) {
      setMessage({ type: 'error', text: 'Takım adı ve logo zorunludur.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);

    try {
      const sanitizedLogoName = sanitizeFilename(logoFile.name);
      const logoFileName = `public/${Date.now()}-${sanitizedLogoName}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(logoFileName, logoFile);
      if (uploadError)
        throw new Error(`Logo yüklenemedi: ${uploadError.message}`);

      const { data: urlData } = supabase.storage
        .from('logos')
        .getPublicUrl(logoFileName);

      const { error: insertError } = await supabase.from('teams').insert({
        name: teamName,
        logo_url: urlData.publicUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
      });
      if (insertError)
        throw new Error(`Veritabanına kaydedilemedi: ${insertError.message}`);

      setMessage({
        type: 'success',
        text: `"${teamName}" takımı başarıyla eklendi!`,
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
        Yeni Takım Ekle
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

        <FileInputWithPreview
          onFileChange={setLogoFile}
          resetKey={formResetKey}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Takım Renkleri (HEX Kodu)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
            <div>
              <label
                htmlFor="primaryColor"
                className="block text-xs font-medium text-gray-500"
              >
                Ana Renk
              </label>
              <input
                type="text"
                id="primaryColor"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md shadow-sm font-mono"
                placeholder="#003366"
              />
            </div>
            <div>
              <label
                htmlFor="secondaryColor"
                className="block text-xs font-medium text-gray-500"
              >
                İkincil Renk
              </label>
              <input
                type="text"
                id="secondaryColor"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md shadow-sm font-mono"
                placeholder="#FFCC00"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50"
          >
            <FontAwesomeIcon
              icon={isSaving ? faSpinner : faPlus}
              className={isSaving ? 'animate-spin mr-2' : 'mr-2'}
            />
            {isSaving ? 'Kaydediliyor...' : 'Takımı Kaydet'}
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
