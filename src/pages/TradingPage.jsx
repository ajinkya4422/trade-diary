import React, { useState, useMemo } from 'react';

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
  const [initialCapital, setInitialCapital] = useState('10000');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');
  const [activeView, setActiveView] = useState('trades');
  const [filterStrategy, setFilterStrategy] = useState('');
  const [filterProfitability, setFilterProfitability] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showAddTradeModal, setShowAddTradeModal] = useState(false);
  const [trades, setTrades] = useState([
    { id: 1, date: '2023-08-15', symbol: 'EURUSD', direction: 'Long', entry: 1.1025, exit: 1.1085, pnl: 60, strategy: 'Breakout', timeframe: '15m', riskReward: 1.5, notes: 'Clean breakout above resistance' },
    { id: 2, date: '2023-08-14', symbol: 'GBPUSD', direction: 'Short', entry: 1.2750, exit: 1.2690, pnl: 60, strategy: 'Retracement', timeframe: '1H', riskReward: 2.0, notes: 'Tested support and rejected' },
    { id: 3, date: '2023-08-13', symbol: 'USDJPY', direction: 'Long', entry: 135.50, exit: 135.20, pnl: -30, strategy: 'Support', timeframe: '4H', riskReward: 1.0, notes: 'Failed to hold support' },
  ]);

  // Calculate trade statistics
  const statistics = useMemo(() => {
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    const winRate = totalTrades > 0 ? ((winningTrades.length / totalTrades) * 100).toFixed(2) : 0;
    const avgWin = winningTrades.length > 0 ? (winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length).toFixed(2) : 0;
    const avgLoss = losingTrades.length > 0 ? Math.abs((losingTrades.reduce((sum, t) => sum + t.pnl, 0) / losingTrades.length).toFixed(2)) : 0;
    const profitFactor = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : avgWin > 0 ? 'Infinite' : 0;
    
    return { totalTrades, winningTrades: winningTrades.length, losingTrades: losingTrades.length, totalPnL, winRate, avgWin, avgLoss, profitFactor };
  }, [trades]);

  // Filter trades based on search, date range, strategy, and profitability
  const filteredTrades = useMemo(() => {
    let result = trades;
    
    if (searchTerm) {
      result = result.filter(t => t.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (filterStrategy) {
      result = result.filter(t => t.strategy === filterStrategy);
    }
    
    if (filterProfitability) {
      result = result.filter(t => filterProfitability === 'profit' ? t.pnl > 0 : t.pnl < 0);
    }
    
    if (startDate) {
      result = result.filter(t => new Date(t.date) >= new Date(startDate));
    }
    
    if (endDate) {
      result = result.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    if (sortType === 'date') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortType === 'pnl') {
      result.sort((a, b) => b.pnl - a.pnl);
    }
    
    return result;
  }, [trades, searchTerm, filterStrategy, filterProfitability, startDate, endDate, sortType]);

  const handleDeleteTrade = (id) => {
    setTrades(trades.filter(t => t.id !== id));
    setSelectedTrade(null);
  };

  const handleAddTrade = (newTrade) => {
    const trade = {
      ...newTrade,
      id: Math.max(...trades.map(t => t.id), 0) + 1
    };
    setTrades([...trades, trade]);
    setShowAddTradeModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'P/L', 'Strategy', 'Timeframe', 'Risk/Reward', 'Notes'];
    const rows = filteredTrades.map(t => [
      t.date, t.symbol, t.direction, t.entry, t.exit, t.pnl, t.strategy, t.timeframe, t.riskReward, t.notes
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

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
        
        <div className="flex justify-center gap-6 flex-wrap">
        
        {/* View Toggle */}
        <div className="flex m-6 rounded-full  w-fit border-2 rounded-full" 
          style={{
            backgroundColor: 'var(--cardBackground)',
            borderColor: 'var(--bg-grey)'
          }}>
          {['trades', 'summary', 'analytics'].map((viewType) => (
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

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-4 py-2 rounded-full hover:opacity-90 transition m-6"
        >
          <span className="material-symbols-rounded text-sm">download</span> Export CSV
        </button>

        {/* Add Trade Button */}
        <button
          onClick={() => setShowAddTradeModal(true)}
          className="flex items-center gap-2 bg-[var(--brand-secondary)] text-white px-4 py-2 rounded-full hover:opacity-90 transition m-6"
        >
          <span className="material-symbols-rounded text-sm">add</span> Add Trade
        </button>
        </div>
    
        <div className="flex justify-center m-4 flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
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
                <option value="date">Date (Newest)</option>
                <option value="pnl">Profit/Loss</option>
              </select>

              {/* Strategy Filter */}
              <select
                value={filterStrategy}
                onChange={(e) => setFilterStrategy(e.target.value)}
                className="rounded-full border border-gray-300 px-4 py-2"
                style={{
                  height: '40px',
                  backgroundColor: 'white',
                  minWidth: '120px',
                }}
              >
                <option value="">All Strategies</option>
                <option value="Breakout">Breakout</option>
                <option value="Retracement">Retracement</option>
                <option value="Support">Support</option>
              </select>

              {/* Profitability Filter */}
              <select
                value={filterProfitability}
                onChange={(e) => setFilterProfitability(e.target.value)}
                className="rounded-full border border-gray-300 px-4 py-2"
                style={{
                  height: '40px',
                  backgroundColor: 'white',
                  minWidth: '120px',
                }}
              >
                <option value="">All Trades</option>
                <option value="profit">Winning Trades</option>
                <option value="loss">Losing Trades</option>
              </select>

              {/* Date Range Filters */}
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-300"
                style={{
                  backgroundColor: 'white',
                }}
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-300"
                style={{
                  backgroundColor: 'white',
                }}
              />

              {/* Clear Filters */}
              {(searchTerm || sortType || filterStrategy || filterProfitability || startDate || endDate) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSortType('');
                    setFilterStrategy('');
                    setFilterProfitability('');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="px-4 py-2 rounded-full border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear Filters
                </button>
              )}
            </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center m-4">
            <div className="flex items-center">
                {/* Initial Total Capital Input */}
                <label className="font-bold">
                    Initial Capital: 
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
                    minWidth: '180px'
                    }}
                    />
            </div>

            <div className="flex">
                {/* Save Button with Icon */}
                <button
                className="flex items-center gap-2 bg-[var(--brand-primary)] text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                <span className="material-symbols-rounded">Save</span> Save Capital
                </button>
            </div>
        </div>

        {/* Trade Statistics Dashboard */}
        {activeView === 'trades' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 m-4">
            <div className="bg-white rounded-lg p-4 border border-[var(--bg-grey)] shadow-sm">
              <div className="text-xs text-[var(--font-grey)] uppercase tracking-wider">Total Trades</div>
              <div className="text-3xl font-bold text-[var(--foreground)]">{statistics.totalTrades}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[var(--bg-grey)] shadow-sm">
              <div className="text-xs text-[var(--font-grey)] uppercase tracking-wider">Win Rate</div>
              <div className="text-3xl font-bold" style={{ color: statistics.winRate >= 50 ? 'var(--brand-secondary)' : 'var(--brand-red)' }}>{statistics.winRate}%</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[var(--bg-grey)] shadow-sm">
              <div className="text-xs text-[var(--font-grey)] uppercase tracking-wider">Total P/L</div>
              <div className="text-3xl font-bold" style={{ color: statistics.totalPnL > 0 ? 'var(--brand-secondary)' : 'var(--brand-red)' }}>${statistics.totalPnL}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-[var(--bg-grey)] shadow-sm">
              <div className="text-xs text-[var(--font-grey)] uppercase tracking-wider">Profit Factor</div>
              <div className="text-3xl font-bold text-[var(--foreground)]">{statistics.profitFactor}</div>
            </div>
          </div>
        )}
    
    

        {/* Content Area */}
        {activeView === 'trades' ? (
          <div className="rounded-lg shadow overflow-hidden m-4" 
            style={{ backgroundColor: 'var(--cardBackground)' }}>
            {/* Table Header */}
            <div className="grid gap-4 p-4 font-medium text-sm overflow-x-auto" 
              style={{
                backgroundColor: 'var(--bg-grey)',
                color: 'var(--foreground)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))'
              }}>
              {['Date', 'Symbol', 'Direction', 'Entry', 'Exit', 'P/L', 'Strategy', 'Timeframe', 'R/R', 'Notes', 'Actions'].map(
                (header) => (
                  <div key={header} className="text-xs">{header}</div>
                )
              )}
            </div>
            
            {/* Table Rows */}
            {filteredTrades.length > 0 ? (
              filteredTrades.map((trade) => (
                <div key={trade.id} className="grid gap-4 p-4 border-t text-sm"
                  style={{
                    borderColor: 'var(--bg-grey)',
                    color: 'var(--foreground)',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))'
                  }}>
                  <div>{trade.date}</div>
                  <div className="font-medium">{trade.symbol}</div>
                  <div className="font-medium" style={{
                    color: trade.direction === 'Long' 
                      ? 'var(--brand-secondary)' 
                      : 'var(--brand-red)'
                  }}>
                    {trade.direction}
                  </div>
                  <div>{trade.entry}</div>
                  <div>{trade.exit}</div>
                  <div className="font-medium" style={{
                    color: trade.pnl > 0 
                      ? 'var(--brand-secondary)' 
                      : 'var(--brand-red)'
                  }}>
                    ${trade.pnl}
                  </div>
                  <div>{trade.strategy}</div>
                  <div>{trade.timeframe}</div>
                  <div className="text-xs">{trade.riskReward}:1</div>
                  <div className="text-xs truncate" title={trade.notes}>{trade.notes}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTrade(trade)}
                      className="text-blue-600 hover:text-blue-800 text-xs"
                      title="View Details"
                    >
                      <span className="material-symbols-rounded text-base">visibility</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTrade(trade.id)}
                      className="text-red-600 hover:text-red-800 text-xs"
                      title="Delete Trade"
                    >
                      <span className="material-symbols-rounded text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-[var(--font-grey)]">
                No trades found. Try adjusting your filters or add a new trade.
              </div>
            )}
          </div>
        ) : activeView === 'analytics' ? (
          <div className="space-y-6 m-4">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm p-4">
                <h4 className="text-sm font-bold text-[var(--font-grey)] uppercase mb-2">Winning Trades</h4>
                <div className="text-4xl font-bold text-[var(--brand-secondary)]">{statistics.winningTrades}</div>
                <div className="text-xs text-[var(--font-grey)] mt-2">Avg Win: ${statistics.avgWin}</div>
              </div>
              <div className="bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm p-4">
                <h4 className="text-sm font-bold text-[var(--font-grey)] uppercase mb-2">Losing Trades</h4>
                <div className="text-4xl font-bold text-[var(--brand-red)]">{statistics.losingTrades}</div>
                <div className="text-xs text-[var(--font-grey)] mt-2">Avg Loss: ${statistics.avgLoss}</div>
              </div>
              <div className="bg-white rounded-lg border border-[var(--bg-grey)] shadow-sm p-4">
                <h4 className="text-sm font-bold text-[var(--font-grey)] uppercase mb-2">Strategy Breakdown</h4>
                <div className="text-sm mt-2 space-y-1">
                  {['Breakout', 'Retracement', 'Support'].map(strategy => {
                    const count = filteredTrades.filter(t => t.strategy === strategy).length;
                    return <div key={strategy}><span className="text-xs">{strategy}:</span> <span className="font-bold">{count}</span></div>;
                  })}
                </div>
              </div>
            </div>
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

        {/* Trade Details Modal */}
        {selectedTrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
              style={{ backgroundColor: 'var(--cardBackground)' }}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--bg-grey)' }}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Trade Details - {selectedTrade.symbol}
                  </h2>
                  <button
                    onClick={() => setSelectedTrade(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Date</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.date}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Direction</label>
                    <p className="font-bold" style={{
                      color: selectedTrade.direction === 'Long' ? 'var(--brand-secondary)' : 'var(--brand-red)'
                    }}>{selectedTrade.direction}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Entry Price</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.entry}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Exit Price</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.exit}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Strategy</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.strategy}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Timeframe</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.timeframe}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">P/L</label>
                    <p className="font-bold text-lg" style={{
                      color: selectedTrade.pnl > 0 ? 'var(--brand-secondary)' : 'var(--brand-red)'
                    }}>${selectedTrade.pnl}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--font-grey)] uppercase">Risk/Reward</label>
                    <p className="font-bold" style={{ color: 'var(--foreground)' }}>{selectedTrade.riskReward}:1</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[var(--font-grey)] uppercase">Notes</label>
                  <p style={{ color: 'var(--foreground)' }}>{selectedTrade.notes}</p>
                </div>
              </div>
              <div className="p-6 border-t flex gap-3" style={{ borderColor: 'var(--bg-grey)' }}>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDeleteTrade(selectedTrade.id);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Trade
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Trade Modal */}
        {showAddTradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
              style={{ backgroundColor: 'var(--cardBackground)' }}>
              <div className="p-6 border-b" style={{ borderColor: 'var(--bg-grey)' }}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
                    Add New Trade
                  </h2>
                  <button
                    onClick={() => setShowAddTradeModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="material-symbols-rounded">close</span>
                  </button>
                </div>
              </div>
              <AddTradeForm onSubmit={handleAddTrade} onCancel={() => setShowAddTradeModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add Trade Form Component
const AddTradeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState({
    date: new Date().toISOString().split('T')[0],
    symbol: '',
    direction: 'Long',
    entry: '',
    exit: '',
    strategy: 'Breakout',
    timeframe: '15m',
    riskReward: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'entry' || name === 'exit' || name === 'riskReward' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pnl = (formData.exit - formData.entry) * (formData.direction === 'Long' ? 1 : -1);
    onSubmit({
      ...formData,
      pnl: Math.round(pnl * 100) / 100
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Symbol</label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="e.g., EURUSD"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Direction</label>
          <select
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
          >
            <option>Long</option>
            <option>Short</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Entry Price</label>
          <input
            type="number"
            step="0.001"
            name="entry"
            value={formData.entry}
            onChange={handleChange}
            placeholder="0.0000"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Exit Price</label>
          <input
            type="number"
            step="0.001"
            name="exit"
            value={formData.exit}
            onChange={handleChange}
            placeholder="0.0000"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Strategy</label>
          <select
            name="strategy"
            value={formData.strategy}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
          >
            <option>Breakout</option>
            <option>Retracement</option>
            <option>Support</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Timeframe</label>
          <select
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
          >
            <option>5m</option>
            <option>15m</option>
            <option>1H</option>
            <option>4H</option>
            <option>1D</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Risk/Reward Ratio</label>
          <input
            type="number"
            step="0.1"
            name="riskReward"
            value={formData.riskReward}
            onChange={handleChange}
            placeholder="1.5"
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add trade notes or observations..."
          rows="3"
          className="w-full px-3 py-2 border rounded-lg"
          style={{ borderColor: 'var(--bg-grey)', backgroundColor: 'white' }}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-[var(--brand-secondary)] text-white rounded-lg hover:opacity-90"
        >
          Add Trade
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
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