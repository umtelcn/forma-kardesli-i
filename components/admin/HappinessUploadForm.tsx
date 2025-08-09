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
  faImage,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

interface HappinessUploadFormProps {
  onBack: () => void;
}

export default function HappinessUploadForm({ onBack }: HappinessUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setMessage(null);

      // Önizleme oluştur
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const sanitizeFilename = (name: string) => {
    return name
      .replace(/[^a-zA-Z0-9.\-_]/g, '-')
      .replace(/--+/g, '-')
      .toLowerCase();
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Lütfen önce bir dosya seçin.' });
      return;
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Dosya boyutu 10MB\'dan büyük olamaz.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const fileName = `mutluluk-${Date.now()}-${sanitizeFilename(file.name)}`;
      
      const { data, error } = await supabase.storage
        .from('mutluluk-anlari')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Dosya başarıyla yüklendi! Galeri güncellendi.' 
      });
      
      // Formu temizle
      setFile(null);
      setPreviewUrl(null);
      
      // Input'u temizle
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err: any) {
      console.error('Upload error:', err);
      setMessage({ 
        type: 'error', 
        text: `Yükleme sırasında bir hata oluştu: ${err.message}` 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isVideo = file?.type.startsWith('video/');
  const isImage = file?.type.startsWith('image/');

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl animate-fadeIn border border-gray-100">
      {/* Geri Dön Butonu */}
      <button 
        onClick={onBack} 
        className="group flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 font-semibold mb-8 transition-all duration-300 hover:translate-x-1"
      >
        <FontAwesomeIcon 
          icon={faArrowLeft} 
          className="transition-transform duration-300 group-hover:-translate-x-1" 
        />
        Geri Dön
      </button>

      {/* Başlık */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25 mb-4">
          <FontAwesomeIcon icon={faImage} className="text-white text-2xl" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Mutluluk Anları Galerisine Yükle
        </h2>
        <p className="text-gray-600">
          Çocukların sevinç dolu anlarını paylaşın
        </p>
      </div>

      <div className="space-y-6">
        {/* Dosya Seçim Alanı */}
        <div className="relative">
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            accept="image/*,video/mp4,video/webm,video/mov"
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className={`group relative block cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              file 
                ? 'border-emerald-300 bg-emerald-50' 
                : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
            }`}
          >
            <div className="space-y-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                file 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-200 text-gray-500 group-hover:bg-emerald-500 group-hover:text-white'
              }`}>
                <FontAwesomeIcon 
                  icon={isVideo ? faVideo : faImage} 
                  className="text-xl" 
                />
              </div>
              
              <div>
                <p className={`font-semibold text-lg ${
                  file ? 'text-emerald-600' : 'text-gray-700 group-hover:text-emerald-600'
                }`}>
                  {file ? `Seçilen: ${file.name}` : 'Görsel veya Video Seçin'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, WEBP, MP4, WEBM, MOV formatları • Max 10MB
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Önizleme */}
        {previewUrl && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Önizleme:</h3>
            <div className="flex justify-center">
              {isImage && (
                <img 
                  src={previewUrl} 
                  alt="Önizleme" 
                  className="max-h-48 rounded-xl shadow-md object-cover"
                />
              )}
              {isVideo && (
                <video 
                  src={previewUrl} 
                  controls 
                  className="max-h-48 rounded-xl shadow-md"
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              )}
            </div>
          </div>
        )}

        {/* Yükleme Butonu */}
        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className={`w-full font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
            isUploading || !file
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white hover:shadow-xl hover:scale-105 shadow-emerald-500/25'
          }`}
        >
          {isUploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Yükleniyor...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} />
              <span>Şimdi Yükle</span>
            </>
          )}
        </button>

        {/* Mesaj Gösterimi */}
        {message && (
          <div
            className={`flex items-center gap-3 p-4 rounded-2xl text-sm font-medium animate-fadeIn ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <FontAwesomeIcon 
              icon={message.type === 'success' ? faCheckCircle : faTimesCircle}
              className="text-base"
            />
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Alt Bilgi */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>• Yüklenen dosyalar otomatik olarak galeri sayfasında görünecektir</p>
          <p>• Lütfen çocukların mahremiyetini koruyacak içerikler paylaşın</p>
        </div>
      </div>
    </div>
  );
}
