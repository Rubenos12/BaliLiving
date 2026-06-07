"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // TODO: replace with Supabase auth
    // Temporary hardcoded check for development
    if (email === "admin@baliliving.nl" && password === "baliliving2024") {
      router.push("/admin");
    } else {
      setError("Onjuist e-mailadres of wachtwoord.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F1A10] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-light text-[#F5F0E8] mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Bali<span className="text-[#C9A84C]">Living</span>
          </h1>
          <p className="text-[#F5F0E8]/40 text-xs tracking-[0.3em] uppercase">Admin inloggen</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
              E-mailadres
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              placeholder="admin@baliliving.nl"
            />
          </div>
          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
              Wachtwoord
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Inloggen..." : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
