// src/components/Sidebar.jsx
import React from 'react';
// import './Sidebar.css'; // Optional for styling

const menuItems = [
  { label: 'My Rule Book', icon: '📖' },
  { label: 'Add Trades', icon: '+' },
  { label: 'Manage Trades', icon: '🗂️' },
  { label: 'Open Positions', icon: '📁' },
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Trade Diary', icon: '📓', active: true },
  { label: 'ChartsMaze Screener', icon: '🔍' },
  { label: 'Help or Feedback', icon: '💬' },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="logo">
        <span className="logo-primary">CHART</span>
        <span className="logo-secondary">MAZE</span>
      </div>
      <nav className="nav-links">
        {menuItems.map(item => (
          <button
            key={item.label}
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="profile">
        <div className="avatar">PI</div>
        <span>Proud Indian</span>
      </div>
    </aside>
  );
}
