import React, { useState } from 'react';
import { ViewState } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';

const App = () => {
  const [currentView, setCurrentView] = useState(ViewState.DASHBOARD);

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Layout currentView={currentView} onChangeView={setCurrentView}>
          {currentView === ViewState.DASHBOARD && <Dashboard />}
          {currentView === ViewState.PORTFOLIO && <Portfolio />}
        </Layout>
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
