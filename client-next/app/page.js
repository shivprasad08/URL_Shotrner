"use client";

import { useState } from "react";
import Analytics from "@/components/Analytics";
import URLShortener from "@/components/URLShortener";
import URLList from "@/components/URLList";
import RainingLetters from "@/components/RainingLetters";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { LocomotiveScrollProvider } from "@/components/LocomotiveScrollProvider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [activeTab, setActiveTab] = useState("shorten");
  const [urlCount, setUrlCount] = useState(0);

  const handleURLShortened = () => setUrlCount((count) => count + 1);

  return (
    <LocomotiveScrollProvider>
      <div className="app relative z-10 flex flex-col bg-black/80">
        <RainingLetters />

        <HeroSection />

      <nav className="app-nav" data-scroll-section>
        <div className="flex justify-center items-center gap-4">
          <Button
            variant={activeTab === "shorten" ? "solid" : "default"}
            size="default"
            onClick={() => setActiveTab("shorten")}
          >
            Shorten URL
          </Button>
          <Button
            variant={activeTab === "list" ? "solid" : "default"}
            size="default"
            onClick={() => setActiveTab("list")}
          >
            My URLs ({urlCount})
          </Button>
          <Button
            variant={activeTab === "analytics" ? "solid" : "default"}
            size="default"
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Button>
        </div>
      </nav>

      <main className="app-main" data-scroll-section>
        <div className="container">
          {activeTab === "shorten" && <URLShortener />}
          {activeTab === "list" && <URLList />}
          {activeTab === "analytics" && <Analytics />}
        </div>
      </main>

        <footer data-scroll-section>
          <Footer />
        </footer>
      </div>
    </LocomotiveScrollProvider>
  );
}
