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
  // Manages which page is currently visible to the user.
  const [currentPage, setCurrentPage] = useState('main');
  // Temporarily stores donation details (team, quantity, etc.) during the checkout process.
  const [currentDonation, setCurrentDonation] = useState<Partial<Donation>>({});
  // Determines which tab is active when returning to the main page.
  const [initialTab, setInitialTab] = useState('donate');
  // Stores the final, combined user and donation data to be shown on the thank you page.
  const [finalDonorData, setFinalDonorData] = useState<any>(null);

  // Called when the user finishes the entire process from the thank you page.
  const handleFinish = () => {
    setInitialTab('donations'); // Switch to the "Recent Donations" tab
    setCurrentPage('main');
  };

  // Called when a user clicks "Askıya Bırak" on a jersey card.
  const handleStartDonation = (donation: Donation) => {
    setCurrentDonation(donation);
    setCurrentPage('iban');
  };

  // This function determines which page component to render based on the currentPage state.
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'main':
        return (
          <MainContent
            onStartDonation={handleStartDonation}
            initialTab={initialTab}
            onAdminClick={() => setCurrentPage('admin')}
          />
        );
      case 'iban':
        return (
          <IbanPage
            donation={currentDonation as Donation}
            onBack={() => {
              setCurrentPage('main');
              setCurrentDonation({}); // Clear incomplete donation data when going back.
            }}
            onContinue={() => setCurrentPage('userInfo')}
          />
        );
      case 'userInfo':
        return (
          <UserInfoPage
            donation={currentDonation as Donation}
            onBack={() => setCurrentPage('iban')}
            // When the user info form is completed, it passes the `donorInfo`.
            onComplete={(donorInfo) => {
              // Combine the donation details with the new donor info for the thank you page.
              setFinalDonorData({ ...currentDonation, ...donorInfo });
              setCurrentPage('thankYou');
            }}
          />
        );
      case 'admin':
        return <AdminPanel />;
      case 'thankYou':
        // Pass the final combined data to the ThankYouPage.
        return <ThankYouPage onFinish={handleFinish} donorData={finalDonorData} />;
      default:
        // Fallback to the main page if the state is invalid.
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
