import React, { useState } from 'react';
import axios from 'axios';
import '../styles/URLForm.css';

const URLForm = ({ onURLShortened }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        originalUrl,
        ...(customCode && { customCode }),
        ...(expiresAt && { expiresAt }),
      };

      const response = await axios.post('/api/shorten', payload);
      const shortUrl = `${window.location.origin}/${response.data.data.shortCode}`;
      
      setSuccess(`URL shortened! Short URL: ${shortUrl}`);
      setOriginalUrl('');
      setCustomCode('');
      setExpiresAt('');
      
      if (onURLShortened) {
        onURLShortened(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <h2>Shorten Your URL</h2>
      
      <div className="form-group">
        <label htmlFor="originalUrl">Original URL *</label>
        <input
          type="url"
          id="originalUrl"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="customCode">Custom Short Code (optional)</label>
        <input
          type="text"
          id="customCode"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          placeholder="mycode"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="expiresAt">Expiration Date (optional)</label>
        <input
          type="datetime-local"
          id="expiresAt"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>
    </form>
  );
};

export default URLForm;
