"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
            URL Shortener
          </Link>
          
          <div className="flex items-center gap-3">
            {mounted && isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              >
                Logout
              </Button>
            ) : mounted ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-400 text-blue-300 hover:bg-blue-500/20"
              >
                <Link href="#auth-section">Login / Sign up</Link>
              </Button>
            ) : (
              <div className="w-[140px] h-[40px]" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
