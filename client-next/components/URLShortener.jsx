'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Copy, ArrowRight, X } from 'lucide-react';
import api from '@/lib/api';
import { useDebounce } from '@/lib/useDebounce';

const appBase =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || ''
    : process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || window.location.origin;

export default function URLShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [linkName, setLinkName] = useState('');
  const [showAlias, setShowAlias] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=1080&fit=crop'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const sanitizeCode = (value) =>
    value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 20);

  const debouncedUrl = useDebounce(originalUrl, 500);

  // Fetch screenshot from Microlink when URL changes
  useEffect(() => {
    if (!debouncedUrl || debouncedUrl.trim() === '') {
      setScreenshotUrl(
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=1080&fit=crop'
      );
      return;
    }

    const fetchScreenshot = async () => {
      setIsLoadingScreenshot(true);
      try {
        // Validate URL
        new URL(debouncedUrl);

        // Use Microlink API for screenshot
        const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(
          debouncedUrl
        )}&screenshot=true&meta=false&embed=screenshot.url`;

        setScreenshotUrl(microlinkUrl);
      } catch (err) {
        // Invalid URL - show error and revert to default
        setError('Invalid URL format');
        setScreenshotUrl(
          'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=1080&fit=crop'
        );
      } finally {
        setIsLoadingScreenshot(false);
      }
    };

    fetchScreenshot();
  }, [debouncedUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);

    try {
      const payload = { url: originalUrl.trim() };

      const explicitAlias = customAlias.trim();
      const derivedAlias = !explicitAlias && linkName.trim() ? sanitizeCode(linkName) : '';
      const finalAlias = explicitAlias || derivedAlias;

      if (finalAlias) {
        payload.customCode = finalAlias;
      }
      if (linkName && linkName.trim()) {
        payload.description = linkName.trim();
      }

      const response = await api.post('/api/shorten', payload);
      const shortUrlResult = `${appBase}/${response.data.data.shortCode}`;

      setShortUrl(shortUrlResult);
      setSuccess('URL shortened successfully!');
      setOriginalUrl('');
      setCustomAlias('');
      setLinkName('');
      setShowAlias(false);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.details && Array.isArray(errorData.details)) {
        const errorMessages = errorData.details
          .map((d) => (typeof d === 'string' ? d : `${d.field}: ${d.message}`))
          .join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.error || err.message || 'Failed to shorten URL');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black p-6">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Left Panel - Dynamic Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 rounded-2xl"
          >
            {/* Skeleton Loader */}
            {isLoadingScreenshot && (
              <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-white text-center"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/20 mx-auto mb-4" />
                  <p className="text-sm text-white/70">Loading preview...</p>
                </motion.div>
              </div>
            )}

            {/* Image Container */}
            <motion.img
              key={screenshotUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              src={screenshotUrl}
              alt="Website preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=1080&fit=crop';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Info Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-8 left-8 right-8 text-white"
            >
              <p className="text-sm font-medium mb-1 truncate flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {originalUrl ? 'Live Preview' : 'Ready to shorten'}
              </p>
              {originalUrl && (
                <p className="text-xs text-white/70 truncate">{originalUrl}</p>
              )}
            </motion.div>
          </motion.div>

          {/* Right Panel - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="w-full max-w-md space-y-6">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 flex items-center gap-2">
                  <LinkIcon className="w-8 h-8 text-blue-500" />
                  Shorten Your Link
                </h1>
                <p className="text-gray-400 text-lg">
                  Create short, shareable URLs with live previews.
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-500/50 bg-red-900/20 px-4 py-3 text-red-400 text-sm font-medium flex justify-between items-center"
                  >
                    <span>{error}</span>
                    <button
                      type="button"
                      onClick={() => setError('')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Success Message with Result */}
                {success && shortUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-emerald-500/50 bg-emerald-900/20 p-4"
                  >
                    <p className="text-emerald-400 text-sm font-medium mb-3">{success}</p>
                    <div className="flex items-center gap-2 bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <input
                        type="text"
                        readOnly
                        value={shortUrl}
                        className="flex-1 text-sm text-gray-300 bg-transparent outline-none truncate"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={copyToClipboard}
                        className={`p-2 rounded-lg transition-all ${
                          copied
                            ? 'bg-emerald-900/40 text-emerald-400'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* URL Input */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label htmlFor="url" className="block text-sm font-semibold text-white mb-3">
                    Long URL *
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="url"
                      type="url"
                      value={originalUrl}
                      onChange={(e) => {
                        setOriginalUrl(e.target.value);
                        setError('');
                      }}
                      placeholder="https://example.com/very/long/url"
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none transition-all text-base"
                      disabled={isLoading}
                      suppressHydrationWarning
                    />
                  </div>
                </motion.div>

                {/* Link Name (Optional, used as short link if alias is empty) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <label htmlFor="linkName" className="block text-sm font-semibold text-white mb-3">
                    Link Name (Optional)
                  </label>
                  <input
                    id="linkName"
                    type="text"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                    placeholder="Marketing landing page"
                    className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none transition-all text-sm"
                    maxLength={120}
                    disabled={isLoading}
                    suppressHydrationWarning
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    If you leave Custom Alias empty, this name will become your short link (e.g., /hero).
                  </p>
                </motion.div>

                {/* Custom Alias Toggle */}
                <motion.button
                  type="button"
                  onClick={() => setShowAlias(!showAlias)}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  suppressHydrationWarning
                >
                  {showAlias ? '✕ Hide' : '+ Custom Alias (Optional)'}
                </motion.button>

                {/* Custom Alias Input */}
                {showAlias && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label
                      htmlFor="alias"
                      className="block text-sm font-semibold text-white mb-3"
                    >
                      Custom Short Code
                    </label>
                    <input
                      id="alias"
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="mycode"
                      pattern="[a-zA-Z0-9]+"
                      className="w-full px-4 py-3 border-2 border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-900 outline-none transition-all text-sm"
                      disabled={isLoading}
                      suppressHydrationWarning
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Only alphanumeric characters allowed
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !originalUrl.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Shortening...
                    </>
                  ) : (
                    <>
                      Shorten Link
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Footer Text */}
                <p className="text-center text-xs text-gray-400 mt-6">
                  Your links are secure and never shared. No tracking.
                </p>
              </form>
            </div>
          </motion.div>
      </div>
    </div>
  );
}
