"use client";

import { useState, useMemo } from "react";
import TimeSuggestionDropdown, { Suggestion } from "./TimeSuggestionDropdown";

// ─── Helpers ────────────────────────────────────────────────────────────────

function amHour(h: number) { return h === 12 ? 0 : h; }
function pmHour(h: number) { return h === 12 ? 12 : h + 12; }

function fmtTime(h: number, m: number): string {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── Suggestion generation ───────────────────────────────────────────────────

const TIME_RANGE_RE =
  /^(\d{1,2})(?:[:\.](\d{2}))?(?:\s*(?:to|-)\s*)(\d{1,2})(?:[:\.](\d{2}))?\s+(.+)/i;

export function buildSuggestions(
  raw: string,
  date: string,
  lastEndTime?: Date
): Suggestion[] {
  const match = raw.trim().match(TIME_RANGE_RE);
  if (!match) return [];

  const sh = parseInt(match[1]);
  const sm = parseInt(match[2] ?? "0");
  const eh = parseInt(match[3]);
  const em = parseInt(match[4] ?? "0");
  const title = match[5].trim();

  if (!title) return [];

  // Already unambiguous 24h format
  if (sh >= 13 || eh >= 13) return [];
  // Midnight explicit — treat as unambiguous
  if (sh === 0) return [];

  const [y, mo, d] = date.split("-").map(Number);
  const makeDate = (h: number, m: number) => new Date(y, mo - 1, d, h, m);

  const amSH = amHour(sh);
  const amEH = amHour(eh);
  const pmSH = pmHour(sh);
  const pmEH = pmHour(eh);

  const isValid = (s: number, sm2: number, e: number, em2: number) =>
    e * 60 + em2 > s * 60 + sm2;

  // Prefer PM for 1–6, AM for 7–11; last entry end time overrides
  let pmRecommended = sh >= 1 && sh <= 6;
  if (lastEndTime) {
    pmRecommended = lastEndTime.getHours() >= 12;
  }

  const results: Suggestion[] = [];

  if (isValid(pmSH, sm, pmEH, em)) {
    results.push({
      start_time: makeDate(pmSH, sm),
      end_time: makeDate(pmEH, em),
      label: `${fmtTime(pmSH, sm)} – ${fmtTime(pmEH, em)}`,
      isRecommended: pmRecommended,
    });
  }

  if (isValid(amSH, sm, amEH, em) && amSH !== pmSH) {
    results.push({
      start_time: makeDate(amSH, sm),
      end_time: makeDate(amEH, em),
      label: `${fmtTime(amSH, sm)} – ${fmtTime(amEH, em)}`,
      isRecommended: !pmRecommended,
    });
  }

  // Recommended always first
  results.sort((a, b) => Number(b.isRecommended) - Number(a.isRecommended));

  return results;
}

// ─── Full parse (fallback direct submission) ─────────────────────────────────

export function parseEntryForDate(
  raw: string,
  date: string
): { start_time: string; end_time: string; title: string } | null {
  const match = raw
    .trim()
    .match(/^(\d{1,2})(?:[:\.](\d{2}))?(?:\s*[-to]+\s*)(\d{1,2})(?:[:\.](\d{2}))?\s+(.+)$/i);
  if (!match) return null;
  const [, sh, sm = "00", eh, em = "00", title] = match;
  const pad = (n: string) => n.padStart(2, "0");
  return {
    start_time: `${date}T${pad(sh)}:${pad(sm)}:00`,
    end_time: `${date}T${pad(eh)}:${pad(em)}:00`,
    title: title.trim(),
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  onParsed: (data: { start_time: string; end_time: string; title: string }) => void;
  loading?: boolean;
  date: string;
  lastEndTime?: Date;
}

export default function AppInputBar({ onParsed, loading, date, lastEndTime }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const suggestions = useMemo(
    () => buildSuggestions(value, date, lastEndTime),
    [value, date, lastEndTime]
  );

  const showDropdown = suggestions.length > 0 && !dismissed;

  function selectSuggestion(s: Suggestion) {
    const m = value.trim().match(TIME_RANGE_RE);
    const title = m?.[5]?.trim() ?? "";
    const pad = (n: number) => String(n).padStart(2, "0");
    const iso = (d: Date) =>
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

    setValue("");
    setError("");
    setDismissed(false);
    setHighlightedIndex(0);
    onParsed({ start_time: iso(s.start_time), end_time: iso(s.end_time), title });
  }

  function attempt() {
    if (!value.trim()) return;
    if (showDropdown && suggestions[highlightedIndex]) {
      selectSuggestion(suggestions[highlightedIndex]);
      return;
    }
    const parsed = parseEntryForDate(value.trim(), date);
    if (!parsed) {
      setError('Format: "9-10 meeting" or "2 to 3 meeting"');
      return;
    }
    setError("");
    setValue("");
    onParsed(parsed);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (showDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((p) => (p + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((p) => (p - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setDismissed(true);
        return;
      }
    }
    if (e.key === "Enter") attempt();
  }

  return (
    <div>
      <div className="relative group">
        <div className="absolute inset-0 bg-p-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-p-surface-container-lowest border border-p-outline-variant/15 rounded-xl p-1 transition-all focus-within:border-p-outline-variant/40 focus-within:bg-p-surface-container-low shadow-sm">
          <span className="material-symbols-outlined ml-4 text-p-on-surface-variant select-none">
            edit
          </span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-p-on-surface placeholder:text-p-on-surface-variant/50 py-4 px-4 text-lg outline-none"
            placeholder="What did you do? (e.g., 2 to 3 meeting)"
            value={value}
            disabled={loading}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
              setDismissed(false);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={attempt}
              disabled={loading}
              className="bg-p-primary text-p-on-primary w-12 h-12 rounded-lg flex items-center justify-center hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>

        {showDropdown && (
          <TimeSuggestionDropdown
            suggestions={suggestions}
            highlightedIndex={highlightedIndex}
            onSelect={selectSuggestion}
            onHighlight={setHighlightedIndex}
            onDismiss={() => setDismissed(true)}
          />
        )}
      </div>

      {error && (
        <p className="mt-2 ml-4 text-xs text-p-error">{error}</p>
      )}
    </div>
  );
}
