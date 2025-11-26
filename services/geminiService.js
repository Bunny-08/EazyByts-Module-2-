const toJson = async (resp) => {
  try {
    return await resp.json();
  } catch (e) {
    return null;
  }
};

export const getStockAnalysis = async (symbol, price) => {
  const resp = await fetch('/api/stock-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol, price })
  });
  const j = await toJson(resp);
  return (j && j.text) || 'Analysis data unavailable.';
};

export const getMarketOverview = async () => {
  const resp = await fetch('/api/market-overview');
  const j = await toJson(resp);
  return (j && j.text) || 'Market sentiment data unavailable.';
};

export const getPortfolioAdvice = async (holdings, balance) => {
  const resp = await fetch('/api/portfolio-advice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ holdings, balance })
  });
  const j = await toJson(resp);
  return (j && j.text) || 'Advisory service unavailable.';
};
