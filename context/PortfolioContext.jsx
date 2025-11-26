import React, { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_PORTFOLIO = {
  // Give a default starting balance so users can try buying immediately
  balance: 100000,
  holdings: [],
  transactions: []
};

const PortfolioContext = createContext(undefined);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(() => {
    try {
      const savedRaw = localStorage.getItem('gemini_trader_portfolio');
      if (!savedRaw) return INITIAL_PORTFOLIO;
      const parsed = JSON.parse(savedRaw);

      // Coerce balance to a number if possible (handle formatted strings)
      const bal = Number(String(parsed.balance).replace(/[^0-9.-]+/g, ''));
      if (!Number.isFinite(bal)) {
        return INITIAL_PORTFOLIO;
      }
      parsed.balance = bal;

      // Ensure holdings have numeric quantities and prices
      if (Array.isArray(parsed.holdings)) {
        parsed.holdings = parsed.holdings.map(h => ({
          symbol: h.symbol,
          quantity: Number(h.quantity) || 0,
          averageBuyPrice: Number(h.averageBuyPrice) || 0
        }));
      } else {
        parsed.holdings = [];
      }

      // If saved portfolio looks empty (zero balance and no holdings), use INITIAL_PORTFOLIO
      if ((parsed.balance === 0 || parsed.balance === undefined) && (!parsed.holdings || parsed.holdings.length === 0)) {
        return INITIAL_PORTFOLIO;
      }

      return parsed;
    } catch (e) {
      return INITIAL_PORTFOLIO;
    }
  });

  useEffect(() => {
    localStorage.setItem('gemini_trader_portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addFunds = (amount) => {
    setPortfolio(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const buyStock = (stock, quantity) => {
    const cost = stock.price * quantity;

    setPortfolio(prev => {
      // Check using the latest state inside updater
      if (cost > prev.balance) return prev;

      const existingItem = prev.holdings.find(h => h.symbol === stock.symbol);
      let newHoldings = [...prev.holdings];

      if (existingItem) {
        const totalValue = (existingItem.quantity * existingItem.averageBuyPrice) + cost;
        const newQuantity = existingItem.quantity + quantity;
        const newAvg = totalValue / newQuantity;
        newHoldings = prev.holdings.map(h => h.symbol === stock.symbol ? { ...h, quantity: newQuantity, averageBuyPrice: newAvg } : h);
      } else {
        newHoldings.push({ symbol: stock.symbol, quantity, averageBuyPrice: stock.price });
      }

      return {
        ...prev,
        balance: prev.balance - cost,
        holdings: newHoldings,
        transactions: [
          {
            id: Date.now().toString(),
            symbol: stock.symbol,
            type: 'BUY',
            quantity,
            price: stock.price,
            date: new Date()
          },
          ...prev.transactions
        ]
      };
    });
  };

  const sellStock = (stock, quantity) => {
    const revenue = stock.price * quantity;

    setPortfolio(prev => {
      const holding = prev.holdings.find(h => h.symbol === stock.symbol);
      if (!holding || holding.quantity < quantity) return prev;

      let newHoldings = [];
      if (holding.quantity === quantity) {
        newHoldings = prev.holdings.filter(h => h.symbol !== stock.symbol);
      } else {
        newHoldings = prev.holdings.map(h => h.symbol === stock.symbol ? { ...h, quantity: h.quantity - quantity } : h);
      }

      return {
        ...prev,
        balance: prev.balance + revenue,
        holdings: newHoldings,
        transactions: [
          {
            id: Date.now().toString(),
            symbol: stock.symbol,
            type: 'SELL',
            quantity,
            price: stock.price,
            date: new Date()
          },
          ...prev.transactions
        ]
      };
    });
  };

  const resetPortfolio = () => setPortfolio(INITIAL_PORTFOLIO);

  return (
    <PortfolioContext.Provider value={{ portfolio, buyStock, sellStock, resetPortfolio, addFunds }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return context;
};
