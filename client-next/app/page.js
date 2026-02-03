"use client";

import { useState, useEffect } from "react";
import Analytics from "@/components/Analytics";
import URLShortener from "@/components/URLShortener";
import URLList from "@/components/URLList";
import RainingLetters from "@/components/RainingLetters";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { LocomotiveScrollProvider } from "@/components/LocomotiveScrollProvider";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/AuthCard";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [activeTab, setActiveTab] = useState("shorten");
  const [urlCount, setUrlCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleURLShortened = () => setUrlCount((count) => count + 1);

  return (
    <LocomotiveScrollProvider>
      <div className="app relative z-10 flex flex-col bg-black/80 min-h-screen">
        <RainingLetters />
        
        <Navbar />

        <HeroSection />

        {mounted && !isAuthenticated && (
          <section id="auth-section" data-scroll-section className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-3">Login or Sign Up</h2>
                <p className="text-lg text-gray-300">Access your dashboard to shorten links and view analytics.</p>
              </div>
              <AuthCard mode="login" embedded />
            </div>
          </section>
        )}

        {mounted && isAuthenticated ? (
          <>
            <nav className="app-nav sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-blue-500/20 py-4" data-scroll-section>
              <div className="container mx-auto px-4">
                <div className="flex justify-center items-center gap-6">
                  <Button
                    variant={activeTab === "shorten" ? "solid" : "outline"}
                    size="lg"
                    onClick={() => setActiveTab("shorten")}
                    className="px-6 py-2 text-base font-semibold transition-all duration-200"
                  >
                    Shorten URL
                  </Button>
                  <Button
                    variant={activeTab === "list" ? "solid" : "outline"}
                    size="lg"
                    onClick={() => setActiveTab("list")}
                    className="px-6 py-2 text-base font-semibold transition-all duration-200"
                  >
                    My URLs ({urlCount})
                  </Button>
                  <Button
                    variant={activeTab === "analytics" ? "solid" : "outline"}
                    size="lg"
                    onClick={() => setActiveTab("analytics")}
                    className="px-6 py-2 text-base font-semibold transition-all duration-200"
                  >
                    Analytics
                  </Button>
                </div>
              </div>
            </nav>

            <main className="app-main flex-1" data-scroll-section>
              <div className="container mx-auto px-4 py-12">
                {activeTab === "shorten" && <URLShortener />}
                {activeTab === "list" && <URLList />}
                {activeTab === "analytics" && <Analytics />}
              </div>
            </main>
          </>
        ) : null}

        <footer data-scroll-section>
          <Footer />
        </footer>
      </div>
    </LocomotiveScrollProvider>
  );
}
