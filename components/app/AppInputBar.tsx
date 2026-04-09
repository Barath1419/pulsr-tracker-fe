"use client";

import { useState } from "react";

export function parseEntryForDate(
  raw: string,
  date: string
): { start_time: string; end_time: string; title: string } | null {
  const match = raw
    .trim()
    .match(/^(\d{1,2})(?:[:\.](\d{2}))?(?:\s*[-to]+\s*)(\d{1,2})(?:[:\.](\d{2}))?\s+(.+)$/i);
  if (!match) return null;
  const [, sh, sm = "00", eh, em = "00", title] = match;
  return {
    start_time: `${date}T${sh.padStart(2, "0")}:${sm}:00`,
    end_time: `${date}T${eh.padStart(2, "0")}:${em}:00`,
    title: title.trim(),
  };
}

interface Props {
  onSubmit: (data: { start_time: string; end_time: string; title: string }) => void;
  loading?: boolean;
  date: string;
}

export default function AppInputBar({ onSubmit, loading, date }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !value.trim()) return;
    const parsed = parseEntryForDate(value.trim(), date);
    if (!parsed) {
      setError('Format: "9-10 meeting" or "9 to 10 meeting"');
      return;
    }
    setError("");
    onSubmit(parsed);
    setValue("");
  }

  function handleAdd() {
    const parsed = parseEntryForDate(value.trim(), date);
    if (!parsed) {
      setError('Format: "9-10 meeting" or "9 to 10 meeting"');
      return;
    }
    setError("");
    onSubmit(parsed);
    setValue("");
  }

  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="relative group">
        <div className="absolute inset-0 bg-p-primary/5 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center bg-p-surface-container-lowest border border-p-outline-variant/15 rounded-xl p-1 transition-all focus-within:border-p-outline-variant/40 focus-within:bg-p-surface-container-low shadow-sm">
          <span className="material-symbols-outlined ml-4 text-p-on-surface-variant select-none">
            edit
          </span>
          <input
            className="w-full bg-transparent border-none focus:ring-0 text-p-on-surface placeholder:text-p-on-surface-variant/50 py-4 px-4 text-lg outline-none"
            placeholder="What did you do? (e.g., 9-10 meeting)"
            value={value}
            disabled={loading}
            onChange={(e) => { setValue(e.target.value); setError(""); }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-p-primary text-p-on-primary w-12 h-12 rounded-lg flex items-center justify-center hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-2 ml-4 text-xs text-p-error">{error}</p>
      )}
    </div>
  );
}
