import { Entry } from "@/types";
import AppTimelineEntry from "./AppTimelineEntry";
import UntrackedGap from "./UntrackedGap";

interface Props {
  entries: Entry[];
  fetching: boolean;
  onDelete: (id: string) => void;
}

function getMinutes(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

type TimelineItem =
  | { type: "entry"; entry: Entry; index: number }
  | { type: "gap"; minutes: number };

function buildTimeline(entries: Entry[]): TimelineItem[] {
  const items: TimelineItem[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (i > 0) {
      const prevEndMin = getMinutes(entries[i - 1].end_time);
      const currStartMin = getMinutes(entries[i].start_time);
      const gapMin = currStartMin - prevEndMin;
      if (gapMin >= 5) {
        items.push({ type: "gap", minutes: gapMin });
      }
    }
    items.push({ type: "entry", entry: entries[i], index: i });
  }
  return items;
}

export default function AppTimeline({ entries, fetching, onDelete }: Props) {
  if (fetching) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-p-on-surface-variant animate-pulse">Loading...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-p-on-surface-variant text-sm">No entries yet. Start logging your day.</p>
        <p className="text-p-on-surface-variant/50 text-xs mt-1">
          Type above — e.g. "9-10 meeting"
        </p>
      </div>
    );
  }

  const items = buildTimeline(entries);

  const totalTrackedMin = entries.reduce((sum, e) => {
    return sum + Math.round((new Date(e.end_time).getTime() - new Date(e.start_time).getTime()) / 60000);
  }, 0);

  return (
    <div className="relative flex flex-col gap-0">
      {/* Vertical timeline line */}
      <div className="absolute left-16 top-0 bottom-0 w-[1px] bg-p-outline-variant/20" />

      {items.map((item, i) =>
        item.type === "entry" ? (
          <AppTimelineEntry
            key={item.entry.id}
            entry={item.entry}
            colorIndex={item.index}
            onDelete={onDelete}
          />
        ) : (
          <UntrackedGap key={`gap-${i}`} minutes={item.minutes} />
        )
      )}

      {/* Total tracked footer */}
      <div className="relative flex items-center mt-6 ml-20">
        <span className="text-[0.6875rem] uppercase tracking-widest text-p-on-surface-variant/50">
          Total tracked · {formatDuration(totalTrackedMin)}
        </span>
      </div>
    </div>
  );
}
