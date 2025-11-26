import React, { useState, useEffect } from 'react';
import { subscribeToMarket, getHistoricalData } from '../services/mockMarketService';
import { getMarketOverview } from '../services/geminiService';
import { usePortfolio } from '../context/PortfolioContext';
import StockChart from '../components/StockChart';
import TradePanel from '../components/TradePanel';
import AiInsight from '../components/AiInsight';
import StockList from '../components/StockList';

const Dashboard = () => {
  const { portfolio } = usePortfolio();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [marketSummary, setMarketSummary] = useState('Initializing market feed...');

  useEffect(() => {
    const unsub = subscribeToMarket((data) => {
      setStocks(data);
      if (selectedStock) {
        const updated = data.find(s => s.symbol === selectedStock.symbol);
        if (updated) setSelectedStock(updated);
      } else if (data.length > 0) {
        setSelectedStock(data[0]);
      }
    });

    getMarketOverview().then(setMarketSummary);
    return unsub;
  }, []);

  if (!selectedStock) return <div className="flex h-full items-center justify-center text-gray-500">Connecting to Exchange...</div>;

  return (
    <>
      <div className="mb-6 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
         <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold whitespace-nowrap text-sm uppercase tracking-wider">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
           Market Sentiment
         </div>
         <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 hidden md:block"></div>
         <p className="text-sm text-gray-600 dark:text-gray-300">{marketSummary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-1">
          <StockList 
            stocks={stocks} 
            selectedSymbol={selectedStock.symbol} 
            onSelect={setSelectedStock} 
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  {selectedStock.symbol}
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{selectedStock.category}</span>
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                 <p className="text-3xl font-mono font-bold text-gray-900 dark:text-white">₹{selectedStock.price.toFixed(2)}</p>
                 <div className={`flex items-center justify-end gap-1 text-sm font-medium ${selectedStock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                   <span>{selectedStock.change >= 0 ? '▲' : '▼'}</span>
                   <span>{Math.abs(selectedStock.change)} ({selectedStock.changePercent}%)</span>
                 </div>
              </div>
            </div>
            
            <StockChart 
              data={getHistoricalData(selectedStock.price)} 
              color={selectedStock.change >= 0 ? '#10b981' : '#f43f5e'} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TradePanel stock={selectedStock} />
            <AiInsight stock={selectedStock} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
