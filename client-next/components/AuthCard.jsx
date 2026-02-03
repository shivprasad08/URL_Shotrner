"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
  ArrowRight,
  Chrome,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const MODES = {
  login: "login",
  signup: "signup",
};

export default function AuthCard({ mode = MODES.login, embedded = false }) {
  const router = useRouter();
  const { login, signup, isAuthenticated, loading, error, setError } = useAuth();

  const [formMode, setFormMode] = useState(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [localError, setLocalError] = useState("");

  useEffect(() => setFormMode(mode), [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    let ps = [];
    let raf = 0;

    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      ps = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) ps.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ps.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250,250,250,${p.o})`;
        ctx.fillRect(p.x, p.y, 0.7, 2.2);
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => {
      setSize();
      init();
    };

    window.addEventListener("resize", onResize);
    init();
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const submitLabel = useMemo(() => (formMode === MODES.login ? "Continue" : "Create account"), [formMode]);
  const footerText = formMode === MODES.login ? "Don’t have an account?" : "Already have an account?";
  const footerLinkHref = formMode === MODES.login ? "/signup" : "/login";
  const footerLinkText = formMode === MODES.login ? "Create one" : "Sign in";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setError("");

    if (!email || !password) {
      setLocalError("Email and password are required");
      return;
    }

    try {
      if (formMode === MODES.login) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      if (remember) {
        // already persisted via context
      }
      router.push("/");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Something went wrong";
      setLocalError(msg);
    }
  };

  const sectionClass = embedded
    ? "relative w-full bg-zinc-950 text-zinc-50 overflow-hidden rounded-2xl border border-zinc-800/70"
    : "fixed inset-0 bg-zinc-950 text-zinc-50";

  const contentClass = embedded
    ? "relative w-full grid place-items-center px-4 py-16"
    : "h-full w-full grid place-items-center px-4";

  return (
    <section className={sectionClass}>
      <style>{`
        .accent-lines{position:absolute;inset:0;pointer-events:none;opacity:.7}
        .hline,.vline{position:absolute;background:#27272a;will-change:transform,opacity}
        .hline{left:0;right:0;height:1px;transform:scaleX(0);transform-origin:50% 50%;animation:drawX .8s cubic-bezier(.22,.61,.36,1) forwards}
        .vline{top:0;bottom:0;width:1px;transform:scaleY(0);transform-origin:50% 0%;animation:drawY .9s cubic-bezier(.22,.61,.36,1) forwards}
        .hline:nth-child(1){top:18%;animation-delay:.12s}
        .hline:nth-child(2){top:50%;animation-delay:.22s}
        .hline:nth-child(3){top:82%;animation-delay:.32s}
        .vline:nth-child(4){left:22%;animation-delay:.42s}
        .vline:nth-child(5){left:50%;animation-delay:.54s}
        .vline:nth-child(6){left:78%;animation-delay:.66s}
        .hline::after,.vline::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(250,250,250,.24),transparent);opacity:0;animation:shimmer .9s ease-out forwards}
        .hline:nth-child(1)::after{animation-delay:.12s}
        .hline:nth-child(2)::after{animation-delay:.22s}
        .hline:nth-child(3)::after{animation-delay:.32s}
        .vline:nth-child(4)::after{animation-delay:.42s}
        .vline:nth-child(5)::after{animation-delay:.54s}
        .vline:nth-child(6)::after{animation-delay:.66s}
        @keyframes drawX{0%{transform:scaleX(0);opacity:0}60%{opacity:.95}100%{transform:scaleX(1);opacity:.7}}
        @keyframes drawY{0%{transform:scaleY(0);opacity:0}60%{opacity:.95}100%{transform:scaleY(1);opacity:.7}}
        @keyframes shimmer{0%{opacity:0}35%{opacity:.25}100%{opacity:0}}
        .card-animate { opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s cubic-bezier(.22,.61,.36,1) 0.4s forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="accent-lines">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-50 mix-blend-screen pointer-events-none"
      />

      {!embedded && (
        <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
          <span className="text-xs tracking-[0.14em] uppercase text-zinc-400">NOVA</span>
          <Button
            variant="outline"
            className="h-9 rounded-lg border-zinc-800 bg-zinc-900 text-zinc-50 hover:bg-zinc-900/80"
          >
            <span className="mr-2">Contact</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </header>
      )}

      <div className={contentClass}>
        <Card className="card-animate w-full max-w-sm border-zinc-800 bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white">
              {formMode === MODES.login ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {formMode === MODES.login ? "Sign in to your account" : "Start shortening URLs faster"}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5">
            {(localError || error) && (
              <div className="rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-sm text-red-200">
                {localError || error}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete={formMode === MODES.login ? "email" : "new-email"}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-600"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={formMode === MODES.login ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(Boolean(v))}
                  className="border-zinc-700 data-[state=checked]:bg-zinc-50 data-[state=checked]:text-zinc-900"
                />
                <Label htmlFor="remember" className="text-zinc-400">
                  Remember me
                </Label>
              </div>
              {formMode === MODES.login ? (
                <span className="text-sm text-zinc-600">Forgot password?</span>
              ) : null}
            </div>

            <Button
              className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Please wait..." : submitLabel}
            </Button>

            <div className="relative">
              <Separator className="bg-zinc-800" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-zinc-900/70 px-2 text-[11px] uppercase tracking-widest text-zinc-500">
                or
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-800"
                type="button"
                onClick={() => setLocalError("Social login not configured")}
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-zinc-800 bg-zinc-950 text-zinc-50 hover:bg-zinc-800"
                type="button"
                onClick={() => setLocalError("Social login not configured")}
              >
                <Chrome className="h-4 w-4 mr-2" />
                Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-center text-sm text-zinc-400 gap-2">
            {footerText}
            <Link
              className="text-zinc-200 hover:underline"
              href={footerLinkHref}
              onClick={(e) => {
                e.preventDefault();
                setFormMode((prev) => (prev === MODES.login ? MODES.signup : MODES.login));
              }}
            >
              {footerLinkText}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
