"use client";

import { useState } from "react";
import { Lock, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function PasswordPrompt() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Successful login, refresh page to load server-rendered layout
        window.location.reload();
      } else {
        setError(data.error || "Authentication failed");
        setShakeTrigger(true);
        // Reset shake trigger after animation finishes
        setTimeout(() => setShakeTrigger(false), 500);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(31,75,67,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(31,75,67,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <motion.div
        animate={shakeTrigger ? { x: [0, -10, 10, -10, 10, -10, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="bg-white border border-primary/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 text-charcoal"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Lock Icon */}
          <div className="p-4 bg-accent/20 rounded-full text-primary border border-accent/20">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-serif font-bold text-primary">
              Admin Portal Gate
            </h1>
            <p className="text-xs text-charcoal/60 font-medium">
              This area is restricted. Please enter password to proceed.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-charcoal/80">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-cream/15 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-center tracking-widest placeholder:tracking-normal placeholder-charcoal/30"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/15 text-rose-600 px-4.5 py-3 rounded-xl text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-cream rounded-xl font-bold shadow-sm transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cream" />
                Verifying...
              </>
            ) : (
              "Gain Access"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-primary/70 hover:text-primary transition-colors border-b border-primary/10 pb-0.5"
          >
            Return to Explorush Site
          </a>
        </div>
      </motion.div>
    </div>
  );
}
