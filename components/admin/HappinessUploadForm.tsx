// components/admin/HappinessUploadForm.tsx
'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

interface HappinessUploadFormProps {
  onBack: () => void;
}

export default function HappinessUploadForm({
  onBack,
}: HappinessUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Lütfen önce bir dosya seçin.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('mutluluk-anlari')
        .upload(fileName, file);

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Dosya başarıyla yüklendi! Galeri güncellendi.',
      });
      setFile(null);
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: `Yükleme sırasında bir hata oluştu: ${err.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
      <button
        onClick={onBack}
        className="text-sm text-gray-600 hover:text-emerald-600 font-semibold mb-6 flex items-center"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Geri Dön
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        "Mutluluk Anları" Galerisine Yükle
      </h2>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept="image/*,video/mp4,video/webm"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-emerald-600 font-semibold"
          >
            {file ? `Seçilen Dosya: ${file.name}` : 'Görsel veya Video Seçin'}
          </label>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WEBP, MP4, WEBM formatları desteklenmektedir.
          </p>
        </div>
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
              Yükleniyor...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Şimdi Yükle
            </>
          )}
        </button>
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
      </div>
    </div>
  );
}
