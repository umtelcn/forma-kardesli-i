// components/AdminPanel.tsx
'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import AdminDashboard from './admin/AdminDashboard'; // Yeni panoyu import et

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // DİKKAT: Gerçek bir uygulamada bu şifreyi bir ortam değişkeninde saklayın.
  const ADMIN_PASSWORD = '123456789';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Hatalı şifre. Lütfen tekrar deneyin.');
    }
  };

  // Eğer kullanıcı henüz giriş yapmadıysa, şifre formunu göster.
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-md py-12 animate-fadeIn">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <FontAwesomeIcon
            icon={faShieldHalved}
            className="text-4xl text-emerald-600 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Admin Paneli Girişi
          </h2>
          <p className="text-gray-600 mb-6">
            Lütfen devam etmek için şifreyi girin.
          </p>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500"
              placeholder="Şifre"
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-emerald-700 transition"
            >
              Giriş Yap
            </button>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  // Giriş başarılıysa, Admin Panosunu göster.
  return <AdminDashboard />;
}
