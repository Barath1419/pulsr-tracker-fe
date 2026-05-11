"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getDailyInsights } from "@/lib/api";
import { DailyInsights } from "@/types";
import AppSidebar from "@/components/app/AppSidebar";

type Day = "yesterday" | "today";

function getDateForDay(day: Day): Date {
  const d = new Date();
  if (day === "yesterday") d.setDate(d.getDate() - 1);
  return d;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  if (h === 0) return `${min}m`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}m`;
}


const CAT_COLORS: Record<string, string> = {
  work: "#8B8FA8",
  personal_care: "#6B8F71",
  breaks: "#C4A882",
  others: "#7A7A8C",
};

const CAT_LABELS: Record<string, string> = {
  work: "Work",
  personal_care: "Personal Care",
  breaks: "Breaks",
  others: "Others",
};

function DonutChart({ pct }: { pct: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <svg viewBox="0 0 120 120" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="rgba(198,198,198,0.85)"
        strokeWidth="12"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function InsightsPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Day>("today");
  const [daily, setDaily] = useState<DailyInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");

  const dateString = toDateString(getDateForDay(selectedDay));
  const dayLabel = selectedDay === "today" ? "today" : "yesterday";

  const fetchData = useCallback(async (dateStr: string) => {
    setLoading(true);
    try {
      const d = await getDailyInsights(dateStr);
      setDaily(d);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("not authenticated")) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchData(dateString);
  }, [fetchData, dateString, router]);

  const goalMinutes = 24 * 60;
  const goalPct = daily ? Math.min(100, Math.round((daily.total_tracked / goalMinutes) * 100)) : 0;

  const topProject = daily?.project_breakdown[0] ?? null;
  const projTotal = daily?.project_breakdown.reduce((s, p) => s + p.minutes, 0) ?? 0;
  const catData = daily?.category_breakdown;
  const catTotal = catData ? Object.values(catData).reduce((s, v) => s + v, 0) : 0;

  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 glass-panel z-50 shadow-[0_8px_30px_rgba(231,229,229,0.06)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-p-on-surface">Pulsr</span>
          {/* Yesterday / Today tabs */}
          <div className="flex items-center gap-1 bg-p-surface-container-high rounded-full p-1">
            {(["yesterday", "today"] as Day[]).map((d) => (
              <button
                key={d}
                onClick={() => { setSelectedDay(d); setDaily(null); }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedDay === d
                    ? "bg-p-surface-bright text-p-on-surface"
                    : "text-p-on-surface-variant hover:text-p-on-surface"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <button className="material-symbols-outlined text-p-primary p-2 hover:bg-p-surface-bright rounded-full transition-all duration-200 active:scale-95">
          account_circle
        </button>
      </header>

      <AppSidebar title="Insights" />

      {/* Main */}
      <main className="lg:pl-64 pt-16 min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <p className="text-sm text-p-on-surface-variant animate-pulse">Loading...</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-6 md:px-12 py-16">

            {/* Hero */}
            <div className="mb-16">
              <p className="text-[0.6875rem] font-bold tracking-[0.12em] uppercase text-p-on-surface-variant mb-4">
                Review Your Day
              </p>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-p-on-surface leading-none mb-4">
                {daily && daily.total_tracked > 0
                  ? <>You tracked <span className="text-p-on-surface/60">{formatMinutes(daily.total_tracked)}</span> {dayLabel}.</>
                  : <>Nothing tracked {dayLabel} yet.</>
                }
              </h1>
              {daily && (
                <p className="text-p-on-surface-variant text-base mt-3">
                  {daily.untracked_minutes > 0
                    ? <>{formatMinutes(daily.untracked_minutes)} of your day remains unaccounted for.</>
                    : <>You accounted for the full 24 hours — great work.</>
                  }
                </p>
              )}
            </div>

            {/* Bento cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {/* Peak Performance */}
              <div className="bg-p-surface-container-low rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-p-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">emoji_events</span>
                  <span className="text-[0.625rem] font-bold tracking-[0.1em] uppercase">Peak Performance</span>
                </div>
                <div className="mt-auto">
                  <div className="text-2xl font-black tracking-tight text-p-on-surface leading-tight">
                    {topProject ? topProject.name : "—"}
                  </div>
                  <div className="text-sm text-p-on-surface-variant mt-1">
                    {topProject ? `${formatMinutes(topProject.minutes)} logged` : "No entries yet"}
                  </div>
                </div>
              </div>

              {/* Peak Time Window */}
              <div className="bg-p-surface-container-low rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-p-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-[0.625rem] font-bold tracking-[0.1em] uppercase">Focus Window</span>
                </div>
                <div className="mt-auto">
                  <div className="text-2xl font-black tracking-tight text-p-on-surface leading-tight">
                    {daily?.peak_window ?? "—"}
                  </div>
                  <div className="text-sm text-p-on-surface-variant mt-1">
                    {daily?.peak_window ? "Highest activity block" : "No data yet"}
                  </div>
                </div>
              </div>

              {/* Gaps Detected */}
              <div className="bg-p-surface-container-low rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-p-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                  <span className="text-[0.625rem] font-bold tracking-[0.1em] uppercase">Gaps Detected</span>
                </div>
                <div className="mt-auto">
                  <div className="text-2xl font-black tracking-tight text-p-on-surface leading-tight">
                    {daily ? formatMinutes(daily.untracked_minutes) : "—"}
                  </div>
                  <div className="text-sm text-p-on-surface-variant mt-1">
                    {daily && daily.untracked_minutes === 0 ? "Fully accounted for" : "Untracked time"}
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Distribution */}
            {daily && projTotal > 0 && (
              <div className="bg-p-surface-container-low rounded-2xl p-6 mb-10">
                <p className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-p-on-surface-variant mb-5">
                  Focus Distribution
                </p>
                {/* Stacked bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex mb-5 gap-px">
                  {daily.project_breakdown.map((p, i) => {
                    const pct = (p.minutes / projTotal) * 100;
                    const colors = ["#8B8FA8", "#6B8F71", "#C4A882", "#9B8EA8", "#7A9B8E"];
                    return (
                      <div
                        key={p.name}
                        className="h-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }}
                        title={`${p.name}: ${formatMinutes(p.minutes)}`}
                      />
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {daily.project_breakdown.map((p, i) => {
                    const colors = ["#8B8FA8", "#6B8F71", "#C4A882", "#9B8EA8", "#7A9B8E"];
                    return (
                      <div key={p.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                        <span className="text-xs text-p-on-surface-variant">{p.name}</span>
                        <span className="text-xs text-p-on-surface font-semibold">{formatMinutes(p.minutes)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom two-column section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left: Category breakdown + Reflection */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Category breakdown */}
                {daily && catTotal > 0 && (
                  <div className="bg-p-surface-container-low rounded-2xl p-6">
                    <p className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-p-on-surface-variant mb-5">
                      Where Your Time Goes
                    </p>
                    <div className="flex flex-col gap-3">
                      {(["work", "personal_care", "breaks", "others"] as const).map((cat) => {
                        const mins = catData?.[cat] ?? 0;
                        const pct = catTotal > 0 ? (mins / catTotal) * 100 : 0;
                        if (mins === 0) return null;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between items-end mb-1.5">
                              <span className="text-xs text-p-on-surface-variant">{CAT_LABELS[cat]}</span>
                              <span className="text-xs font-semibold text-p-on-surface">{formatMinutes(mins)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-p-surface-container-high rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: CAT_COLORS[cat] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reflection */}
                <div className="bg-p-surface-container-low rounded-2xl p-6">
                  <p className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-p-on-surface-variant mb-3">
                    How did your day feel?
                  </p>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write a quick reflection on today's work..."
                    rows={4}
                    className="w-full bg-transparent text-p-on-surface text-sm placeholder:text-p-on-surface-variant/40 resize-none outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Right: Goal donut */}
              <div className="lg:col-span-5">
                <div className="bg-p-surface-container-low rounded-2xl p-6 h-full flex flex-col">
                  <p className="text-[0.625rem] font-bold tracking-[0.1em] uppercase text-p-on-surface-variant mb-6">
                    Daily Goal Progress
                  </p>
                  <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="relative w-40 h-40">
                      <DonutChart pct={goalPct} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black tracking-tighter text-p-on-surface">{goalPct}%</span>
                        <span className="text-[0.625rem] text-p-on-surface-variant uppercase tracking-widest mt-0.5">of 24h day</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-p-on-surface">
                        {formatMinutes(daily?.total_tracked ?? 0)} tracked
                      </div>
                      <div className="text-xs text-p-on-surface-variant mt-1">
                        {daily && daily.untracked_minutes > 0
                          ? `${formatMinutes(daily.untracked_minutes)} remaining`
                          : "Goal complete"
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between mt-10 pt-8">
              <a
                href="/app"
                className="flex items-center gap-2 text-p-on-surface-variant text-sm hover:text-p-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Journal
              </a>
              {reflection.trim() && (
                <button
                  onClick={() => {
                    // future: save reflection to backend
                    setReflection("");
                  }}
                  className="bg-p-primary text-p-on-primary text-sm font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Reflection
                </button>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 w-full flex justify-around items-center glass-panel h-16 z-50">
        <a href="/app" className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px]">Journal</span>
        </a>
        <a href="/app/insights" className="flex flex-col items-center gap-1 text-p-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className="text-[10px] font-bold">Insights</span>
        </a>
        <a href="/app/categories" className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">category</span>
          <span className="text-[10px]">Categories</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">tune</span>
          <span className="text-[10px]">Settings</span>
        </a>
      </nav>
    </div>
  );
}
