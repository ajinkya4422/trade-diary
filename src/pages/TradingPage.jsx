import React, { useState } from 'react';

// Add this CSS to your stylesheet (App.css or index.css)
const cssVariables = `
:root {
  --background: rgb(244, 247, 250);
  --foreground: rgb(29, 38, 48);
  --cardBackground: rgb(255, 255, 255);
  --sidebarBackground: rgb(63, 77, 103);
  --icon: rgb(91, 107, 121);
  --brand-primary: #6062ff;
  --brand-secondary: #0fc692;
  --brand-red: #F23645;
  --font-grey: rgb(169, 183, 208);
  --bg-dark: rgba(33, 37, 41, 0.7);
  --bg-grey: rgba(33, 37, 41, 0.3);
}
`;

const TradeDiaryPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [initialCapital, setInitialCapital] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [activeView, setActiveView] = useState('trades');
  const [trades] = useState([
    { id: 1, date: '2023-08-15', symbol: 'EURUSD', direction: 'Long', entry: 1.1025, exit: 1.1085, pnl: 60, strategy: 'Breakout', timeframe: '15m' },
    { id: 2, date: '2023-08-14', symbol: 'GBPUSD', direction: 'Short', entry: 1.2750, exit: 1.2690, pnl: 60, strategy: 'Retracement', timeframe: '1H' },
  ]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <style>{cssVariables}</style>
      
        {/* Sidebar */}
        <aside
            className={`fixed inset-y-0 left-0 z-20 w-64 transform shadow-lg transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ backgroundColor: 'var(--sidebarBackground)' }}
        >
        <div className="p-4 border-b" style={{ borderColor: 'var(--bg-grey)' }}>
          <a href="/">
            <img 
              alt="Chartsmaze Logo" 
              width="160" 
              height="27" 
              src="https://tradejournal.chartsmaze.com/logo.svg" 
              className="sidebar-logo"
            />
          </a>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {['My Rule Book', 'Add Trades', 'Manage Trades', 'Open Positions', 'Dashboard', 'Trade Diary', 
              'Chart-Maze Screener', 'Help or Feedback'].map((item) => (
              <li key={item} className="group">
                <a href="#" className="flex items-center p-2 rounded transition-colors" 
                  style={{
                    color: 'var(--font-grey)',
                    backgroundColor: item === 'Trade Diary' ? 'var(--brand-primary)' : 'transparent',
                    '&:hover': { backgroundColor: 'var(--bg-grey)' }
                  }}>
                  <span className="material-symbols-rounded mr-3" 
                    style={{ color: item === 'Trade Diary' ? '#fff' : 'var(--icon)' }}>
                    {getIconForMenuItem(item)}
                  </span>
                  <span style={{ color: item === 'Trade Diary' ? '#fff' : 'var(--font-grey)' }}>
                    {item}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--bg-grey)' }}>
          <div className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-700">
            <div className="flex items-center">
              <img 
                alt="User" 
                width="40" 
                height="40" 
                src="https://tradejournal.chartsmaze.com/icons/userImage.png" 
                className="rounded-full mr-3"
              />
              <span className="font-medium" style={{ color: 'var(--font-grey)' }}>Proud Indian</span>
            </div>
            <span className="material-symbols-rounded" style={{ color: 'var(--icon)' }}>expand_more</span>
          </div>
        </div>
        
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-margin duration-300 ease-in-out 
        ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>

        {/* Header */}
        <header className="flex justify-between items-center m-4">
          <div className="flex">
              {/* Hamburger Menu Button */}
              <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="z-30 p-2 rounded-lg hover:bg-[var(--bg-grey)]"
              >
              <div className="w-6 h-6 relative focus:outline-none">
                  <span className={`block absolute h-0.5 w-full bg-[var(--foreground)] 
                  transition-transform duration-300
                  ${isSidebarOpen ? 'rotate-45 top-1/2' : 'top-1'}`}></span>
                  <span className={`block absolute h-0.5 w-full bg-[var(--foreground)] 
                  transition-opacity duration-300 top-1/2
                  ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block absolute h-0.5 w-full bg-[var(--foreground)] 
                  transition-transform duration-300
                  ${isSidebarOpen ? '-rotate-45 top-1/2' : 'bottom-1'}`}></span>
              </div>
              </button>

              <div className={`flex p-4 transition-opacity duration-300 ${
                  isSidebarOpen ? 'opacity-0 md:opacity-0' : 'opacity-100'
                  }`} style={{ borderColor: 'var(--bg-grey)' }}>
                  <a href="/">
                      <img 
                      alt="Chartsmaze Logo" 
                      width="160" 
                      height="27" 
                      src="https://tradejournal.chartsmaze.com/logo.svg" 
                      className="sidebar-logo"
                      />
                  </a>
              </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search trades..." 
                className="pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                style={{
                  backgroundColor: 'var(--cardBackground)',
                  border: '1px solid var(--bg-grey)',
                  color: 'var(--foreground)'
                }}
              />
              <span className="material-symbols-rounded absolute left-3 top-2.5" 
                style={{ color: 'var(--icon)' }}>search</span>
            </div>
          </div>
        </header>
        
        <div className="flex justify-center gap-6">
        
        {/* View Toggle */}
        <div className="flex m-6 rounded-full  w-fit border-2 rounded-full" 
          style={{
            backgroundColor: 'var(--cardBackground)',
            borderColor: 'var(--bg-grey)'
          }}>
          {['trades', 'summary'].map((viewType) => (
            <button
              key={viewType}
              onClick={() => setActiveView(viewType)}
              className={`px-6 py-2 rounded-full transition-colors ${
                activeView === viewType 
                  ? 'text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: activeView === viewType ? 'var(--brand-secondary)' : 'transparent',
                color: activeView === viewType ? '#fff' : 'var(--foreground)'
              }}>
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </button>
          ))}
        </div>

        {/* drop down */}
        <div className="flex items-center gap-2">
            <span>Load:</span>
            <select
                className="rounded-full border border-gray-300 px-4 py-2"
                style={{
                height: '40px',
                minWidth: '120px',
                backgroundColor: 'white',
                }}
            >
                <option value="">Select</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
            </select>
        </div>
        </div>
    
        <div className="flex justify-center m-4">
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search trades by symbol"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg focus:outline-none"
                  style={{
                    backgroundColor: 'var(--cardBackground)',
                    border: '1px solid var(--bg-grey)',
                    color: 'var(--foreground)'
                  }}
                />
                <span className="material-symbols-rounded absolute left-3 top-2.5"
                  style={{ color: 'var(--icon)' }}>search</span>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
                className="rounded-full border border-gray-300 px-4 py-2"
                style={{
                  height: '40px',
                  backgroundColor: 'white',
                  minWidth: '120px',
                }}
              >
                <option value="">Sort By</option>
                <option value="date">Date</option>
                <option value="pnl">Profit/Loss</option>
              </select>
            </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center m-4">
            <div className="flex items-center">
                {/* Initial Total Capital Input */}
                <label className="font-bold">
                    Initial Total Capital Input : 
                </label>
                <input
                type="number"
                placeholder="Initial Total Capital"
                value={initialCapital}
                onChange={(e) => setInitialCapital(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300"
                style={{
                    backgroundColor: 'var(--cardBackground)',
                    color: 'var(--foreground)',
                    minWidth: '240px'
                    }}
                    />
            </div>

            <div className="flex">
                {/* Save Button with Icon */}
                <button
                className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                <span className="material-symbols-rounded">Save</span> Save
                </button>
            </div>
        </div>
    

        {/* Content Area */}
        {activeView === 'trades' ? (
          <div className="rounded-lg shadow overflow-hidden m-4" 
            style={{ backgroundColor: 'var(--cardBackground)' }}>
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 p-4 font-medium text-sm" 
              style={{
                backgroundColor: 'var(--bg-grey)',
                color: 'var(--foreground)'
              }}>
              {['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'P/L', 'Strategy', 'Timeframe'].map(
                (header) => (
                  <div key={header}>{header}</div>
                )
              )}
            </div>
            
            {/* Table Rows */}
            {trades.map((trade) => (
              <div key={trade.id} className="grid grid-cols-8 gap-4 p-4 border-t text-sm"
                style={{
                  borderColor: 'var(--bg-grey)',
                  color: 'var(--foreground)'
                }}>
                <div>{trade.date}</div>
                <div className="font-medium">{trade.symbol}</div>
                <div className={`font-medium ${
                  trade.direction === 'Long' ? 'text-green-600' : 'text-red-600'
                }`} style={{
                  color: trade.direction === 'Long' 
                    ? 'var(--brand-secondary)' 
                    : 'var(--brand-red)'
                }}>
                  {trade.direction}
                </div>
                <div>{trade.entry}</div>
                <div>{trade.exit}</div>
                <div className={`font-medium ${
                  trade.pnl > 0 ? 'text-green-600' : 'text-red-600'
                }`} style={{
                  color: trade.pnl > 0 
                    ? 'var(--brand-secondary)' 
                    : 'var(--brand-red)'
                }}>
                  ${trade.pnl}
                </div>
                <div>{trade.strategy}</div>
                <div>{trade.timeframe}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6 m-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* <!-- Situational Awareness Analysis --> */}
                <div className="flex flex-col bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm items-center p-3">
                    <h4 className="text-3xl font-bold text-[var(--foreground)]">Situational Awareness Analysis</h4>
                    <div>
                        <div className="undefined mt-4 flex flex-row gap-4 mx-auto">
                            <div>
                                <label>Good</label>
                                <p className="text-red-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Bad</label>
                                <p className="text-green-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Unknown</label>
                                <p className="text-2xl">N/A</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Entry Trigger Analysis --> */}
                <div className="flex flex-col bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm items-center p-3">
                    <h4 className="text-3xl font-bold text-[var(--foreground)]">Entry Trigger Analysis</h4>
                    <div>
                        <div className="undefined mt-4 flex flex-row gap-4 mx-auto">
                            <div>
                                <label>Good</label>
                                <p className="text-red-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Bad</label>
                                <p className="text-green-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Unknown</label>
                                <p className="text-2xl">N/A</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <!-- Risk Management Analysis --> */}
                <div className="flex flex-col bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm items-center p-3">
                    <h4 className="text-3xl font-bold text-[var(--foreground)]">Risk Management Analysis</h4>
                    <div>
                        <div className="undefined mt-4 flex flex-row gap-4 mx-auto">
                            <div>
                                <label>Good</label>
                                <p className="text-red-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Bad</label>
                                <p className="text-green-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Unknown</label>
                                <p className="text-2xl">N/A</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Exit Trigger Analysis --> */}
                <div className="flex flex-col bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm items-center p-3">
                    <h4 className="text-3xl font-bold text-[var(--foreground)]">Exit Trigger Analysis</h4>
                    <div>
                        <div className="undefined mt-4 flex flex-row gap-4 mx-auto">
                            <div>
                                <label>Good</label>
                                <p className="text-red-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Bad</label>
                                <p className="text-green-600 text-2xl">N/A</p>
                            </div>
                            <div>
                                <label>Unknown</label>
                                <p className="text-2xl">N/A</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
   
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function for menu icons
const getIconForMenuItem = (label) => {
  const icons = {
    'My Rule Book': 'format_list_bulleted',
    'Add Trades': 'add',
    'Manage Trades': 'bookmark_manager',
    'Open Positions': 'folder_open',
    'Dashboard': 'home',
    'Trade Diary': 'format_list_bulleted',
    'Chart-Maze Screener': 'search',
    'Help or Feedback': 'feedback'
  };
  return icons[label] || 'circle';
};

export default TradeDiaryPage;