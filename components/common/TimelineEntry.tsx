import { Entry } from "@/types";

interface Props {
  entry: Entry;
  onDelete: (id: string) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function TimelineEntry({ entry, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-neutral-400 whitespace-nowrap">
          {formatTime(entry.start_time)} – {formatTime(entry.end_time)}
        </span>
        <span className="text-sm font-medium text-neutral-800">{entry.title}</span>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        className="text-neutral-300 hover:text-red-400 transition-colors text-xs ml-4"
        aria-label="Delete entry"
      >
        ✕
      </button>
    </div>
  );
}
