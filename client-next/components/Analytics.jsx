"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";

const appBase =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || ""
    : process.env.NEXT_PUBLIC_APP_BASE || process.env.NEXT_PUBLIC_API_BASE || window.location.origin;

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);

  const computeChange = (current = 0, previous = 0) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  useEffect(() => {
    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/analytics");
      setAnalytics(response.data?.data || {});
    } catch (err) {
      setError("Failed to fetch analytics");
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Analytics Dashboard</h2>

        {error && <div className="error-message mb-6 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">{error}</div>}
        {loading && <p className="text-gray-400">Loading analytics...</p>}

        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard 
                title="Total URLs" 
                value={analytics.totalURLs || 0} 
                color="black"
                change={computeChange(analytics.totalURLs || 0, Math.max(0, (analytics.totalURLs || 0) - 1))}
                comparison="Total shortened links"
              />
              <StatCard 
                title="Total Clicks" 
                value={analytics.totalClicks || 0} 
                color="pink"
                change={computeChange(analytics.totalClicks || 0, Math.max(0, (analytics.totalClicks || 0) - 1))}
                comparison={`Vs last month: ${Math.max(0, (analytics.totalClicks || 0) - 1)}`}
              />
              <StatCard 
                title="Average Clicks" 
                value={(analytics.avgClicksPerURL || 0).toFixed(2)} 
                color="blue"
                change={computeChange(
                  analytics.avgClicksPerURL || 0,
                  Math.max(0, (analytics.avgClicksPerURL || 0) - 0.5)
                )}
                comparison="Avg per link"
              />
              <StatCard 
                title="Active URLs" 
                value={analytics.activeURLs || 0} 
                color="green"
                change={computeChange(analytics.activeURLs || 0, Math.max(0, (analytics.activeURLs || 0) - 1))}
                comparison={`Vs last month: ${Math.max(0, (analytics.activeURLs || 0) - 1)}`}
              />
            </div>

            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Trends ({selectedDays} days)</h3>
                <div className="flex gap-2">
                  {[7, 30, 90, 365].map((days) => (
                    <button
                      key={days}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedDays === days
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedDays(days)}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

          {analytics.topURLs && analytics.topURLs.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-4">Top URLs by Clicks</h3>
              <ul className="space-y-3">
                {analytics.topURLs.slice(0, 5).map((url, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold text-sm">
                        {index + 1}
                      </span>
                      <a
                        className="text-blue-400 hover:text-blue-300 font-medium"
                        href={`${appBase}/${url.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {url.shortCode}
                      </a>
                    </span>
                    <span className="text-gray-300 font-semibold">{url.clickCount} clicks</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default Analytics;
