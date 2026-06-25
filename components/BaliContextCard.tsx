"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

type ContextItem = {
  icon: string;
  text: string;
  type: "info" | "warning" | "tip";
};

interface Props {
  checkIn: string;
  checkOut: string;
}

const borderColor: Record<ContextItem["type"], string> = {
  info: "border-[#C9A84C]/20",
  warning: "border-yellow-400/30",
  tip: "border-green-400/20",
};

export default function BaliContextCard({ checkIn, checkOut }: Props) {
  const [items, setItems] = useState<ContextItem[]>([]);
  const [loading, setLoading] = useState(false);
  const prevKey = useRef("");

  useEffect(() => {
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      setItems([]);
      return;
    }

    const key = `${checkIn}:${checkOut}`;
    if (key === prevKey.current) return;
    prevKey.current = key;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/bali-context", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ check_in: checkIn, check_out: checkOut }),
        });
        const data = await res.json();
        setItems(data.items ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [checkIn, checkOut]);

  if (!checkIn || !checkOut || checkIn >= checkOut) return null;

  return (
    <AnimatePresence>
      {(loading || items.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="mt-4 bg-[#131E14] border border-[#C9A84C]/15 p-4"
        >
          <span className="text-[#C9A84C] text-[0.55rem] tracking-[0.3em] uppercase block mb-3">Bali in jouw periode</span>
          {loading && (
            <div className="space-y-2">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          )}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className={`flex items-start gap-2.5 text-xs border-l-2 pl-2.5 ${borderColor[item.type]}`}>
                  <span className="shrink-0 text-sm leading-none mt-px">{item.icon}</span>
                  <span className="text-[#F5F0E8]/65 leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
