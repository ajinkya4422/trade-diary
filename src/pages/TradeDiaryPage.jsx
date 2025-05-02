// src/pages/TradeDiaryPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TradesView from '../components/TradesView';
import SummaryView from '../components/SummaryView';
import Header from '../components/Header';

export default function TradeDiaryPage() {
  const [view, setView] = useState('trades');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />
      <main className="main-content">
        <Header view={view} setView={setView} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        {view === 'trades' ? <TradesView /> : <SummaryView />}
      </main>
    </div>
  );
}
