"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getEntries, createEntry, deleteEntry, getCategories } from "@/lib/api";
import { Entry, Category } from "@/types";
import DayTabs from "@/components/app/DayTabs";
import AppInputBar from "@/components/app/AppInputBar";
import AppTimeline from "@/components/app/AppTimeline";
import DailySummary from "@/components/app/DailySummary";
import ProjectSelector from "@/components/app/ProjectSelector";

type Day = "yesterday" | "today" | "tomorrow";

function getDateForDay(day: Day): Date {
  const d = new Date();
  if (day === "yesterday") d.setDate(d.getDate() - 1);
  if (day === "tomorrow") d.setDate(d.getDate() + 1);
  return d;
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDisplayDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const sideNavLinks = [
  { icon: "history_edu", label: "Journal", href: "/app", active: true },
  { icon: "analytics", label: "Insights", href: "/app/insights" },
  { icon: "category", label: "Categories", href: "/app/categories" },
  { icon: "tune", label: "Settings", href: "#" },
];

export default function AppPage() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Day>("today");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingData, setPendingData] = useState<{ start_time: string; end_time: string; title: string } | null>(null);

  const selectedDate = getDateForDay(selectedDay);
  const dateString = toDateString(selectedDate);

  const fetchEntries = useCallback(async (dateStr: string) => {
    setFetching(true);
    try {
      const data = await getEntries(dateStr);
      setEntries(data.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    } catch {
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setFetching(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchEntries(dateString);
    getCategories().then(setCategories).catch(() => {});
  }, [dateString, fetchEntries, router]);

  function handleDayChange(day: Day) {
    setSelectedDay(day);
    setEntries([]);
  }

  function handleParsed(data: { start_time: string; end_time: string; title: string }) {
    setPendingData(data);
  }

  async function handleProjectSelected(
    data: { start_time: string; end_time: string; title: string },
    _categoryId: string | null,
    projectId: string | null,
    activityId: string | null
  ) {
    setPendingData(null);
    setLoading(true);
    try {
      const entry = await createEntry({ ...data, project_id: projectId, activity_id: activityId });
      setEntries((prev) =>
        [...prev, entry].sort((a, b) => a.start_time.localeCompare(b.start_time))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setLoading(false);
    }
  }

  function handleDismissSelector() {
    setPendingData(null);
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  }

  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      {/* Top Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 glass-panel z-50 shadow-[0_8px_30px_rgba(231,229,229,0.06)]">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black tracking-tighter text-p-on-surface">Pulsr</span>
          <DayTabs selected={selectedDay} onChange={handleDayChange} />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-p-surface-container-high rounded-full">
            <span className="material-symbols-outlined text-sm text-p-on-surface-variant">
              calendar_today
            </span>
            <span className="text-xs font-medium text-p-on-surface-variant">
              {formatDisplayDate(selectedDate)}
            </span>
          </div>
          <button className="material-symbols-outlined text-p-primary p-2 hover:bg-p-surface-bright rounded-full transition-all duration-200 active:scale-95">
            settings
          </button>
        </div>
      </header>

      {/* Left Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-8 px-4 bg-p-surface-container-low w-64 z-40 mt-16">
        <div className="flex flex-col gap-6 h-full">
          <div className="px-4 py-2">
            <h3 className="text-xl font-bold text-p-on-surface tracking-tight">Journal</h3>
            <p className="text-xs text-p-on-surface-variant mt-1">The Digital Curator</p>
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            {sideNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  link.active
                    ? "text-p-primary font-semibold bg-p-surface-container-high"
                    : "text-p-on-surface-variant hover:text-p-on-surface hover:bg-p-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="text-[0.875rem]">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-p-on-surface-variant hover:text-p-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">help_outline</span>
              <span className="text-[0.875rem]">Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-24 lg:ml-64 px-6 md:px-12 pb-24">
        <div className="max-w-4xl mx-auto mb-12 relative">
          <AppInputBar
            onParsed={handleParsed}
            loading={loading}
            date={dateString}
            lastEndTime={
              entries.length > 0
                ? new Date(entries[entries.length - 1].end_time)
                : undefined
            }
          />
          {pendingData && (
            <ProjectSelector
              entryData={pendingData}
              categories={categories}
              onSelect={handleProjectSelected}
              onDismiss={handleDismissSelector}
            />
          )}
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline */}
          <div className="lg:col-span-8">
            <AppTimeline
              entries={entries}
              fetching={fetching}
              onDelete={handleDelete}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4">
            <DailySummary entries={entries} />
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full flex justify-around items-center bg-p-surface-variant/90 backdrop-blur-xl h-20 px-4 border-t border-p-outline-variant/10 z-50">
        <button className="flex flex-col items-center gap-1 text-p-primary">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px] font-bold">Journal</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">folder_open</span>
          <span className="text-[10px]">Projects</span>
        </button>
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-p-primary text-p-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform cursor-pointer">
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px]">Insights</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </div>
  );
}
