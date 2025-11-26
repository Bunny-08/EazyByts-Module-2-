import React from 'react';
import { ViewState } from '../types';
import { usePortfolio } from '../context/PortfolioContext';

const Sidebar = ({ currentView, onChangeView, isOpen, onClose }) => {
  const { portfolio } = usePortfolio();
  
  const totalValue = portfolio.balance + portfolio.holdings.reduce((acc, h) => acc + (h.quantity * h.averageBuyPrice), 0);
  
  const navClass = (view) => `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
    currentView === view 
      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
  }`;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">TradeFlow</h1>
        </div>

        <nav className="p-4 space-y-2">
          <button onClick={() => { onChangeView(ViewState.DASHBOARD); onClose(); }} className={navClass(ViewState.DASHBOARD)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span>Overview</span>
          </button>
          
          <button onClick={() => { onChangeView(ViewState.PORTFOLIO); onClose(); }} className={navClass(ViewState.PORTFOLIO)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <span>My Portfolio</span>
          </button>
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Total Equity</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
               {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalValue)}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
