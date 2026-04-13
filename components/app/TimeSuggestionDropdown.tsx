"use client";

import { useEffect, useRef } from "react";

export interface Suggestion {
  start_time: Date;
  end_time: Date;
  label: string;
  isRecommended: boolean;
}

interface Props {
  suggestions: Suggestion[];
  highlightedIndex: number;
  onSelect: (s: Suggestion) => void;
  onHighlight: (i: number) => void;
  onDismiss: () => void;
}

export default function TimeSuggestionDropdown({
  suggestions,
  highlightedIndex,
  onSelect,
  onHighlight,
  onDismiss,
}: Props) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  const Content = () => (
    <>
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.1em] text-p-on-surface-variant/50">
          Time suggestions
        </span>
        <button
          onClick={onDismiss}
          className="text-p-on-surface-variant/30 hover:text-p-on-surface-variant transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>

      <div className="py-1">
        {suggestions.map((s, i) => {
          const hl = i === highlightedIndex;
          return (
            <button
              key={s.label}
              ref={(el) => { itemRefs.current[i] = el; }}
              onClick={() => onSelect(s)}
              onMouseEnter={() => onHighlight(i)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-colors duration-100 cursor-pointer ${
                hl ? "bg-p-surface-bright" : "hover:bg-p-surface-bright"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[16px] ${hl ? "text-p-on-surface-variant" : "text-p-on-surface-variant/40"}`}>
                  schedule
                </span>
                <span className="text-sm font-medium text-p-on-surface">{s.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.isRecommended && (
                  <span className="text-[0.6rem] font-bold uppercase tracking-wider text-p-secondary">
                    Recommended
                  </span>
                )}
                {hl && (
                  <span className="material-symbols-outlined text-[14px] text-p-on-surface-variant/40">
                    keyboard_return
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-2.5 pt-1">
        <span className="text-[0.6rem] text-p-on-surface-variant/30 uppercase tracking-wider">
          ↑↓ navigate · ↵ select · esc dismiss
        </span>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: floating panel */}
      <div className="hidden md:block absolute top-full left-0 mt-2 z-40 w-80 glass-panel rounded-xl shadow-[0_8px_32px_rgba(231,229,229,0.06)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
        <Content />
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/20" onClick={onDismiss} />
        <div className="relative glass-panel rounded-t-2xl shadow-[0_-8px_32px_rgba(231,229,229,0.06)] animate-in slide-in-from-bottom duration-200">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-p-outline-variant/30" />
          </div>
          <Content />
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}
