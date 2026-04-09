"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

type View = "day" | "month" | "year";

const YEAR_PAGE = 12;

export default function DatePicker({ value, onChange, placeholder = "Select date" }: Props) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("day");
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((value?.getFullYear() ?? today.getFullYear()) / YEAR_PAGE) * YEAR_PAGE
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView("day");
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function openPicker() {
    setViewYear(value?.getFullYear() ?? today.getFullYear());
    setViewMonth(value?.getMonth() ?? today.getMonth());
    setYearPageStart(
      Math.floor((value?.getFullYear() ?? today.getFullYear()) / YEAR_PAGE) * YEAR_PAGE
    );
    setView("day");
    setOpen((o) => !o);
  }

  function selectDay(day: number) {
    onChange(new Date(viewYear, viewMonth, day));
    setOpen(false);
    setView("day");
  }

  function selectMonth(m: number) {
    setViewMonth(m);
    setView("day");
  }

  function selectYear(y: number) {
    setViewYear(y);
    setView("month");
  }

  // Nav for day view
  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  // Build calendar grid
  function buildDays() {
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const daysInPrev = getDaysInMonth(viewYear, viewMonth - 1);
    const cells: { day: number; type: "prev" | "cur" | "next" }[] = [];

    for (let i = firstDay - 1; i >= 0; i--)
      cells.push({ day: daysInPrev - i, type: "prev" });
    for (let i = 1; i <= daysInMonth; i++)
      cells.push({ day: i, type: "cur" });
    while (cells.length % 7 !== 0)
      cells.push({ day: cells.length - daysInMonth - firstDay + 1, type: "next" });

    return cells;
  }

  const cells = buildDays();
  const selectedDay = value?.getDate();
  const selectedMonth = value?.getMonth();
  const selectedYear = value?.getFullYear();

  const btnBase = "w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-colors cursor-pointer";

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={openPicker}
        className="w-full flex items-center justify-between bg-p-surface-container-lowest border border-p-outline-variant/20 hover:border-p-outline-variant/40 rounded-xl px-4 py-3 text-sm transition-all outline-none cursor-pointer"
      >
        <span className={value ? "text-p-on-surface" : "text-p-on-surface-variant/50"}>
          {value ? formatDate(value) : placeholder}
        </span>
        <svg className="w-4 h-4 text-p-on-surface-variant/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-2 left-0 w-full min-w-[280px] bg-p-surface-container-highest/95 backdrop-blur-xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-p-outline-variant/10 p-4">

          {/* ── DAY VIEW ── */}
          {view === "day" && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright hover:text-p-on-surface transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>

                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => setView("month")} className="text-sm font-semibold text-p-on-surface hover:text-p-primary transition-colors px-1 cursor-pointer">
                    {MONTHS[viewMonth]}
                  </button>
                  <button type="button" onClick={() => setView("year")} className="text-sm font-semibold text-p-on-surface hover:text-p-primary transition-colors px-1 cursor-pointer">
                    {viewYear}
                  </button>
                </div>

                <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright hover:text-p-on-surface transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[0.625rem] font-medium text-p-on-surface-variant/50 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((cell, i) => {
                  const isSelected =
                    cell.type === "cur" &&
                    cell.day === selectedDay &&
                    viewMonth === selectedMonth &&
                    viewYear === selectedYear;
                  const isToday =
                    cell.type === "cur" &&
                    cell.day === today.getDate() &&
                    viewMonth === today.getMonth() &&
                    viewYear === today.getFullYear();

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => cell.type === "cur" && selectDay(cell.day)}
                      className={[
                        btnBase,
                        cell.type !== "cur" ? "text-p-on-surface-variant/25 cursor-default" : "text-p-on-surface-variant hover:bg-p-surface-bright hover:text-p-on-surface cursor-pointer",
                        isSelected ? "!bg-p-secondary-container !text-p-on-surface font-semibold shadow-[0_0_8px_rgba(145,163,144,0.2)]" : "",
                        isToday && !isSelected ? "text-p-on-surface underline decoration-p-secondary underline-offset-2" : "",
                      ].join(" ")}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ── MONTH VIEW ── */}
          {view === "month" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setViewYear(y => y - 1)} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button type="button" onClick={() => setView("year")} className="text-sm font-semibold text-p-on-surface hover:text-p-primary transition-colors cursor-pointer">
                  {viewYear}
                </button>
                <button type="button" onClick={() => setViewYear(y => y + 1)} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMonth(i)}
                    className={[
                      "py-2 rounded-lg text-sm transition-colors cursor-pointer",
                      i === viewMonth && viewYear === selectedYear
                        ? "bg-p-secondary-container text-p-on-surface font-semibold"
                        : "text-p-on-surface-variant hover:bg-p-surface-bright hover:text-p-on-surface",
                    ].join(" ")}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── YEAR VIEW ── */}
          {view === "year" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setYearPageStart(y => y - YEAR_PAGE)} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <span className="text-sm font-semibold text-p-on-surface">
                  {yearPageStart} – {yearPageStart + YEAR_PAGE - 1}
                </span>
                <button type="button" onClick={() => setYearPageStart(y => y + YEAR_PAGE)} className="p-1.5 rounded-lg text-p-on-surface-variant hover:bg-p-surface-bright transition-colors cursor-pointer">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: YEAR_PAGE }, (_, i) => yearPageStart + i).map(y => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => selectYear(y)}
                    className={[
                      "py-2 rounded-lg text-sm transition-colors cursor-pointer",
                      y === viewYear
                        ? "bg-p-secondary-container text-p-on-surface font-semibold"
                        : "text-p-on-surface-variant hover:bg-p-surface-bright hover:text-p-on-surface",
                    ].join(" ")}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
