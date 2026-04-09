"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import InputBar, { parseEntry } from "@/components/common/InputBar";
import TimelineEntry from "@/components/common/TimelineEntry";
import { getEntries, createEntry, deleteEntry } from "@/lib/api";
import { Entry } from "@/types";

export default function AppPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchEntries();
  }, [router]);

  async function fetchEntries() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const data = await getEntries(today);
      setEntries(data.sort((a, b) => a.start_time.localeCompare(b.start_time)));
    } catch {
      // token expired
      localStorage.removeItem("token");
      router.push("/login");
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(raw: string) {
    const parsed = parseEntry(raw);
    if (!parsed) return;
    setLoading(true);
    try {
      const entry = await createEntry(parsed);
      setEntries((prev) =>
        [...prev, entry].sort((a, b) => a.start_time.localeCompare(b.start_time))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create entry");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteEntry(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-8">
        {/* Date header */}
        <div>
          <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">Today</p>
          <h2 className="text-2xl font-semibold text-neutral-900 tracking-tight mt-0.5">{today}</h2>
        </div>

        {/* Input */}
        <InputBar onSubmit={handleSubmit} loading={loading} />

        {/* Timeline */}
        <div className="flex flex-col gap-2">
          {fetching ? (
            <p className="text-sm text-neutral-400 text-center py-8">Loading...</p>
          ) : entries.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-neutral-400 text-sm">No entries yet.</p>
              <p className="text-neutral-300 text-xs mt-1">Type above to log your first activity.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <TimelineEntry key={entry.id} entry={entry} onDelete={handleDelete} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
