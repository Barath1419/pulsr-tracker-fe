"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  onSubmit: (raw: string) => void;
  loading?: boolean;
}

// Parses "7 to 8 jogging" or "7-8 jogging" → { start, end, title }
export function parseEntry(raw: string): {
  start_time: string;
  end_time: string;
  title: string;
} | null {
  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?(?:\s*[-to]+\s*)(\d{1,2})(?::(\d{2}))?\s+(.+)$/i);
  if (!match) return null;

  const [, sh, sm = "00", eh, em = "00", title] = match;
  const today = new Date().toISOString().split("T")[0];

  return {
    start_time: `${today}T${sh.padStart(2, "0")}:${sm}:00`,
    end_time: `${today}T${eh.padStart(2, "0")}:${em}:00`,
    title: title.trim(),
  };
}

export default function InputBar({ onSubmit, loading }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter" || !value.trim()) return;
    const parsed = parseEntry(value.trim());
    if (!parsed) {
      setError('Format: "9-10 meeting" or "9 to 10 meeting"');
      return;
    }
    setError("");
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <div className="w-full">
      <Input
        value={value}
        onChange={(e) => { setValue(e.target.value); setError(""); }}
        onKeyDown={handleKeyDown}
        placeholder='What did you do? (e.g., 9-10 meeting)'
        disabled={loading}
        className="w-full rounded-xl border-neutral-200 bg-neutral-50 px-4 py-3 text-sm shadow-sm focus:bg-white transition-all"
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
