import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DepositModal from './DepositModal';
import { usePortfolio } from '../context/PortfolioContext';

const Layout = ({ children, currentView, onChangeView }) => {
  const { addFunds } = usePortfolio();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors">
      <DepositModal 
        isOpen={isDepositOpen} 
        onClose={() => setIsDepositOpen(false)} 
        onDeposit={(amount) => addFunds(amount)} 
      />

      <Sidebar 
        currentView={currentView} 
        onChangeView={onChangeView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)}
          onOpenDeposit={() => setIsDepositOpen(true)}
        />
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
