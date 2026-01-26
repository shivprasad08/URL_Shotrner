import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/URLForm.css';

const URLForm = ({ onURLShortened }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  // Generate preview image URL when originalUrl changes
  useEffect(() => {
    if (originalUrl && originalUrl.trim()) {
      try {
        const url = new URL(originalUrl.trim());
        // Use a screenshot API service - you can replace with your preferred service
        const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(url.href)}&width=800&height=600&fresh=true`;
        setPreviewImage(screenshotUrl);
      } catch (err) {
        // Invalid URL, use default image
        setPreviewImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop');
      }
    } else {
      setPreviewImage('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop');
    }
  }, [originalUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        url: originalUrl.trim(),
      };

      if (customCode && customCode.trim()) {
        payload.customCode = customCode.trim();
      }

      if (expiresAt) {
        payload.expiresAt = new Date(expiresAt).toISOString();
      }

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
      const errorData = err.response?.data;
      
      if (errorData?.details && Array.isArray(errorData.details)) {
        const errorMessages = errorData.details.map(d => {
          if (typeof d === 'string') return d;
          return `${d.field}: ${d.message}`;
        }).join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.error || err.message || 'Failed to shorten URL');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (success) {
      const urlMatch = success.match(/http[s]?:\/\/[^\s]+/);
      if (urlMatch) {
        navigator.clipboard.writeText(urlMatch[0]);
        alert('Short URL copied to clipboard!');
      }
    }
  };

  return (
    <div className="url-form-container">
      <div className="url-form-split">
        {/* Left Panel - Dynamic Preview */}
        <div className="preview-panel">
          <div className="preview-overlay">
            <div className="preview-content">
              <h3 className="preview-title">Live Preview</h3>
              <p className="preview-subtitle">
                {originalUrl ? 'Website Preview' : 'Enter a URL to see preview'}
              </p>
            </div>
          </div>
          <img
            src={previewImage}
            alt="Website Preview"
            className="preview-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop';
            }}
          />
        </div>

        {/* Right Panel - Form */}
        <div className="form-panel">
          <div className="form-header">
            <h1 className="form-title">Shorten Your URL</h1>
            <p className="form-subtitle">Create short, shareable links in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="modern-form">
            {error && <div className="error-message">{error}</div>}
            {success && (
              <div className="success-message">
                {success}
                <button 
                  type="button" 
                  onClick={copyToClipboard}
                  className="copy-btn-inline"
                >
                  Copy
                </button>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="originalUrl" className="form-label">
                Original URL *
              </label>
              <input
                type="url"
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="form-input"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="customCode" className="form-label">
                Custom Short Code (optional)
              </label>
              <input
                type="text"
                id="customCode"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="mycode"
                className="form-input"
                disabled={loading}
                pattern="[a-zA-Z0-9]+"
                title="Only alphanumeric characters allowed"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiresAt" className="form-label">
                Expiration Date (optional)
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="form-input"
                disabled={loading}
              />
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default URLForm;
