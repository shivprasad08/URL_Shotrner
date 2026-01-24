import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Analytics.css';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDays, setSelectedDays] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDays]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/analytics');
      setAnalytics(response.data?.data || {});
    } catch (err) {
      setError('Failed to fetch analytics');
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analytics">
      <h2>Analytics Dashboard</h2>

      {error && <div className="error-message">{error}</div>}

      {loading && <p>Loading analytics...</p>}

      {analytics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total URLs</h3>
              <p className="stat-value">{analytics.totalURLs || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Clicks</h3>
              <p className="stat-value">{analytics.totalClicks || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Average Clicks</h3>
              <p className="stat-value">{(analytics.avgClicksPerURL || 0).toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Active URLs</h3>
              <p className="stat-value">{analytics.activeURLs || 0}</p>
            </div>
          </div>

          <div className="trends-section">
            <div className="trends-header">
              <h3>Trends ({selectedDays} days)</h3>
              <div className="days-filter">
                {[7, 30, 90, 365].map(days => (
                  <button
                    key={days}
                    className={selectedDays === days ? 'active' : ''}
                    onClick={() => setSelectedDays(days)}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>

          {analytics.topURLs && analytics.topURLs.length > 0 && (
            <div className="top-urls">
              <h3>Top URLs by Clicks</h3>
              <ul>
                {analytics.topURLs.slice(0, 5).map((url, index) => (
                  <li key={index}>
                    <span className="rank">#{index + 1}</span>
                    <span className="code">{url.shortCode}</span>
                    <span className="clicks">{url.clickCount} clicks</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analytics;
