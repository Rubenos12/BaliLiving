"use client";

import { useState } from "react";
import { createReview } from "@/lib/actions/reviews";
import type { VillaReview } from "@/lib/actions/reviews";

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: "sm" | "md";
}) {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const active = readonly ? value : hovered || value;
  const sizeClass = size === "sm" ? "text-base" : "text-xl";

  return (
    <div className="flex gap-0.5">
      {stars.map((s) => (
        <button
          key={s}
          type={readonly ? "button" : "button"}
          disabled={readonly}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${sizeClass} transition-colors duration-100 disabled:cursor-default ${
            s <= active ? "text-[#C9A84C]" : "text-[#F5F0E8]/15"
          } ${!readonly ? "hover:scale-110 transition-transform cursor-pointer" : ""}`}
          aria-label={readonly ? undefined : `${s} sterren`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    month: "long",
    year: "numeric",
  });
}

type Props = {
  villaSlug: string;
  initialReviews: VillaReview[];
  averageRating: number;
  reviewCount: number;
};

export default function VillaReviews({
  villaSlug,
  initialReviews,
  averageRating,
  reviewCount,
}: Props) {
  const [reviews] = useState<VillaReview[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    reviewer_name: "",
    reviewer_email: "",
    rating: 0,
    review_text: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rating === 0) {
      setSubmitError("Geef een beoordeling van 1–5 sterren.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const result = await createReview({
      villa_slug: villaSlug,
      reviewer_name: form.reviewer_name,
      reviewer_email: form.reviewer_email,
      rating: form.rating,
      review_text: form.review_text,
    });
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div id="reviews" className="pt-12 border-t border-[#C9A84C]/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">
            Ervaringen
          </p>
          <div className="flex items-center gap-3">
            {reviewCount > 0 ? (
              <>
                <StarRating value={averageRating} readonly size="sm" />
                <span
                  className="text-3xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-[#F5F0E8]/35 text-sm">
                  · {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </>
            ) : (
              <span className="text-[#F5F0E8]/35 text-sm">Nog geen reviews</span>
            )}
          </div>
        </div>
        {!submitted && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="self-start sm:self-auto px-5 py-2.5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
          >
            {showForm ? "Annuleren" : "Schrijf een review"}
          </button>
        )}
      </div>

      {/* Submission success */}
      {submitted && (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 px-5 py-4 mb-8 text-sm text-[#F5F0E8]/60">
          <span className="text-[#C9A84C] mr-2">✦</span>
          Bedankt voor je review! Deze wordt gepubliceerd na goedkeuring.
        </div>
      )}

      {/* Review form */}
      {showForm && !submitted && (
        <form onSubmit={handleSubmit} className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5 sm:p-6 mb-8 space-y-4">
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Jouw review</p>

          {/* Star picker */}
          <div>
            <label className="block text-[#F5F0E8]/40 text-xs tracking-wider uppercase mb-2">
              Beoordeling *
            </label>
            <StarRating
              value={form.rating}
              onChange={(v) => setForm({ ...form, rating: v })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#F5F0E8]/40 text-xs tracking-wider uppercase mb-1.5">
                Naam *
              </label>
              <input
                type="text"
                name="reviewer_name"
                value={form.reviewer_name}
                onChange={handleChange}
                required
                className="w-full bg-[#243628] border border-[#C9A84C]/15 text-[#F5F0E8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-[#F5F0E8]/20"
                placeholder="Jouw naam"
              />
            </div>
            <div>
              <label className="block text-[#F5F0E8]/40 text-xs tracking-wider uppercase mb-1.5">
                E-mail *
              </label>
              <input
                type="email"
                name="reviewer_email"
                value={form.reviewer_email}
                onChange={handleChange}
                required
                className="w-full bg-[#243628] border border-[#C9A84C]/15 text-[#F5F0E8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-[#F5F0E8]/20"
                placeholder="jouw@email.nl"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#F5F0E8]/40 text-xs tracking-wider uppercase mb-1.5">
              Jouw ervaring *
            </label>
            <textarea
              name="review_text"
              value={form.review_text}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-[#243628] border border-[#C9A84C]/15 text-[#F5F0E8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/50 placeholder-[#F5F0E8]/20 resize-none"
              placeholder="Vertel over je verblijf..."
            />
          </div>

          {submitError && (
            <p className="text-red-400 text-xs">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-8 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors duration-300 disabled:opacity-60"
          >
            {submitting ? "Versturen..." : "Verstuur review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-[#C9A84C]/10 pb-6 last:border-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-[#F5F0E8] text-sm font-light">{review.reviewer_name}</p>
                  <p className="text-[#F5F0E8]/30 text-xs mt-0.5">{formatDate(review.created_at)}</p>
                </div>
                <StarRating value={review.rating} readonly size="sm" />
              </div>
              <p className="text-[#F5F0E8]/60 text-sm leading-relaxed">{review.review_text}</p>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <p className="text-[#F5F0E8]/25 text-sm">
            Nog geen reviews voor deze villa. Wees de eerste!
          </p>
        )
      )}
    </div>
  );
}
