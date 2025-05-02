// src/components/Header.jsx
import React from 'react';

export default function Header({ view, setView, toggleSidebar }) {
  return (
    <div className="header">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <div className="view-toggle">
        <button onClick={() => setView('trades')} className={view === 'trades' ? 'active' : ''}>Trades</button>
        <button onClick={() => setView('summary')} className={view === 'summary' ? 'active' : ''}>Summary</button>
      </div>
      <div>
        <span className="mr-2">Load:</span>
        <select className="select">
          <option>—</option>
        </select>
      </div>
    </div>
  );
}
