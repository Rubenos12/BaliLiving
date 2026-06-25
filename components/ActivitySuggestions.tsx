"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonCard } from "@/components/ui/Skeleton";

type Suggestion = {
  type: "transfer" | "tour" | "restaurant";
  title: string;
  reason: string;
  link: string;
  cta: string;
};

interface Props {
  villaName: string;
  region: string;
  checkIn: string;
  nights: number;
  guests: number;
}

const typeIcon: Record<Suggestion["type"], string> = {
  transfer: "🚗",
  tour: "🗺",
  restaurant: "🍽",
};

export default function ActivitySuggestions({ villaName, region, checkIn, nights, guests }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ villa_name: villaName, region, check_in: checkIn, nights, guests }),
    })
      .then((r) => r.json())
      .then((d) => setSuggestions(d.suggestions ?? []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, [villaName, region, checkIn, nights, guests]);

  if (!loading && suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      {(loading || suggestions.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8"
        >
          <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-4">
            Maak jouw verblijf compleet
          </p>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/25 transition-colors p-4 flex items-center gap-4"
                >
                  <span className="text-2xl shrink-0">{typeIcon[s.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5F0E8] text-sm font-light truncate">{s.title}</p>
                    <p className="text-[#F5F0E8]/40 text-xs mt-0.5 leading-relaxed">{s.reason}</p>
                  </div>
                  <Link
                    href={s.link}
                    className="shrink-0 px-3 py-2 border border-[#C9A84C]/30 text-[#C9A84C] text-[0.6rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-200 whitespace-nowrap"
                  >
                    {s.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
