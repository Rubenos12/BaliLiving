"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ConciergeResponse } from "@/app/api/concierge/route";

// Guest profile — accumulated across the conversation
type GuestProfile = {
  guests?: string;
  budget?: string;
  tripType?: string;
  region?: string;
  dates?: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  quickReplies?: string[];
};

const GREETING: Message = {
  role: "assistant",
  content: "Hallo! Ik ben jouw persoonlijke Bali concierge. Wat voor reis ben je aan het plannen?",
  quickReplies: ["Romantisch voor 2", "Gezinsreis", "Met vrienden", "Zakelijk / solo"],
};

// Extract profile clues from user messages using simple pattern matching
function extractProfileHints(text: string, current: GuestProfile): GuestProfile {
  const updated = { ...current };
  const t = text.toLowerCase();

  // Guests
  const guestMatch = t.match(/(\d+)\s*(persoon|personen|mensen|gasten|pax)/);
  if (guestMatch) updated.guests = `${guestMatch[1]} personen`;
  if (/^(met z.n tweeën|voor 2|romantisch voor 2|koppel)/.test(t)) updated.guests = "2 personen";
  if (/gezin/.test(t)) updated.tripType = "Gezinsreis";
  if (/romantisch|huwelijks|honeymoon/.test(t)) updated.tripType = "Romantisch";
  if (/vrienden|groep/.test(t)) updated.tripType = "Vrienden / groep";
  if (/zakelijk|solo/.test(t)) updated.tripType = "Zakelijk / solo";

  // Budget
  if (/onder.?€?\s*300|goedkoop/.test(t)) updated.budget = "Onder €300/nacht";
  if (/300.?500|€300|€400/.test(t)) updated.budget = "€300–€500/nacht";
  if (/500.?800|€500|€600|€700/.test(t)) updated.budget = "€500–€800/nacht";
  if (/800\+|€800|luxe|premium/.test(t)) updated.budget = "€800+/nacht";

  // Region
  const regions = ["ubud", "seminyak", "canggu", "uluwatu", "nusa dua"];
  for (const r of regions) {
    if (t.includes(r)) updated.region = r.charAt(0).toUpperCase() + r.slice(1);
  }

  // Dates (simple: month or date mention)
  const dateMatch = text.match(/\d{1,2}[- /]\d{1,2}|januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december/i);
  if (dateMatch && !updated.dates) updated.dates = dateMatch[0];

  return updated;
}

// Render assistant message — no markdown, just clean text + villa links
function renderMessage(content: string) {
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      return (
        <a
          key={i}
          href={match[2]}
          className="text-[#C9A84C] underline underline-offset-2 hover:text-[#E8C96A] transition-colors"
        >
          {match[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

// Profile badge shown in header when we know something
function ProfileBadge({ profile }: { profile: GuestProfile }) {
  const known = [profile.guests, profile.tripType, profile.region, profile.budget].filter(Boolean);
  if (known.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 px-5 pb-2 bg-[#131E14]">
      {known.map((item) => (
        <span key={item} className="text-[0.55rem] tracking-[0.15em] uppercase text-[#C9A84C]/60 border border-[#C9A84C]/20 px-2 py-0.5">
          {item}
        </span>
      ))}
    </div>
  );
}

export default function ConciergeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [profile, setProfile] = useState<GuestProfile>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Update profile based on user input
    const updatedProfile = extractProfileHints(trimmed, profile);
    setProfile(updatedProfile);

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile: updatedProfile,
        }),
      });

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] },
        ]);
        return;
      }

      const data: ConciergeResponse = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, quickReplies: data.quickReplies ?? [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, profile]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // The last AI message's quickReplies are the active chips
  const lastAiIndex = [...messages].reverse().findIndex((m) => m.role === "assistant");
  const lastAiMsg = lastAiIndex >= 0 ? messages[messages.length - 1 - lastAiIndex] : null;
  const activeChips = (!loading && lastAiMsg?.quickReplies?.length) ? lastAiMsg.quickReplies : [];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={() => setOpen(true)}
            aria-label="Open concierge chat"
            className="relative w-14 h-14 rounded-full bg-[#C9A84C] text-[#1C2B1E] flex items-center justify-center shadow-2xl hover:bg-[#E8C96A] transition-colors duration-300"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute inset-0 rounded-full ring-pulse-gold pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute bottom-0 right-0 w-[92vw] sm:w-96 bg-[#1C2B1E] border border-[#C9A84C]/25 shadow-2xl flex flex-col overflow-hidden"
            style={{ maxWidth: "min(92vw, 24rem)", height: "min(580px, 90vh)" }}
          >
            {/* Header */}
            <div className="border-b border-[#C9A84C]/15 bg-[#131E14] shrink-0">
              <div className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center">
                      <span className="text-[#C9A84C] text-xs" style={{ fontFamily: "var(--font-cormorant)" }}>AI</span>
                    </div>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-[#4CAF50] ring-2 ring-[#131E14]" />
                  </div>
                  <div>
                    <p className="text-[#F5F0E8] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                      BaliLiving Concierge
                    </p>
                    <p className="text-[#C9A84C]/55 text-[0.55rem] tracking-[0.2em] uppercase">
                      Claude AI · altijd beschikbaar
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-7 h-7 flex items-center justify-center text-[#F5F0E8]/35 hover:text-[#F5F0E8] transition-colors"
                  aria-label="Sluit chat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {/* Profile breadcrumb — shows what we know */}
              <ProfileBadge profile={profile} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] text-sm leading-relaxed px-4 py-2.5 ${
                      msg.role === "user"
                        ? "bg-[#C9A84C] text-[#1C2B1E] rounded-2xl rounded-br-sm"
                        : "bg-[#243628] text-[#F5F0E8]/85 border border-[#C9A84C]/10 rounded-2xl rounded-bl-sm"
                    }`}
                  >
                    {renderMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#243628] border border-[#C9A84C]/10 rounded-2xl rounded-bl-sm px-4 py-3">
                    <span className="flex gap-1.5 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50 animate-bounce" style={{ animationDelay: "140ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/50 animate-bounce" style={{ animationDelay: "280ms" }} />
                    </span>
                  </div>
                </div>
              )}

              {/* Quick reply chips — shown below last AI message */}
              <AnimatePresence>
                {activeChips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {activeChips.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="text-xs px-3 py-1.5 border border-[#C9A84C]/35 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-200 rounded-full"
                      >
                        {chip}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-3 py-3 border-t border-[#C9A84C]/15 bg-[#131E14] shrink-0">
              <div className="flex items-center gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Of typ je eigen vraag..."
                  rows={1}
                  disabled={loading}
                  className="flex-1 bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] text-sm px-3 py-2 resize-none focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-[#F5F0E8]/20 disabled:opacity-40 rounded-lg"
                  style={{ minHeight: "2.5rem", maxHeight: "5rem" }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 bg-[#C9A84C] text-[#1C2B1E] flex items-center justify-center hover:bg-[#E8C96A] transition-colors duration-200 disabled:opacity-35 disabled:cursor-not-allowed rounded-lg shrink-0"
                  aria-label="Verstuur"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
