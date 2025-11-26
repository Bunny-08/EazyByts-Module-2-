import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { subscribeToMarket } from '../services/mockMarketService';
import { getPortfolioAdvice } from '../services/geminiService';

const Portfolio = () => {
  const { portfolio } = usePortfolio();
  const [stocks, setStocks] = useState([]);
  const [portfolioAdvice, setPortfolioAdvice] = useState('');

  useEffect(() => {
    const unsub = subscribeToMarket(setStocks);
    return unsub;
  }, []);

  useEffect(() => {
    const holdings = portfolio.holdings.map(h => h.symbol);
    getPortfolioAdvice(holdings, portfolio.balance).then(setPortfolioAdvice);
  }, [portfolio.holdings.length, portfolio.balance]);

  const totalPortfolioValue = portfolio.balance + portfolio.holdings.reduce((acc, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return acc + (item.quantity * (stock?.price || 0));
  }, 0);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Net Worth</p>
            <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(totalPortfolioValue)}</p>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Cash Balance</p>
            <p className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatCurrency(portfolio.balance)}</p>
         </div>
         <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Positions</p>
            <p className="text-3xl font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">{portfolio.holdings.length}</p>
         </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border border-purple-200 dark:border-purple-500/30 rounded-xl relative overflow-hidden shadow-sm transition-colors">
        <div className="relative z-10">
           <h3 className="text-purple-700 dark:text-purple-300 font-bold mb-2 flex items-center gap-2">
             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
             AI Risk Assessment
           </h3>
           <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-3xl">
             {portfolioAdvice || "Analyzing your positions..."}
           </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium">Symbol</th>
                <th className="p-4 text-right font-medium">Qty</th>
                <th className="p-4 text-right font-medium">Avg Price</th>
                <th className="p-4 text-right font-medium">Current Price</th>
                <th className="p-4 text-right font-medium">Value</th>
                <th className="p-4 text-right font-medium">P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {portfolio.holdings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No holdings yet. Go to Dashboard to trade.
                  </td>
                </tr>
              ) : (
                portfolio.holdings.map(item => {
                   const currentStock = stocks.find(s => s.symbol === item.symbol);
                   const currentPrice = currentStock?.price || 0;
                   const marketValue = item.quantity * currentPrice;
                   const costBasis = item.quantity * item.averageBuyPrice;
                   const pl = marketValue - costBasis;
                   const plPercent = (pl / costBasis) * 100;

                   return (
                     <tr key={item.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                       <td className="p-4 font-bold text-gray-900 dark:text-white">{item.symbol}</td>
                       <td className="p-4 text-right font-mono text-gray-700 dark:text-gray-300">{item.quantity}</td>
                       <td className="p-4 text-right font-mono text-gray-500 dark:text-gray-400">₹{item.averageBuyPrice.toFixed(2)}</td>
                       <td className="p-4 text-right font-mono text-gray-900 dark:text-white">₹{currentPrice.toFixed(2)}</td>
                       <td className="p-4 text-right font-mono text-gray-900 dark:text-white font-bold">₹{marketValue.toFixed(2)}</td>
                       <td className={`p-4 text-right font-mono font-bold ${pl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                         {pl >= 0 ? '+' : ''}{pl.toFixed(2)} ({plPercent.toFixed(2)}%)
                       </td>
                     </tr>
                   );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
