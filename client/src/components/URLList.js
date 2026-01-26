import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/URLList.css';

const URLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchURLs();
  }, [page]);

  const fetchURLs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/urls', { params: { page, limit: 10 } });
      console.log('📥 API Response:', response.data);
      const urlsData = response.data?.data || [];
      console.log('🔗 URLs Data:', urlsData);
      setUrls(Array.isArray(urlsData) ? urlsData : []);
      setHasMore(urlsData.length === 10);
    } catch (err) {
      console.error('❌ Error fetching URLs:', err);
      setError('Failed to fetch URLs');
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;

    try {
      await axios.delete(`/api/urls/${shortCode}`);
      setUrls(urls.filter(url => url.shortCode !== shortCode));
    } catch (err) {
      alert('Failed to delete URL');
    }
  };

  const copyToClipboard = (shortCode) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    alert('Short URL copied to clipboard!');
  };

  return (
    <div className="url-list">
      <h2>Your Shortened URLs</h2>

      {error && <div className="error-message">{error}</div>}

      {loading && <p>Loading...</p>}

      {!loading && urls.length === 0 && <p>No URLs yet. Create one above!</p>}

      {urls.length > 0 && (
        <>
          <div className="urls-table-container">
            <table className="urls-table">
              <thead>
                <tr>
                  <th>Short Code</th>
                  <th>Original URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url.shortCode}>
                    <td className="short-code">
                      <a href={`/${url.shortCode}`} target="_blank" rel="noopener noreferrer">
                        /{url.shortCode}
                      </a>
                    </td>
                    <td className="original-url">
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer">
                        {url.originalUrl.substring(0, 50)}...
                      </a>
                    </td>
                    <td>{url.clickCount || 0}</td>
                    <td>{new Date(url.createdAt).toLocaleDateString()}</td>
                    <td className="actions">
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard(url.shortCode)}
                        title="Copy short URL"
                      >
                        📋 Copy
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(url.shortCode)}
                        title="Delete URL"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span>Page {page}</span>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={!hasMore}
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default URLList;
