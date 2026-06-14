"use client";

import { useState } from "react";

type Bullet = { type: "success" | "opportunity" | "warning"; text: string };
type Insights = { summary: string; bullets: Bullet[] };

const bulletIcon: Record<Bullet["type"], string> = {
  success: "✓",
  opportunity: "→",
  warning: "⚠",
};

const bulletColor: Record<Bullet["type"], string> = {
  success: "text-green-400",
  opportunity: "text-[#C9A84C]",
  warning: "text-yellow-400",
};

export default function AdminInsightsCard() {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    setInsights(null);

    try {
      const res = await fetch("/api/admin/insights", { method: "POST" });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Er is een fout opgetreden.");
        return;
      }

      setInsights(data);
    } catch {
      setError("Kon geen verbinding maken met de AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-[#C9A84C] text-lg">✦</span>
          <div>
            <h3 className="text-[#F5F0E8] text-base font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
              AI Inzichten
            </h3>
            <p className="text-[#F5F0E8]/35 text-xs mt-0.5">Analyse van de afgelopen 30 dagen</p>
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C]/10 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              Analyseren…
            </>
          ) : (
            "Genereer rapport"
          )}
        </button>
      </div>

      {!insights && !error && !loading && (
        <p className="text-[#F5F0E8]/25 text-sm italic">
          Klik op &ldquo;Genereer rapport&rdquo; voor een AI-analyse van boekingen, transfers en contactaanvragen.
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {insights && (
        <div className="space-y-4">
          <p className="text-[#F5F0E8]/70 text-sm leading-relaxed border-l-2 border-[#C9A84C]/30 pl-4">
            {insights.summary}
          </p>
          <div className="space-y-2.5">
            {insights.bullets.map((b, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`shrink-0 font-mono text-xs mt-0.5 ${bulletColor[b.type]}`}>
                  {bulletIcon[b.type]}
                </span>
                <span className="text-[#F5F0E8]/65 leading-relaxed">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
