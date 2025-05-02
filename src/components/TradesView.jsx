// src/components/TradesView.jsx
import React from 'react';

export default function TradesView() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center space-x-4">
        <div>
          <label className="block text-gray-700">Sell Dates</label>
          <input type="text" placeholder="Select Date Range" className="input" />
        </div>
        <div>
          <label className="block text-gray-700">Initial Total Capital:</label>
          <input type="text" placeholder="Enter portfolio" className="input w-48" />
          <button className="btn ml-2">Save</button>
        </div>
        <div>
          <label className="block text-gray-700">Sort:</label>
          <select className="input">
            <option>Date (Newest First)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700">Search Trades by Symbol…</label>
          <input type="text" className="input w-full" placeholder="Search Trades by Symbol..." />
        </div>
      </div>
      <div className="mt-12 text-center text-gray-500">No Data Found</div>
    </div>
  );
}
