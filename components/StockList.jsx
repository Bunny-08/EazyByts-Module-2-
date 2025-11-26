import React from 'react';

const StockList = ({ stocks, selectedSymbol, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Watchlist</h2>
      </div>
      <div className="space-y-2">
        {stocks.map(stock => (
          <div 
            key={stock.symbol}
            onClick={() => onSelect(stock)}
            className={`p-4 rounded-xl cursor-pointer border transition-all ${
              selectedSymbol === stock.symbol 
                ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-900/20 ring-1 ring-blue-500' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{stock.symbol}</h3>
                <p className="text-xs text-gray-500">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-900 dark:text-white font-mono font-medium">₹{stock.price.toFixed(2)}</p>
                <p className={`text-xs font-bold ${stock.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockList;
