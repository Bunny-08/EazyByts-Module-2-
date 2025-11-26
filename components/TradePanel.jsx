import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const TradePanel = ({ stock }) => {
  const { buyStock, sellStock, portfolio } = usePortfolio();
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState('BUY');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const holding = portfolio.holdings.find(h => h.symbol === stock.symbol);
  const ownedQuantity = holding ? holding.quantity : 0;
  
  const totalCost = stock.price * quantity;
  const canBuy = portfolio.balance >= totalCost;
  const canSell = ownedQuantity >= quantity;

  const handleTrade = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'BUY') {
      if (!canBuy) {
        setErrorMsg('Insufficient funds to complete this purchase.');
        return;
      }
      buyStock(stock, quantity);
      setSuccessMsg(`Bought ${quantity} ${stock.symbol}`);
    } else {
      if (!canSell) {
        setErrorMsg('You do not own enough shares to sell.');
        return;
      }
      sellStock(stock, quantity);
      setSuccessMsg(`Sold ${quantity} ${stock.symbol}`);
    }

    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Trade {stock.symbol}</h3>
      
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <button
          onClick={() => setMode('BUY')}
          className={`flex-1 py-2 rounded-md font-semibold transition-all ${
            mode === 'BUY' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('SELL')}
          className={`flex-1 py-2 rounded-md font-semibold transition-all ${
            mode === 'SELL' 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Available Cash:</span>
          <span className="text-gray-900 dark:text-white font-mono">₹{portfolio.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Owned Shares:</span>
          <span className="text-gray-900 dark:text-white font-mono">{ownedQuantity}</span>
        </div>

        <div className="pt-4">
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Quantity</label>
          <input 
            type="number" 
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono text-lg transition-colors"
          />
        </div>

        <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <span className="text-gray-500 dark:text-gray-400">Total Estimate</span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <button
          onClick={handleTrade}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-transform active:scale-95 ${
            mode === 'BUY' 
              ? (canBuy ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed')
              : (canSell ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/30' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed')
          }`}
        >
          {mode === 'BUY' ? 'Confirm Purchase' : 'Confirm Sale'}
        </button>
        
        {successMsg && (
            <div className="text-center text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-pulse">
                {successMsg}
            </div>
        )}

        {errorMsg && (
            <div className="text-center text-rose-600 dark:text-rose-400 text-sm font-medium">
                {errorMsg}
            </div>
        )}
      </div>
    </div>
  );
};

export default TradePanel;
