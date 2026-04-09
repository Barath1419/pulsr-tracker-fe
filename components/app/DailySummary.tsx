import { Entry } from "@/types";

interface Props {
  entries: Entry[];
}

function getTotalMinutes(entries: Entry[]): number {
  return entries.reduce((sum, e) => {
    return sum + Math.round(
      (new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 60000
    );
  }, 0);
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function DailySummary({ entries }: Props) {
  const total = getTotalMinutes(entries);

  return (
    <section className="bg-p-surface-container-low rounded-xl p-8 sticky top-24">
      <h2 className="text-[0.6875rem] font-bold tracking-[0.15em] text-p-on-surface-variant uppercase mb-6">
        Daily Summary
      </h2>

      <div className="mb-8">
        <p className="text-sm text-p-on-surface-variant mb-1">Total Tracked</p>
        <h3 className="text-4xl font-bold tracking-tighter text-p-on-surface">
          {entries.length === 0 ? "—" : formatDuration(total)}
        </h3>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-p-on-surface-variant/50">
          No entries yet for this day.
        </p>
      ) : (
        <div className="space-y-6">
          {entries.map((entry, i) => {
            const entryMin = Math.round(
              (new Date(entry.end_time).getTime() - new Date(entry.start_time).getTime()) / 60000
            );
            const pct = total > 0 ? Math.round((entryMin / total) * 100) : 0;
            const barColors = [
              "bg-p-tertiary",
              "bg-p-secondary",
              "bg-p-on-secondary-container",
            ];
            return (
              <div key={entry.id}>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-semibold text-p-on-surface truncate max-w-[60%]">
                    {entry.title}
                  </span>
                  <span className="text-xs text-p-on-surface-variant">
                    {formatDuration(entryMin)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-p-surface-bright rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColors[i % barColors.length]} rounded-full`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
