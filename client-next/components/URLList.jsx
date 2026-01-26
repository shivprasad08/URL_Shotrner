"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import api from "@/lib/api";

const appBase =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || ''
    : process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || window.location.origin;

export default function URLList() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchURLs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchURLs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/urls", { params: { page, limit: 10 } });
      const urlsData = response.data?.data || [];
      setUrls(Array.isArray(urlsData) ? urlsData : []);
      setHasMore(urlsData.length === 10);
    } catch (err) {
      setError("Failed to fetch URLs");
      setUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode) => {
    if (!window.confirm("Delete this shortened URL? This action cannot be undone."))
      return;

    try {
      await api.delete(`/api/urls/${shortCode}`);
      setUrls(urls.filter((url) => url.shortCode !== shortCode));
    } catch (err) {
      setError("Failed to delete URL");
    }
  };

  const copyToClipboard = (shortCode) => {
    const shortUrl = `${appBase}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="bg-black min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Shortened URLs</h2>
          <p className="text-gray-400">Manage and track all your shortened links</p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-red-500/50 bg-red-900/20 px-4 py-3 text-red-400"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full"
            />
          </div>
        )}

        {/* Empty State */}
        {!loading && urls.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-gray-900 rounded-2xl border border-gray-800"
          >
            <div className="text-5xl mb-4">🔗</div>
            <p className="text-gray-400 text-lg">No URLs yet</p>
            <p className="text-gray-500 text-sm">Create your first shortened link to get started</p>
          </motion.div>
        )}

        {/* URLs Grid */}
        {urls.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 mb-8"
          >
            {urls.map((url) => (
              <motion.div
                key={url.shortCode}
                variants={itemVariants}
                className="bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* URL Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <a
                        href={`${appBase}/${url.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-sm font-semibold text-blue-400 hover:text-blue-300 truncate"
                      >
                        /{url.shortCode}
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                      <span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-1 rounded border border-blue-800">
                        {url.clickCount || 0} clicks
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{url.originalUrl}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {new Date(url.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(url.shortCode)}
                      className={`p-2 rounded-lg transition-all ${
                        copied === url.shortCode
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title="Copy short URL"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(url.shortCode)}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                      title="Delete URL"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {urls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </motion.button>
            <span className="text-gray-400 font-medium">Page {page}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(page + 1)}
              disabled={!hasMore}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
