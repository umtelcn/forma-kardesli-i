// app/page.tsx
'use client';

import { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import IbanPage from '../components/IbanPage';
import UserInfoPage from '../components/UserInfoPage';
import ThankYouPage from '../components/ThankYouPage';
import AdminPanel from '../components/AdminPanel';
import { Donation } from '../lib/types';

export default function AskidaFormaApp() {
  const [currentPage, setCurrentPage] = useState('main');
  const [currentDonation, setCurrentDonation] = useState<Partial<Donation>>({});
  const [initialTab, setInitialTab] = useState('donate');

  const handleFinish = () => {
    setInitialTab('donations');
    setCurrentPage('main');
  };

  const handleStartDonation = (donation: Donation) => {
    setCurrentDonation(donation);
    setCurrentPage('iban');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'main':
        return (
          <MainContent
            onStartDonation={handleStartDonation}
            initialTab={initialTab}
            // Admin paneline geçiş fonksiyonu prop olarak gönderiliyor
            onAdminClick={() => setCurrentPage('admin')}
          />
        );
      case 'iban':
        return (
          <IbanPage
            donation={currentDonation as Donation}
            onBack={() => {
              setCurrentPage('main');
              setCurrentDonation({});
            }}
            onContinue={() => setCurrentPage('userInfo')}
          />
        );
      case 'userInfo':
        return (
          <UserInfoPage
            donation={currentDonation as Donation}
            onBack={() => setCurrentPage('iban')}
            onComplete={() => setCurrentPage('thankYou')}
          />
        );
      case 'admin':
        return <AdminPanel />;
      case 'thankYou':
        return <ThankYouPage onFinish={handleFinish} />;
      default:
        return (
          <MainContent
            onStartDonation={handleStartDonation}
            initialTab={initialTab}
            onAdminClick={() => setCurrentPage('admin')}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header setCurrentPage={setCurrentPage} setInitialTab={setInitialTab} />
      <main>{renderCurrentPage()}</main>
    </div>
  );
}
