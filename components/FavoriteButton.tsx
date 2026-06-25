"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";

export default function FavoriteButton({
  slug,
  className = "",
  size = "md",
}: {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const { favorites, toggle, hydrated } = useFavorites();
  const isFav = favorites.has(slug);

  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const btnSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-11 h-11";

  if (!hydrated) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={isFav ? "Verwijder uit favorieten" : "Opslaan als favoriet"}
      aria-pressed={isFav}
      className={`${btnSize} flex items-center justify-center transition-all duration-200 active:scale-90 ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.svg
          key={isFav ? "filled" : "outline"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={iconSize}
          viewBox="0 0 24 24"
          fill={isFav ? "#C9A84C" : "none"}
          stroke={isFav ? "#C9A84C" : "currentColor"}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </motion.svg>
      </AnimatePresence>
    </button>
  );
}
