import React, { useState, useEffect } from 'react';
import { getStockAnalysis } from '../services/geminiService';

const AiInsight = ({ stock }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchAnalysis = async () => {
      setLoading(true);
      setAnalysis('');
      const result = await getStockAnalysis(stock.symbol, stock.price);
      if (isMounted) {
        setAnalysis(result);
        setLoading(false);
      }
    };

    fetchAnalysis();
    return () => { isMounted = false; };
  }, [stock.symbol]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm mt-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Technical Analysis
        </h3>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
          AI Model: Gemini 2.5
        </span>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {analysis}
          </p>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
          Disclaimer: Automated technical analysis based on current price action. Not financial advice.
        </p>
      </div>
    </div>
  );
};

export default AiInsight;
