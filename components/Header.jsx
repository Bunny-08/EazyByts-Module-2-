import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onMenuClick, onOpenDeposit }) => {
  const { portfolio } = usePortfolio();
  const { theme, toggleTheme } = useTheme();

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-30 transition-colors">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      
      <div className="hidden md:flex items-center gap-6 text-sm">
        <div className="flex gap-2">
          <span className="text-gray-500 dark:text-gray-400">NIFTY 50</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">+1.2%</span>
        </div>
        <div className="flex gap-2">
          <span className="text-gray-500 dark:text-gray-400">SENSEX</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">+0.8%</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          )}
        </button>

        <div 
          className="text-right group cursor-pointer"
          onClick={onOpenDeposit}
          title="Click to add funds"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">Cash Balance</p>
          <div className="flex items-center gap-2 justify-end">
            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{formatCurrency(portfolio.balance)}</p>
            <div className="bg-gray-200 dark:bg-gray-800 text-blue-600 dark:text-blue-500 rounded-full w-5 h-5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-white dark:border-gray-600 shadow-md"></div>
      </div>
    </header>
  );
};

export default Header;
