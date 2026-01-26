"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const URLForm = ({ onURLShortened }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (originalUrl && originalUrl.trim()) {
      try {
        const url = new URL(originalUrl.trim());
        const screenshotUrl = `https://api.apiflash.com/v1/urltoimage?access_key=demo&url=${encodeURIComponent(
          url.href
        )}&width=1200&height=900&fresh=true`;
        setPreviewImage(screenshotUrl);
      } catch (err) {
        setPreviewImage(
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=900&fit=crop"
        );
      }
    } else {
      setPreviewImage(
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=900&fit=crop"
      );
    }
  }, [originalUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = { url: originalUrl.trim() };
      if (customCode && customCode.trim()) payload.customCode = customCode.trim();
      if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();

      const response = await api.post("/api/shorten", payload);
      const shortUrl = `${window.location.origin}/${response.data.data.shortCode}`;

      setSuccess(`URL shortened! Short URL: ${shortUrl}`);
      setOriginalUrl("");
      setCustomCode("");
      setExpiresAt("");

      if (onURLShortened) onURLShortened(response.data.data);
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.details && Array.isArray(errorData.details)) {
        const errorMessages = errorData.details
          .map((d) => (typeof d === "string" ? d : `${d.field}: ${d.message}`))
          .join(", ");
        setError(errorMessages);
      } else {
        setError(errorData?.error || err.message || "Failed to shorten URL");
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
        alert("Short URL copied to clipboard!");
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Panel - dynamic preview */}
        <div className="flex-1 relative overflow-hidden md:block hidden">
          <div className="absolute inset-0">
            <img
              src={previewImage}
              alt="Website preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=900&fit=crop";
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
          <div className="absolute top-6 left-6 z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-white text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live preview
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
            <p className="text-lg font-semibold mb-1 truncate">
              {originalUrl || "Enter a URL to see its preview"}
            </p>
            <p className="text-sm text-white/80">Screenshots refresh as you type</p>
          </div>
        </div>

        {/* Right Panel - form */}
        <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shorten Your URL</h1>
            <p className="text-gray-600">Create short, shareable links with live previews.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">
                <span>{success}</span>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Original URL *
                </label>
                <input
                  type="url"
                  id="originalUrl"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Short Code (optional)
                </label>
                <input
                  type="text"
                  id="customCode"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  placeholder="mycode"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                  pattern="[a-zA-Z0-9]+"
                  title="Only alphanumeric characters allowed"
                />
              </div>

              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiration Date (optional)
                </label>
                <input
                  type="datetime-local"
                  id="expiresAt"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-violet-800 transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default URLForm;
