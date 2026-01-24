import React, { useState } from 'react';
import URLForm from './components/URLForm';
import URLList from './components/URLList';
import Analytics from './components/Analytics';
import './styles/index.css';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('shorten');
  const [urlCount, setUrlCount] = useState(0);

  const handleURLShortened = () => {
    setUrlCount(urlCount + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <h1>🔗 URL Shortener</h1>
            <p>Create short, shareable links in seconds</p>
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container">
          <button
            className={`nav-btn ${activeTab === 'shorten' ? 'active' : ''}`}
            onClick={() => setActiveTab('shorten')}
          >
            ✂️ Shorten URL
          </button>
          <button
            className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            📋 My URLs ({urlCount})
          </button>
          <button
            className={`nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          {activeTab === 'shorten' && <URLForm onURLShortened={handleURLShortened} />}
          {activeTab === 'list' && <URLList />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 URL Shortener. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
