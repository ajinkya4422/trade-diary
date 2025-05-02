// src/components/TradeDiaryPage.jsx
import React, { useState } from 'react';
import './TradeDiary.css';
import Sidebar from './Sidebar';
import TradesView from './TradesView';
import SummaryView from './SummaryView';
import Header from './Header';

const TradeDiaryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="p-6 space-y-6">
          <TradesView />
          <SummaryView />
        </div>
      </div>
    </div>
  );
};

export default TradeDiaryPage;
