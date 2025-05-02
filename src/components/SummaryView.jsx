// src/components/SummaryView.jsx
import React from 'react';

export default function SummaryView() {
  const cards = [
    'Situational Awareness Analysis',
    'Entry Trigger Analysis',
    'Risk Management Analysis',
    'Exit Trigger Analysis',
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cards.map((title) => (
        <div key={title} className="card">
          <h3 className="card-title">{title}</h3>
          <div className="flex space-x-8 text-center">
            {['Good', 'Bad', 'Unknown'].map((label) => (
              <div key={label} className="flex-1">
                <div className="text-sm text-gray-500">{label}</div>
                <div className={`text-2xl font-bold ${label.toLowerCase()}`}>
                  N/A
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
