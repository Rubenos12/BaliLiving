"use client";

import { useState, useEffect } from "react";
import {
  updateVisaStatus,
  deleteVisaApplication,
  createVisaApplication,
} from "@/lib/actions/visums";
import { createClient } from "@/lib/supabase/client";

type VisaApplication = {
  id: string;
  created_at: string;
  updated_at: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string | null;
  nationality: string;
  passport_number: string | null;
  passport_expiry: string | null;
  travel_date: string;
  return_date: string;
  num_travelers: number;
  visa_type: string;
  notes: string | null;
  admin_notes: string | null;
  status: string;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; next: string[] }
> = {
  pending: {
    label: "In afwachting",
    badge: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
    next: ["in_progress", "rejected"],
  },
  in_progress: {
    label: "In behandeling",
    badge: "bg-blue-400/15 text-blue-400 border-blue-400/30",
    next: ["approved", "rejected"],
  },
  approved: {
    label: "Goedgekeurd",
    badge: "bg-green-400/15 text-green-400 border-green-400/30",
    next: [],
  },
  rejected: {
    label: "Afgewezen",
    badge: "bg-red-400/15 text-red-400 border-red-400/30",
    next: [],
  },
};

const STATUS_ACTION_LABELS: Record<string, string> = {
  in_progress: "In behandeling nemen",
  approved: "✓ Goedkeuren",
  rejected: "✕ Afwijzen",
};

const VISA_TYPE_LABELS: Record<string, string> = {
  tourist: "Toeristenvisum",
  business: "Zakenvisum",
  social: "Sociaal visum",
  other: "Anders",
};

const FILTERS = [
  { key: "all", label: "Alle" },
  { key: "pending", label: "In afwachting" },
  { key: "in_progress", label: "In behandeling" },
  { key: "approved", label: "Goedgekeurd" },
  { key: "rejected", label: "Afgewezen" },
];

const EMPTY_FORM = {
  applicant_name: "",
  applicant_email: "",
  applicant_phone: "",
  nationality: "",
  passport_number: "",
  passport_expiry: "",
  travel_date: "",
  return_date: "",
  num_travelers: 1,
  visa_type: "tourist" as "tourist" | "business" | "social" | "other",
  notes: "",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[#F5F0E8]/40 text-[0.6rem] tracking-[0.25em] uppercase mb-1.5">
        {label}
        {required && <span className="text-[#C9A84C] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  "w-full bg-[#0F1A10] border border-[#C9A84C]/15 text-[#F5F0E8] text-sm px-3 py-2.5 focus:outline-none focus:border-[#C9A84C]/40 transition-colors placeholder-[#F5F0E8]/20";

export default function VisumsClient({
  applications: initial,
}: {
  applications: VisaApplication[];
}) {
  const [applications, setApplications] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  // New application drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("visa-applications-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "visa_applications" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setApplications((prev) => [
              payload.new as VisaApplication,
              ...prev,
            ]);
            setPulse(true);
            setTimeout(() => setPulse(false), 3000);
          } else if (payload.eventType === "UPDATE") {
            setApplications((prev) =>
              prev.map((a) =>
                a.id === (payload.new as VisaApplication).id
                  ? (payload.new as VisaApplication)
                  : a
              )
            );
          } else if (payload.eventType === "DELETE") {
            setApplications((prev) =>
              prev.filter(
                (a) => a.id !== (payload.old as VisaApplication).id
              )
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  const pendingCount = applications.filter(
    (a) => a.status === "pending"
  ).length;

  const handleStatusUpdate = async (
    id: string,
    status: "pending" | "in_progress" | "approved" | "rejected"
  ) => {
    setLoading(id + status);
    const notes = adminNotes[id] ?? "";
    const result = await updateVisaStatus(id, status, notes);
    if (!result.error) {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, admin_notes: notes } : a))
      );
    }
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze aanvraag wilt verwijderen?")) return;
    setLoading(id + "delete");
    const result = await deleteVisaApplication(id);
    if (!result.error) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (expanded === id) setExpanded(null);
    }
    setLoading(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    const result = await createVisaApplication({
      applicant_name: form.applicant_name,
      applicant_email: form.applicant_email,
      applicant_phone: form.applicant_phone || undefined,
      nationality: form.nationality,
      passport_number: form.passport_number || undefined,
      passport_expiry: form.passport_expiry || undefined,
      travel_date: form.travel_date,
      return_date: form.return_date,
      num_travelers: form.num_travelers,
      visa_type: form.visa_type,
      notes: form.notes || undefined,
    });

    setFormLoading(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    // Add to local state immediately (real-time will also fire)
    if (result.data) {
      setApplications((prev) => [result.data as VisaApplication, ...prev]);
    }

    setForm(EMPTY_FORM);
    setDrawerOpen(false);
  };

  const set = (field: keyof typeof EMPTY_FORM) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const val = field === "num_travelers" ? Number(e.target.value) : e.target.value;
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Visumaanvragen
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            {applications.length} totaal
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-400">
                · {pendingCount} wachten op behandeling
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 text-xs transition-all duration-500 ${
              pulse ? "text-green-400" : "text-[#F5F0E8]/20"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                pulse ? "bg-green-400 animate-pulse" : "bg-[#F5F0E8]/20"
              }`}
            />
            Live
          </div>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setFormError(null);
              setDrawerOpen(true);
            }}
            className="px-5 py-2.5 bg-[#C9A84C] text-[#0F1A10] text-xs tracking-wider uppercase font-medium hover:bg-[#D4B55A] transition-colors"
          >
            + Nieuwe aanvraag
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {FILTERS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs tracking-wider transition-all duration-200 ${
              filter === tab.key
                ? "bg-[#C9A84C] text-[#1C2B1E]"
                : "bg-[#1C2B1E] text-[#F5F0E8]/50 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 py-20 text-center">
          <p className="text-[#F5F0E8]/30 text-sm mb-2">Geen aanvragen gevonden</p>
          {applications.length === 0 && (
            <p className="text-[#F5F0E8]/20 text-xs max-w-sm mx-auto leading-relaxed">
              Aanvragen verschijnen hier zodra klanten een visumaanvraag indienen,
              of maak er handmatig een aan via de knop hierboven.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const cfg = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending;
            const isOpen = expanded === app.id;

            return (
              <div
                key={app.id}
                className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/25 transition-colors"
              >
                {/* Summary row */}
                <button
                  className="w-full text-left p-5 flex flex-wrap gap-4 items-start"
                  onClick={() => setExpanded(isOpen ? null : app.id)}
                >
                  <div className="min-w-[160px] flex-1">
                    <p className="text-[#F5F0E8] font-medium text-sm">
                      {app.applicant_name}
                    </p>
                    <p className="text-[#F5F0E8]/40 text-xs mt-0.5">
                      {app.applicant_email}
                    </p>
                    {app.applicant_phone && (
                      <p className="text-[#F5F0E8]/40 text-xs">
                        {app.applicant_phone}
                      </p>
                    )}
                  </div>

                  <div className="flex-1 min-w-[160px]">
                    <p
                      className="text-[#C9A84C] text-sm font-light"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {VISA_TYPE_LABELS[app.visa_type] ?? app.visa_type}
                    </p>
                    <p className="text-[#F5F0E8]/50 text-xs mt-1">
                      {app.nationality} · {app.num_travelers}{" "}
                      {app.num_travelers === 1 ? "persoon" : "personen"}
                    </p>
                    <p className="text-[#F5F0E8]/40 text-xs">
                      ✈ {app.travel_date} → {app.return_date}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 text-[0.6rem] tracking-wider uppercase border ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>
                    <span
                      className={`text-[#F5F0E8]/30 text-xs transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-[#C9A84C]/10 p-5 space-y-5">
                    {/* Details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">
                          Nationaliteit
                        </p>
                        <p className="text-[#F5F0E8] text-sm">{app.nationality}</p>
                      </div>
                      <div>
                        <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">
                          Paspoort
                        </p>
                        <p className="text-[#F5F0E8] text-sm">
                          {app.passport_number ?? "—"}
                        </p>
                        {app.passport_expiry && (
                          <p className="text-[#F5F0E8]/40 text-xs">
                            Vervalt: {app.passport_expiry}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">
                          Aangemeld op
                        </p>
                        <p className="text-[#F5F0E8] text-sm">
                          {new Date(app.created_at).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-1">
                          Reizigers
                        </p>
                        <p className="text-[#F5F0E8] text-sm">
                          {app.num_travelers}
                        </p>
                      </div>
                    </div>

                    {/* Applicant notes */}
                    {app.notes && (
                      <div>
                        <p className="text-[#F5F0E8]/30 text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                          Bericht van aanvrager
                        </p>
                        <p className="text-[#F5F0E8]/55 text-sm italic leading-relaxed bg-[#0F1A10]/40 p-3">
                          &ldquo;{app.notes}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Admin notes */}
                    <div>
                      <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-2">
                        Interne notities
                      </label>
                      <textarea
                        rows={3}
                        value={adminNotes[app.id] ?? app.admin_notes ?? ""}
                        onChange={(e) =>
                          setAdminNotes((prev) => ({
                            ...prev,
                            [app.id]: e.target.value,
                          }))
                        }
                        placeholder="Voeg interne notities toe..."
                        className="w-full bg-[#0F1A10] border border-[#C9A84C]/15 text-[#F5F0E8] text-sm px-3 py-2 focus:outline-none focus:border-[#C9A84C]/40 transition-colors resize-none placeholder-[#F5F0E8]/20"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      {cfg.next.map((nextStatus) => (
                        <button
                          key={nextStatus}
                          onClick={() =>
                            handleStatusUpdate(
                              app.id,
                              nextStatus as
                                | "pending"
                                | "in_progress"
                                | "approved"
                                | "rejected"
                            )
                          }
                          disabled={loading === app.id + nextStatus}
                          className={`px-5 py-2 text-[0.6rem] tracking-wider uppercase transition-colors disabled:opacity-50 border ${
                            nextStatus === "approved"
                              ? "bg-green-500/15 text-green-400 border-green-400/30 hover:bg-green-500/25"
                              : nextStatus === "rejected"
                              ? "bg-red-500/15 text-red-400 border-red-400/30 hover:bg-red-500/25"
                              : "bg-blue-500/15 text-blue-400 border-blue-400/30 hover:bg-blue-500/25"
                          }`}
                        >
                          {loading === app.id + nextStatus
                            ? "Bezig..."
                            : STATUS_ACTION_LABELS[nextStatus]}
                        </button>
                      ))}

                      {/* Save notes button (shown when notes changed) */}
                      {adminNotes[app.id] !== undefined &&
                        adminNotes[app.id] !== (app.admin_notes ?? "") && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(
                                app.id,
                                app.status as
                                  | "pending"
                                  | "in_progress"
                                  | "approved"
                                  | "rejected"
                              )
                            }
                            disabled={!!loading}
                            className="px-5 py-2 text-[0.6rem] tracking-wider uppercase border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors disabled:opacity-50"
                          >
                            Notities opslaan
                          </button>
                        )}

                      <button
                        onClick={() => handleDelete(app.id)}
                        disabled={loading === app.id + "delete"}
                        className="ml-auto px-4 py-2 text-[0.6rem] tracking-wider uppercase text-[#F5F0E8]/25 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {loading === app.id + "delete"
                          ? "Verwijderen..."
                          : "Verwijderen"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── New application drawer ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-lg bg-[#0F1A10] border-l border-[#C9A84C]/20 flex flex-col h-full overflow-y-auto z-10">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#C9A84C]/10 sticky top-0 bg-[#0F1A10] z-10">
              <div>
                <h2
                  className="text-xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Nieuwe visumaanvraag
                </h2>
                <p className="text-[#F5F0E8]/35 text-xs mt-0.5">
                  Handmatig aanmaken namens een klant
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#F5F0E8]/30 hover:text-[#F5F0E8]/70 text-xl transition-colors leading-none"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 px-6 py-6 space-y-5">
              {/* Applicant */}
              <div>
                <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-3">
                  Aanvrager
                </p>
                <div className="space-y-3">
                  <Field label="Volledige naam" required>
                    <input
                      type="text"
                      required
                      value={form.applicant_name}
                      onChange={set("applicant_name")}
                      placeholder="Jan de Vries"
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label="E-mailadres" required>
                    <input
                      type="email"
                      required
                      value={form.applicant_email}
                      onChange={set("applicant_email")}
                      placeholder="jan@example.com"
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label="Telefoonnummer">
                    <input
                      type="tel"
                      value={form.applicant_phone}
                      onChange={set("applicant_phone")}
                      placeholder="+31 6 12 34 56 78"
                      className={INPUT_CLS}
                    />
                  </Field>
                </div>
              </div>

              {/* Passport */}
              <div>
                <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-3">
                  Paspoort & nationaliteit
                </p>
                <div className="space-y-3">
                  <Field label="Nationaliteit" required>
                    <input
                      type="text"
                      required
                      value={form.nationality}
                      onChange={set("nationality")}
                      placeholder="Nederlands"
                      className={INPUT_CLS}
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Paspoortnummer">
                      <input
                        type="text"
                        value={form.passport_number}
                        onChange={set("passport_number")}
                        placeholder="AB1234567"
                        className={INPUT_CLS}
                      />
                    </Field>
                    <Field label="Vervaldatum paspoort">
                      <input
                        type="date"
                        value={form.passport_expiry}
                        onChange={set("passport_expiry")}
                        className={INPUT_CLS}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Travel */}
              <div>
                <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-3">
                  Reisgegevens
                </p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Vertrekdatum" required>
                      <input
                        type="date"
                        required
                        value={form.travel_date}
                        onChange={set("travel_date")}
                        className={INPUT_CLS}
                      />
                    </Field>
                    <Field label="Retourdatum" required>
                      <input
                        type="date"
                        required
                        value={form.return_date}
                        onChange={set("return_date")}
                        className={INPUT_CLS}
                      />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Aantal reizigers" required>
                      <input
                        type="number"
                        required
                        min={1}
                        max={20}
                        value={form.num_travelers}
                        onChange={set("num_travelers")}
                        className={INPUT_CLS}
                      />
                    </Field>
                    <Field label="Type visum" required>
                      <select
                        required
                        value={form.visa_type}
                        onChange={set("visa_type")}
                        className={INPUT_CLS}
                      >
                        <option value="tourist">Toeristenvisum</option>
                        <option value="business">Zakenvisum</option>
                        <option value="social">Sociaal visum</option>
                        <option value="other">Anders</option>
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <Field label="Notities">
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Aanvullende informatie..."
                  className={`${INPUT_CLS} resize-none`}
                />
              </Field>

              {/* Error */}
              {formError && (
                <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-3 py-2">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2 pb-8">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 px-4 py-3 text-[0.6rem] tracking-wider uppercase border border-[#C9A84C]/15 text-[#F5F0E8]/40 hover:text-[#F5F0E8]/70 transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-3 text-[0.6rem] tracking-wider uppercase bg-[#C9A84C] text-[#0F1A10] font-medium hover:bg-[#D4B55A] transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Opslaan..." : "Aanvraag aanmaken"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
