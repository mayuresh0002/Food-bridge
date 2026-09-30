import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DemoModeBanner } from './components/common/DemoModeBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/auth/AuthModal';
import { QRCodeScannerModal } from './components/common/QRCodeScannerModal';

import { LandingPage } from './pages/LandingPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { MatchingEnginePage } from './pages/MatchingEnginePage';
import { BlockchainDashboard } from './pages/BlockchainDashboard';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent: React.FC<{
  onOpenAuth: () => void;
  onOpenQRScanner: () => void;
}> = ({ onOpenAuth, onOpenQRScanner }) => {
  const { activeView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] dark:bg-[#0B1220] text-slate-900 dark:text-slate-100 dark">
      <DemoModeBanner />
      <Navbar onOpenAuth={onOpenAuth} onOpenQRScanner={onOpenQRScanner} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeView === 'landing' && <LandingPage />}
        {activeView === 'donor' && <DonorDashboard />}
        {activeView === 'ngo' && <NGODashboard />}
        {activeView === 'matching' && <MatchingEnginePage />}
        {activeView === 'blockchain' && <BlockchainDashboard />}
        {activeView === 'traceability' && <TraceabilityPage />}
        {activeView === 'logistics' && <LogisticsPage />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      <Footer />
      <Toast />
    </div>
  );
};

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  return (
    <AppProvider>
      <MainContent
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <AppModalWrapper
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
    </AppProvider>
  );
}

const AppModalWrapper: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setSelectedDonationId, setActiveView } = useApp();
  return (
    <QRCodeScannerModal
      isOpen={isOpen}
      onClose={onClose}
      onScanSuccess={(id) => {
        setSelectedDonationId(id);
        setActiveView('traceability');
      }}
    />
  );
};

export default App;
