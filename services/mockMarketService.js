const MARKET_CONFIG = {
  tickInterval: 2000,
  volatility: {
    crypto: 0.008,
    equity: 0.003
  }
};

const INITIAL_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2950.00, change: 15.25, changePercent: 0.52, category: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Svc', price: 4120.50, change: -12.45, changePercent: -0.30, category: 'Tech' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1450.80, change: 8.20, changePercent: 0.57, category: 'Finance' },
  { symbol: 'INFY', name: 'Infosys Limited', price: 1630.30, change: 5.80, changePercent: 0.36, category: 'Tech' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 980.10, change: 22.10, changePercent: 2.31, category: 'Auto' },
  { symbol: 'ZOMATO', name: 'Zomato Limited', price: 165.50, change: 3.50, changePercent: 2.16, category: 'Tech' },
  { symbol: 'BTC-INR', name: 'Bitcoin INR', price: 5650000.00, change: -45000, changePercent: -0.79, category: 'Crypto' },
  { symbol: 'ETH-INR', name: 'Ethereum INR', price: 315000.00, change: -2100, changePercent: -0.66, category: 'Crypto' },
];

let subscribers = [];
let currentStocks = [...INITIAL_STOCKS];
let intervalId = null;

const simulateMarketMovement = () => {
  currentStocks = currentStocks.map(stock => {
    const isCrypto = stock.category === 'Crypto';
    const volatility = isCrypto ? MARKET_CONFIG.volatility.crypto : MARKET_CONFIG.volatility.equity;
    
    const drift = 0;
    const shock = (Math.random() * 2 - 1) * volatility;
    const changeFactor = 1 + drift + shock;
    
    const newPrice = Number((stock.price * changeFactor).toFixed(2));
    const priceChange = Number((newPrice - stock.price).toFixed(2));
    
    const totalChange = Number((stock.change + priceChange).toFixed(2));
    const totalChangePercent = Number(((totalChange / (newPrice - totalChange)) * 100).toFixed(2));

    return {
      ...stock,
      price: newPrice,
      change: totalChange,
      changePercent: totalChangePercent
    };
  });

  subscribers.forEach(cb => cb(currentStocks));
};

export const subscribeToMarket = (callback) => {
  subscribers.push(callback);
  callback(currentStocks);

  if (!intervalId) {
    intervalId = setInterval(simulateMarketMovement, MARKET_CONFIG.tickInterval);
  }

  return () => {
    subscribers = subscribers.filter(s => s !== callback);
    if (subscribers.length === 0 && intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

export const getHistoricalData = (basePrice) => {
  const data = [];
  let price = basePrice * 0.98; 
  for (let i = 0; i < 20; i++) {
    price = price * (1 + (Math.random() * 0.02 - 0.01));
    data.push({
      time: `${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`,
      value: Number(price.toFixed(2))
    });
  }
  return data;
};
