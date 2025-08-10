// components/admin/ProductAddForm.tsx
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
} from '@fortawesome/free-solid-svg-icons';

interface ProductAddFormProps {
  onBack: () => void;
}

// A helper component for file inputs with a preview
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Forma Görseli</label>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center border">
          {preview ? (
            <Image src={preview} alt="Forma Preview" width={64} height={64} className="object-contain h-full w-full rounded-md" />
          ) : (
            <span className="text-xs text-gray-400">Önizleme</span>
          )}
        </div>
        <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          <span>Görsel Seç</span>
          <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </label>
      </div>
    </div>
  );
};

// The main component now manages both "add" and "edit" modes
export default function ProductAddForm({ onBack }: ProductAddFormProps) {
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl animate-fadeIn">
      <button onClick={onBack} className="text-sm text-gray-600 hover:text-emerald-600 font-semibold mb-6 flex items-center">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        Geri Dön
      </button>

      <div className="flex justify-center items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'add' ? 'Yeni Forma Ekle' : 'Mevcut Formaları Düzenle'}
        </h2>
        <button 
          onClick={() => setMode(mode === 'add' ? 'edit' : 'add')}
          className="ml-auto text-sm bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition"
        >
          {mode === 'add' ? 'Ürünleri Düzenle' : 'Yeni Ürün Ekle'}
        </button>
      </div>

      {mode === 'add' ? <AddForm /> : <EditList />}
    </div>
  );
}

// Component for the "Add New Jersey" form
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
      const { data } = await supabase.from('teams').select('id, name').order('name');
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

  const sanitizeFilename = (name: string) => name.replace(/[^a-zA-Z0-9.\-_]/g, '_');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId || !price || !imageFile || !description || !ageRange) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
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
        description: description,
        age_range: ageRange,
        price: parseFloat(price),
        image_url: urlData.publicUrl,
      });
      if (insertError) throw new Error(`Veritabanına kaydedilemedi: ${insertError.message}`);

      const selectedTeam = teams.find(t => t.id.toString() === selectedTeamId);
      setMessage({ type: 'success', text: `"${selectedTeam?.name}" takımı için yeni forma başarıyla eklendi!` });
      resetForm();

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="team" className="block text-sm font-medium text-gray-700">Takım Seç</label>
        <select id="team" value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)} className="w-full mt-1 p-2 border rounded-md shadow-sm bg-white" required>
          <option value="" disabled>Bir takım seçin...</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Ürün Açıklaması</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 border rounded-md shadow-sm" placeholder="Örn: 2024-2025 Sezonu İç Saha Forması" required />
      </div>
      <div>
        <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700">Yaş Aralığı</label>
        <input type="text" id="ageRange" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className="w-full mt-1 p-2 border rounded-md shadow-sm" placeholder="Örn: 7-8 Yaş" required />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Fiyat (TL)</label>
        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 p-2 border rounded-md shadow-sm" required />
      </div>
      <FileInputWithPreview onFileChange={setImageFile} resetKey={formResetKey} />
      <div className="pt-2">
        <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50">
          <FontAwesomeIcon icon={isSaving ? faSpinner : faShirt} className={isSaving ? 'animate-spin mr-2' : 'mr-2'} />
          {isSaving ? 'Kaydediliyor...' : 'Formayı Kaydet'}
        </button>
      </div>
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <FontAwesomeIcon icon={message.type === 'success' ? faCheckCircle : faTimesCircle} />
          <span>{message.text}</span>
        </div>
      )}
    </form>
  );
};

// Component for the "Edit Products" list
const EditList = () => {
    const [products, setProducts] = useState<ProductWithTeam[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data } = await supabase.from('products').select('*, teams(*)').order('created_at', { ascending: false });
        setProducts(data as ProductWithTeam[] || []);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    
    const handleSave = async () => {
        if (!editingProduct || !editingProduct.id) return;
        const { id, team_id, image_url, description, age_range, created_at, teams, ...updateData } = editingProduct;

        const { error } = await supabase.from('products').update(updateData).eq('id', id);
        if (error) {
            alert('Fiyat güncellenirken hata oluştu: ' + error.message);
        } else {
            setEditingProduct(null);
            fetchProducts();
        }
    };

    const handleDelete = async (productId: number) => {
        if (window.confirm('Bu ürünü kalıcı olarak silmek istediğinizden emin misiniz?')) {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) {
                alert('Silme işlemi sırasında hata oluştu: ' + error.message);
            } else {
                fetchProducts();
            }
        }
    };

    if (isLoading) return <div className="text-center"><FontAwesomeIcon icon={faSpinner} className="animate-spin text-2xl" /></div>;

    return (
        <div className="space-y-3">
            {products.map(product => (
                <div key={product.id} className="bg-gray-50 p-3 rounded-lg border flex items-center justify-between gap-4">
                    <Image src={product.image_url} alt={product.description} width={48} height={48} className="object-contain rounded-md bg-white"/>
                    <div className="flex-grow">
                        <p className="font-bold">{product.teams.name}</p>
                        <p className="text-sm text-gray-600">{product.description} ({product.age_range})</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {editingProduct?.id === product.id ? (
                            <>
                                <input 
                                    type="number" 
                                    value={editingProduct.price} 
                                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                                    className="w-24 p-2 border rounded-md"
                                />
                                <button onClick={handleSave} className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700"><FontAwesomeIcon icon={faSave} /></button>
                                <button onClick={() => setEditingProduct(null)} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"><FontAwesomeIcon icon={faTimes} /></button>
                            </>
                        ) : (
                            <>
                                <span className="font-semibold">{product.price} TL</span>
                                <button onClick={() => setEditingProduct(product)} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"><FontAwesomeIcon icon={faPen} /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"><FontAwesomeIcon icon={faTrash} /></button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
