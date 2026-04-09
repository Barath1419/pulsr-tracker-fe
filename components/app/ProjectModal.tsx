"use client";

import { useEffect, useState } from "react";
import { Project } from "@/types";
import DatePicker from "@/components/ui/DatePicker";

interface Props {
  open: boolean;
  project?: Project | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
  }) => Promise<void>;
}

function toDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function toISODate(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().split("T")[0];
}

export default function ProjectModal({ open, project, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (project) {
      setName(project.name);
      setStartDate(toDate(project.start_date));
      setEndDate(toDate(project.end_date ?? ""));
      setNotes(project.notes ?? "");
    } else {
      setName(""); setStartDate(null); setEndDate(null); setNotes("");
    }
    setError("");
  }, [project, open]);

  if (!open) return null;

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!name.trim() || !startDate) { setError("Name and start date are required"); return; }
    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        start_date: toISODate(startDate),
        end_date: toISODate(endDate) || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  }

  const labelClass = "block text-[0.6875rem] uppercase tracking-[0.05em] font-medium text-p-on-surface-variant mb-1.5";
  const inputClass = "w-full bg-p-surface-container-lowest border border-p-outline-variant/20 focus:border-p-outline-variant/50 rounded-xl px-4 py-3 text-sm text-p-on-surface outline-none transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-p-surface-container-high rounded-2xl p-8 shadow-2xl border border-p-outline-variant/10">
        <div className="mb-8">
          <h2 className="text-xl font-bold tracking-tight text-p-on-surface">
            {project ? "Edit Project" : "New Project"}
          </h2>
          <p className="text-sm text-p-on-surface-variant mt-1">
            {project ? "Update project details." : "Start a new project to track."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Project Name</label>
            <input
              className={inputClass}
              placeholder="e.g. Project Apollo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Pick start date"
              />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="Pick end date"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Optional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && <p className="text-p-error text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-p-surface-bright text-p-on-surface-variant hover:text-p-on-surface text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-p-primary text-p-on-primary text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : project ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
