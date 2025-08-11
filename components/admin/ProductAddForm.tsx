'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Team, Product, ProductWithTeam } from '../../lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faShirt,
  faPen,
  faTrash,
  faSave,
  faTimes,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

// Renk kodumuz için bir değişken
const customGreen = '#77b65d';
const customGreenDark = '#5a8f46';

interface ProductAddFormProps {
  onBack: () => void;
}

const FileInputWithPreview = ({ onFileChange, resetKey }: any) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newPreview = URL.createObjectURL(file);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(newPreview);
      onFileChange(file);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div key={resetKey}>
      <label className="block text-sm font-medium text-gray-700 mb-1">Forma Görseli</label>
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
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl animate-fadeIn">
      <button 
        onClick={onBack} 
        style={{ '--hover-color': customGreen } as React.CSSProperties}
        className="text-sm text-gray-600 hover:text-[var(--hover-color)] font-semibold mb-6 flex items-center transition-colors"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Geri Dön
      </button>

      <div className="flex justify-center items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'add' ? 'Yeni Forma Ekle' : 'Mevcut Formaları Düzenle'}
        </h2>
        <button 
          onClick={() => setMode(mode === 'add' ? 'edit' : 'add')}
          className="ml-auto text-sm bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {mode === 'add' ? 'Ürünleri Düzenle' : 'Yeni Ürün Ekle'}
        </button>
      </div>

      {mode === 'add' ? <AddForm /> : <EditList />}
    </div>
  );
}

const AddForm = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formResetKey, setFormResetKey] = useState(Date.now());

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, logo_url, primary_color, secondary_color')
          .order('name');
        if (error) throw error;
        setTeams(data || []);
      } catch (error) {
        console.error('Takımlar yüklenirken hata:', error);
        setMessage({ type: 'error', text: 'Takımlar yüklenemedi.' });
      }
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

  const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !price || !imageFile || !description || !ageRange) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue < 0) {
      setMessage({ type: 'error', text: 'Geçerli bir fiyat giriniz.' });
      return;
    }
    setIsSaving(true);
    setMessage(null);
    try {
      const sanitizedImageName = sanitizeFilename(imageFile.name);
      const imageFileName = `public/img_${Date.now()}_${sanitizedImageName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(imageFileName, imageFile);
      if (uploadError) throw new Error(`Forma görseli yüklenemedi: ${uploadError.message}`);
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(imageFileName);
      const { error: insertError } = await supabase.from('products').insert({
        team_id: parseInt(selectedTeamId, 10),
        description: description.trim(),
        age_range: ageRange.trim(),
        price: priceValue,
        image_url: urlData.publicUrl,
        image_path: imageFileName,
      });
      if (insertError) throw new Error(`Veritabanına kaydedilemedi: ${insertError.message}`);
      const selectedTeam = teams.find(t => t.id.toString() === selectedTeamId);
      setMessage({ type: 'success', text: `${selectedTeam?.name} takımı için yeni forma başarıyla eklendi!` });
      resetForm();
    } catch (error: any) {
      console.error('Ürün eklerken hata:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" style={{ '--ring-color': customGreen } as React.CSSProperties}>
      <div>
        <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Takım Seç</label>
        <select id="team" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)} className="w-full p-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)]" required>
          <option value="" disabled>Bir takım seçin...</option>
          {teams.map(team => (<option key={team.id} value={team.id}>{team.name}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Ürün Açıklaması</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)]" placeholder="Örn: 2024-2025 Sezonu İç Saha Forması" required />
      </div>
      <div>
        <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">Yaş Aralığı</label>
        <input type="text" id="ageRange" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)]" placeholder="Örn: 7-8 Yaş" required />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)]" step="0.01" min="0" required />
      </div>
      <FileInputWithPreview onFileChange={setImageFile} resetKey={formResetKey} />
      <div className="pt-2">
        <button type="submit" disabled={isSaving} style={{ backgroundColor: customGreen }} className="w-full text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
          <FontAwesomeIcon icon={isSaving ? faSpinner : faShirt} className={isSaving ? 'animate-spin mr-2' : 'mr-2'} />
          {isSaving ? 'Kaydediliyor...' : 'Formayı Kaydet'}
        </button>
      </div>
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm animate-fadeIn ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faTimesCircle} />
          <span>{message.text}</span>
        </div>
      )}
    </form>
  );
};

const EditList = () => {
  const [products, setProducts] = useState<ProductWithTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<{ price?: string; description?: string; age_range?: string; }>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, teams(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data as ProductWithTeam[] || []);
    } catch (error: any) {
      console.error('Ürünler yüklenirken hata:', error);
      setMessage({ type: 'error', text: 'Ürünler yüklenirken hata oluştu.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => { setMessage(null); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleStartEdit = (product: ProductWithTeam) => {
    setEditingProductId(product.id);
    setEditedValues({ 
      price: product.price.toString(), 
      description: product.description || undefined, 
      age_range: product.age_range || undefined 
    });
    setMessage(null);
  };
  
  const handleCancelEdit = () => { 
    setEditingProductId(null); 
    setEditedValues({}); 
    setMessage(null); 
  };
  
  const handleInputChange = (field: string, value: string) => { 
    setEditedValues(prev => ({ ...prev, [field]: value })); 
  };
  
  const handleSave = async (productId: number) => {
    const priceValue = parseFloat(editedValues.price || '0');
    if (!editedValues.price || priceValue < 0 || isNaN(priceValue)) { 
      setMessage({ type: 'error', text: 'Geçerli bir fiyat giriniz.' }); 
      return; 
    }
    if (!editedValues.description?.trim() || !editedValues.age_range?.trim()) { 
      setMessage({ type: 'error', text: 'Tüm alanları doldurunuz.' }); 
      return; 
    }
    setSavingId(productId);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          price: priceValue, 
          description: editedValues.description.trim(), 
          age_range: editedValues.age_range.trim() 
        })
        .eq('id', productId);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Ürün başarıyla güncellendi!' });
      setEditingProductId(null);
      setEditedValues({});
      await fetchProducts();
    } catch (error: any) {
      console.error('Güncelleme hatası:', error);
      setMessage({ type: 'error', text: `Güncelleme hatası: ${error.message}` });
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    // ESLint hatası düzeltildi: Tırnak işaretleri kaldırıldı
    const confirmMessage = `${productName} ürününü kalıcı olarak silmek istediğinizden emin misiniz?`;
    if (!window.confirm(confirmMessage)) { 
      return; 
    }
    setDeletingId(productId);
    setMessage(null);
    try {
      const productToDelete = products.find(p => p.id === productId);
      
      // Storage'dan daha güvenli silme - TypeScript hatası düzeltildi
      const imagePath = (productToDelete as any)?.image_path;
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([imagePath]);
        if (storageError) {
          console.warn(`Görsel silinirken hata (DB'den silme işlemine devam ediliyor): ${storageError.message}`);
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      setMessage({ type: 'success', text: 'Ürün başarıyla silindi!' });
      await fetchProducts();
    } catch (error: any) {
      console.error('Silme hatası:', error);
      setMessage({ type: 'error', text: `Silme hatası: ${error.message}` });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-3xl" style={{ color: customGreen }} />
        <p className="mt-3 text-gray-600 font-medium">Ürünler yükleniyor...</p>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-gray-400 mb-3" />
        <p className="text-gray-600 font-medium">Henüz ürün eklenmemiş.</p>
        <p className="text-sm text-gray-500 mt-1">Yeni ürün eklemek için &quot;Yeni Ürün Ekle&quot; butonuna tıklayın.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ '--ring-color': customGreen, '--text-color': customGreenDark } as React.CSSProperties}>
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm animate-fadeIn ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faTimesCircle} />
          <span>{message.text}</span>
        </div>
      )}
      <div className="text-sm text-gray-600 mb-2">{`Toplam ${products.length} ürün listeleniyor`}</div>
      {products.map(product => (
        <div key={product.id} className={`bg-gray-50 p-4 rounded-lg border transition-all hover:shadow-md ${editingProductId === product.id ? 'ring-2 ring-[var(--ring-color)] border-[var(--ring-color)]' : ''}`}>
          {editingProductId === product.id ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Image 
                  src={product.image_url || '/placeholder-jersey.png'} 
                  alt={product.description || 'Ürün görseli'} 
                  width={64} 
                  height={64} 
                  className="object-contain rounded-md bg-white border" 
                />
                <div className="flex-grow space-y-2">
                  <div className="font-bold text-gray-800">{product.teams.name}</div>
                  <input 
                    type="text" 
                    value={editedValues.description || ''} 
                    onChange={(e) => handleInputChange('description', e.target.value)} 
                    placeholder="Ürün açıklaması" 
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]" 
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={editedValues.age_range || ''} 
                      onChange={(e) => handleInputChange('age_range', e.target.value)} 
                      placeholder="Yaş aralığı" 
                      className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]" 
                    />
                    <div className="flex gap-1">
                      <input 
                        type="number" 
                        value={editedValues.price || ''} 
                        onChange={(e) => handleInputChange('price', e.target.value)} 
                        placeholder="Fiyat" 
                        step="0.01" 
                        min="0" 
                        className="flex-grow p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)]" 
                      />
                      <span className="flex items-center px-2 text-sm text-gray-600">TL</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => handleSave(product.id)} 
                      disabled={savingId === product.id} 
                      style={{ backgroundColor: customGreenDark }} 
                      className="flex-1 text-white px-3 py-2 rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <FontAwesomeIcon icon={savingId === product.id ? faSpinner : faSave} className={savingId === product.id ? 'animate-spin' : ''} />
                      {savingId === product.id ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                    <button 
                      onClick={handleCancelEdit} 
                      disabled={savingId === product.id} 
                      className="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" />
                      İptal
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <Image 
                src={product.image_url || '/placeholder-jersey.png'} 
                alt={product.description || 'Ürün görseli'} 
                width={56} 
                height={56} 
                className="object-contain rounded-md bg-white border flex-shrink-0" 
              />
              <div className="flex-grow min-w-0">
                <p className="font-bold text-gray-800 truncate">{product.teams.name}</p>
                <p className="text-sm text-gray-600 truncate">{product.description || 'Açıklama yok'}</p>
                <p className="text-xs text-gray-500">{product.age_range || 'Yaş aralığı belirtilmemiş'}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-bold text-lg min-w-[80px] text-right" style={{ color: customGreenDark }}>{product.price} TL</span>
                <button 
                  onClick={() => handleStartEdit(product)} 
                  disabled={deletingId === product.id} 
                  className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                  title="Düzenle"
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id, `${product.teams.name} - ${product.description || 'Ürün'}`)} 
                  disabled={deletingId === product.id} 
                  className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
                  title="Sil"
                >
                  <FontAwesomeIcon icon={deletingId === product.id ? faSpinner : faTrash} className={deletingId === product.id ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};