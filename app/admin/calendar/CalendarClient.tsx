"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  total_nights: number;
  guest_count: number;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
};

type WeekBooking = Booking & { startCol: number; colSpan: number; lane: number };

const STATUS_STYLES: Record<string, { bar: string; dot: string }> = {
  pending: {
    bar: "bg-yellow-400/20 border-l-2 border-yellow-400 text-yellow-200 hover:bg-yellow-400/30",
    dot: "bg-yellow-400",
  },
  accepted: {
    bar: "bg-green-500/20 border-l-2 border-green-400 text-green-200 hover:bg-green-500/30",
    dot: "bg-green-400",
  },
  rejected: {
    bar: "bg-red-500/15 border-l-2 border-red-400 text-red-300/60 hover:bg-red-500/25",
    dot: "bg-red-400",
  },
  cancelled: {
    bar: "bg-white/5 border-l-2 border-white/15 text-white/25 hover:bg-white/10",
    dot: "bg-white/20",
  },
};

const STATUS_LABELS: Record<string, string> = {
  pending: "In behandeling",
  accepted: "Bevestigd",
  rejected: "Afgewezen",
  cancelled: "Geannuleerd",
};

const MONTHS_NL = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
];

const DAYS_NL = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const LANE_H = 26; // px per booking lane
const DAY_NUM_H = 38; // px for day number row
const WEEK_PADDING = 6; // px bottom padding per week row

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function assignLanes(
  rawBookings: Array<Booking & { startCol: number; colSpan: number }>
): WeekBooking[] {
  const result: WeekBooking[] = [];
  const laneEnds: number[] = []; // tracks the endCol of last booking in each lane

  for (const b of rawBookings) {
    const endCol = b.startCol + b.colSpan - 1;
    let assigned = false;
    for (let i = 0; i < laneEnds.length; i++) {
      if (laneEnds[i] < b.startCol) {
        laneEnds[i] = endCol;
        result.push({ ...b, lane: i });
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      laneEnds.push(endCol);
      result.push({ ...b, lane: laneEnds.length - 1 });
    }
  }

  return result;
}

function getWeekBookings(week: Date[], bookings: Booking[]): WeekBooking[] {
  const weekStart = toDateStr(week[0]);
  const weekEnd = toDateStr(week[6]);

  const raw = bookings
    .filter((b) => b.check_in <= weekEnd && b.check_out > weekStart)
    .map((b) => {
      // startCol: first day in week where day >= check_in
      let startCol = 0;
      for (let i = 0; i < 7; i++) {
        if (toDateStr(week[i]) >= b.check_in) {
          startCol = i;
          break;
        }
      }
      // endCol: last day in week where day < check_out
      let endCol = 6;
      for (let i = 6; i >= 0; i--) {
        if (toDateStr(week[i]) < b.check_out) {
          endCol = i;
          break;
        }
      }
      const colSpan = Math.max(1, endCol - startCol + 1);
      return { ...b, startCol, colSpan };
    })
    .sort((a, b) => a.check_in.localeCompare(b.check_in));

  return assignLanes(raw);
}

export default function CalendarClient({ bookings: initial }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState(initial);
  const [currentDate, setCurrentDate] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selected, setSelected] = useState<Booking | null>(null);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("calendar-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [...prev, payload.new as Booking]);
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === (payload.new as Booking).id ? (payload.new as Booking) : b
              )
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) =>
              prev.filter((b) => b.id !== (payload.old as Booking).id)
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build 6-week grid starting on Monday
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay(); // 0 = Sunday
  const startOffset = startDow === 0 ? 6 : startDow - 1;
  const gridStart = new Date(year, month, 1 - startOffset);

  const weeks: Date[][] = [];
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      const day = new Date(gridStart);
      day.setDate(gridStart.getDate() + w * 7 + d);
      week.push(day);
    }
    weeks.push(week);
  }

  const todayStr = toDateStr(new Date());

  const monthStart = toDateStr(new Date(year, month, 1));
  const monthEnd = toDateStr(new Date(year, month + 1, 0));
  const monthBookings = bookings.filter(
    (b) => b.check_in <= monthEnd && b.check_out >= monthStart
  );
  const pendingCount = monthBookings.filter((b) => b.status === "pending").length;
  const acceptedCount = monthBookings.filter((b) => b.status === "accepted").length;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => {
    const n = new Date();
    setCurrentDate(new Date(n.getFullYear(), n.getMonth(), 1));
    setSelected(null);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Kalender
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            {monthBookings.length} boekingen in {MONTHS_NL[month].toLowerCase()}
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-400">· {pendingCount} wachten op bevestiging</span>
            )}
            {acceptedCount > 0 && (
              <span className="ml-2 text-green-400">· {acceptedCount} bevestigd</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs text-[#F5F0E8]/50 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 hover:text-[#F5F0E8]/80 transition-all"
          >
            Vandaag
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all text-sm"
            >
              ←
            </button>
            <span className="px-4 text-[#F5F0E8]/80 text-sm tracking-wider min-w-[170px] text-center">
              {MONTHS_NL[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all text-sm"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 md:gap-6 mb-5">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[key]?.dot ?? "bg-white/20"}`} />
            <span className="text-[#F5F0E8]/35 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Scroll hint on mobile */}
      <p className="md:hidden text-[#F5F0E8]/30 text-xs mb-2">← Scroll om de kalender te bekijken</p>

      {/* Calendar grid — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
      <div className="min-w-[600px] border border-[#C9A84C]/15 overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-[#0F1A10] border-b border-[#C9A84C]/10">
          {DAYS_NL.map((d) => (
            <div
              key={d}
              className="py-3 text-center text-[#C9A84C] text-[0.65rem] tracking-[0.35em] uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, wi) => {
          const weekBookings = getWeekBookings(week, bookings);
          const numLanes = weekBookings.reduce((max, b) => Math.max(max, b.lane + 1), 0);
          const rowH = DAY_NUM_H + numLanes * LANE_H + WEEK_PADDING;
          const isLastWeek = wi === 5;

          return (
            <div
              key={wi}
              className={`relative bg-[#0F1A10] ${!isLastWeek ? "border-b border-[#C9A84C]/10" : ""}`}
              style={{ height: `${rowH}px` }}
            >
              {/* Day number cells */}
              <div className="absolute inset-0 grid grid-cols-7">
                {week.map((day, di) => {
                  const ds = toDateStr(day);
                  const isCurrentMonth = day.getMonth() === month;
                  const isToday = ds === todayStr;
                  return (
                    <div
                      key={di}
                      className={`border-r border-[#C9A84C]/8 last:border-r-0 pt-2 px-2.5 ${
                        !isCurrentMonth ? "opacity-25" : ""
                      }`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 text-xs transition-all ${
                          isToday
                            ? "bg-[#C9A84C] text-[#0F1A10] font-semibold rounded-full"
                            : "text-[#F5F0E8]/45"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Booking bars */}
              {weekBookings.map((b) => {
                const styles = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending;
                const leftPct = (b.startCol / 7) * 100;
                const widthPct = (b.colSpan / 7) * 100;
                const topPx = DAY_NUM_H + b.lane * LANE_H;
                const isSelected = selected?.id === b.id;

                return (
                  <button
                    key={`${b.id}-w${wi}`}
                    onClick={() => setSelected(isSelected ? null : b)}
                    className={`absolute flex items-center px-2 text-[0.6rem] tracking-wide truncate transition-all duration-150 ${styles.bar} ${
                      isSelected ? "ring-1 ring-[#C9A84C]/60 ring-inset" : ""
                    }`}
                    style={{
                      left: `calc(${leftPct}% + 1px)`,
                      width: `calc(${widthPct}% - 3px)`,
                      top: `${topPx}px`,
                      height: `${LANE_H - 3}px`,
                    }}
                    title={`${b.villa_name} — ${b.guest_name} (${b.check_in} → ${b.check_out})`}
                  >
                    <span className="truncate">
                      {b.villa_name}
                      <span className="opacity-60 ml-1">· {b.guest_name}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      </div>{/* end overflow-x-auto */}

      {/* Selected booking detail panel */}
      {selected && (
        <div className="mt-5 bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 animate-in fade-in duration-200">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <p
                  className="text-[#C9A84C] text-sm font-light"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {selected.villa_name}
                </p>
                <span
                  className={`px-2 py-0.5 text-[0.55rem] tracking-wider uppercase border ${
                    selected.status === "pending"
                      ? "bg-yellow-400/15 text-yellow-400 border-yellow-400/30"
                      : selected.status === "accepted"
                      ? "bg-green-400/15 text-green-400 border-green-400/30"
                      : selected.status === "rejected"
                      ? "bg-red-400/15 text-red-400 border-red-400/30"
                      : "bg-white/5 text-white/30 border-white/10"
                  }`}
                >
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>
              <h3
                className="text-2xl font-light text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {selected.guest_name}
              </h3>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-[#F5F0E8]/25 hover:text-[#F5F0E8]/60 transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div>
              <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">Check-in</p>
              <p className="text-[#F5F0E8] text-sm">
                {new Date(selected.check_in + "T00:00:00").toLocaleDateString("nl-NL", {
                  weekday: "short", day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">Check-out</p>
              <p className="text-[#F5F0E8] text-sm">
                {new Date(selected.check_out + "T00:00:00").toLocaleDateString("nl-NL", {
                  weekday: "short", day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">Duur</p>
              <p className="text-[#F5F0E8] text-sm">{selected.total_nights} nachten</p>
            </div>
            <div>
              <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">Gasten</p>
              <p className="text-[#F5F0E8] text-sm">{selected.guest_count} personen</p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[#C9A84C]/10 flex flex-wrap items-center gap-6 justify-between">
            <div className="flex flex-wrap gap-6 text-sm text-[#F5F0E8]/50">
              <span>{selected.guest_email}</span>
              {selected.guest_phone && <span>{selected.guest_phone}</span>}
            </div>
            <p
              className="text-[#C9A84C] text-xl font-light"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              €{selected.total_price.toLocaleString("nl-NL")}
            </p>
          </div>

          {selected.notes && (
            <p className="mt-4 text-[#F5F0E8]/35 text-sm italic border-t border-[#C9A84C]/10 pt-4">
              &ldquo;{selected.notes}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
