"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const isAdminAuth = localStorage.getItem("admin_authenticated");
    if (isAdminAuth === "true") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simple authentication check
    if (username === "admin" && password === "123cmr") {
      localStorage.setItem("admin_authenticated", "true");
      router.replace("/admin/dashboard");
    } else {
      setError("Invalid credentials");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-dvh w-full bg-black text-neutral-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[28px] bg-neutral-900/80 ring-1 ring-white/10 shadow-2xl p-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full bg-white/8 blur-2xl" />
        <div className="pointer-events-none absolute top-0 right-0 h-16 w-16 rounded-bl-[28px] bg-white/5" />
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Access</h1>
          <p className="text-sm text-neutral-400 mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-neutral-800 ring-1 ring-white/10 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-neutral-800 ring-1 ring-white/10 text-neutral-200 placeholder-neutral-500 focus:ring-2 focus:ring-white/20 focus:outline-none transition-all"
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center p-2 rounded-lg bg-red-400/10 ring-1 ring-red-400/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-white text-black font-medium ring-1 ring-white/70 shadow-[0_1px_0_0_rgba(255,255,255,0.1)_inset] hover:bg-neutral-100 active:translate-y-[1px] transition-all duration-200 ease-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="text-neutral-400 hover:text-neutral-200 text-sm underline underline-offset-4 transition-colors"
          >
            Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}