import { Entry } from "@/types";

interface Props {
  entry: Entry;
  colorIndex: number;
  onDelete: (id: string) => void;
  projectName: string | null;
  activityName: string | null;
}

const colors = [
  { border: "border-p-secondary", text: "text-p-secondary" },
  { border: "border-p-tertiary", text: "text-p-tertiary" },
  { border: "border-p-on-secondary-container", text: "text-p-on-secondary-container" },
];

function formatTime(iso: string): string {
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return "";
  const h = parseInt(m[1]);
  const min = m[2];
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${min} ${period}`;
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

export default function AppTimelineEntry({ entry, colorIndex, onDelete, projectName, activityName }: Props) {
  const color = colors[colorIndex % colors.length];
  const startLabel = formatTime(entry.start_time);
  const endLabel = formatTime(entry.end_time);
  const duration = getDuration(entry.start_time, entry.end_time);

  // Split title on " : " for sub-detail
  const colonIdx = entry.title.indexOf(" : ");
  const mainTitle = colonIdx !== -1 ? entry.title.slice(0, colonIdx) : entry.title;
  const subDetail = colonIdx !== -1 ? entry.title.slice(colonIdx + 3) : null;

  return (
    <div className="relative min-h-[5rem] flex items-start">
      <span className="w-16 shrink-0 text-right pr-6 text-[0.6875rem] font-bold text-p-on-surface-variant pt-1 leading-tight">
        {startLabel.replace(" ", "\n")}
      </span>
      <div className="flex-1 ml-4 mb-4 group">
        <div
          className={`flex bg-p-surface-container-low rounded-xl overflow-hidden border-l-4 ${color.border} shadow-sm hover:bg-p-surface-container-high transition-colors`}
        >
          <div className="p-4 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-0.5 flex-1">
                {/* Line 1: Project name (bold) OR full title if no project */}
                <h4 className={`font-bold leading-snug ${color.text}`}>
                  {projectName ?? mainTitle}
                </h4>

                {/* Line 2: "Activity : mainTitle" (if project selected) */}
                {projectName && (
                  <p className="text-sm text-p-on-surface-variant/80 leading-snug">
                    {activityName
                      ? `${activityName} : ${mainTitle}`
                      : mainTitle}
                  </p>
                )}

                {/* Line 3: sub-detail from colon */}
                {subDetail && (
                  <p className="text-xs text-p-on-surface-variant/55 leading-snug">
                    {subDetail}
                  </p>
                )}
              </div>

              <button
                onClick={() => onDelete(entry.id)}
                className="text-p-on-surface-variant/30 hover:text-p-error text-xs ml-4 transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                title="Delete"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-p-on-surface-variant mt-2">
              {startLabel} – {endLabel} · {duration}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
