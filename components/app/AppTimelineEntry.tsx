import { Entry } from "@/types";

interface Props {
  entry: Entry;
  colorIndex: number;
  onDelete: (id: string) => void;
}

const colors = [
  { border: "border-p-secondary", text: "text-p-secondary" },
  { border: "border-p-tertiary", text: "text-p-tertiary" },
  { border: "border-p-on-secondary-container", text: "text-p-on-secondary-container" },
];

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getDuration(start: string, end: string): string {
  const diff = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000
  );
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function AppTimelineEntry({ entry, colorIndex, onDelete }: Props) {
  const color = colors[colorIndex % colors.length];
  const startLabel = formatTime(entry.start_time);
  const endLabel = formatTime(entry.end_time);
  const duration = getDuration(entry.start_time, entry.end_time);

  return (
    <div className="relative min-h-[5rem] flex items-start">
      <span className="w-16 shrink-0 text-right pr-6 text-xs font-bold text-p-on-surface-variant pt-1">
        {startLabel}
      </span>
      <div className="flex-1 ml-4 mb-4 group">
        <div
          className={`flex bg-p-surface-container-low rounded-xl overflow-hidden border-l-4 ${color.border} shadow-sm hover:bg-p-surface-container-high transition-colors`}
        >
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between mb-1">
              <h4 className={`font-bold ${color.text}`}>{entry.title}</h4>
              <button
                onClick={() => onDelete(entry.id)}
                className="text-p-on-surface-variant/30 hover:text-p-error text-xs ml-4 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-p-on-surface-variant">
              {startLabel} – {endLabel} · {duration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
