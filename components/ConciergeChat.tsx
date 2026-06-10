"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const GREETING: Message = {
  role: "assistant",
  content:
    "Hallo! Ik ben jouw persoonlijke Bali concierge, aangedreven door AI. Stel me gerust je vraag over villa's, activiteiten of je droomreis op Bali. Ik help je met plezier.",
};

export default function ConciergeChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    // Placeholder for streaming assistant reply
    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Er ging iets mis. Probeer het opnieuw.",
          };
          return updated;
        });
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: current };
          return updated;
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: "Er ging iets mis. Probeer het opnieuw.",
          };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, messages, streaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Render message content with basic markdown link support
  const renderContent = (content: string) => {
    // Convert [text](/url) markdown links to <a> tags
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
  };

  return (
    <>
      {/* Floating button */}
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
              className="w-14 h-14 rounded-full bg-[#C9A84C] text-[#1C2B1E] flex items-center justify-center shadow-2xl hover:bg-[#E8C96A] transition-colors duration-300 group"
            >
              {/* Chat bubble icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full ring-pulse-gold pointer-events-none" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="absolute bottom-0 right-0 w-[92vw] sm:w-96 h-[520px] bg-[#1C2B1E] border border-[#C9A84C]/25 shadow-2xl flex flex-col overflow-hidden"
              style={{ maxWidth: "min(92vw, 24rem)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/15 bg-[#131E14] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 flex items-center justify-center">
                      <span className="text-[#C9A84C] text-xs" style={{ fontFamily: "var(--font-cormorant)" }}>AI</span>
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#4CAF50] ring-2 ring-[#131E14]" />
                  </div>
                  <div>
                    <p className="text-[#F5F0E8] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                      BaliLiving Concierge
                    </p>
                    <p className="text-[#C9A84C]/60 text-[0.6rem] tracking-[0.2em] uppercase">
                      Aangedreven door Claude AI
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setOpen(false); abortRef.current?.abort(); }}
                  className="w-8 h-8 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors"
                  aria-label="Sluit chat"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] text-sm leading-relaxed px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-[#C9A84C] text-[#1C2B1E] rounded-tl-lg rounded-tr-sm rounded-bl-lg rounded-br-lg"
                          : "bg-[#243628] text-[#F5F0E8]/85 border border-[#C9A84C]/10 rounded-tl-sm rounded-tr-lg rounded-bl-lg rounded-br-lg"
                      }`}
                    >
                      {msg.content ? renderContent(msg.content) : (
                        // Typing indicator for empty streaming message
                        <span className="flex gap-1 items-center h-4">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-[#C9A84C]/15 bg-[#131E14] shrink-0">
                <div className="flex items-end gap-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Stel een vraag..."
                    rows={1}
                    disabled={streaming}
                    className="flex-1 bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] text-sm px-3 py-2.5 resize-none focus:outline-none focus:border-[#C9A84C]/50 transition-colors placeholder:text-[#F5F0E8]/25 disabled:opacity-50 max-h-24"
                    style={{ minHeight: "2.75rem" }}
                    onInput={(e) => {
                      const el = e.currentTarget;
                      el.style.height = "auto";
                      el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
                    }}
                  />
                  <button
                    onClick={send}
                    disabled={!input.trim() || streaming}
                    className="w-10 h-10 bg-[#C9A84C] text-[#1C2B1E] flex items-center justify-center hover:bg-[#E8C96A] transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    aria-label="Verstuur bericht"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
                <p className="text-[#F5F0E8]/20 text-[0.6rem] mt-1.5 tracking-wide">
                  Enter om te sturen · Shift+Enter voor nieuwe regel
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
