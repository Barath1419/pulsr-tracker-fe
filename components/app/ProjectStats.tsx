import { Project } from "@/types";

interface Props {
  projects: Project[];
}

export default function ProjectStats({ projects }: Props) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "active").length;
  const completed = projects.filter((p) => p.status === "completed").length;

  const stats = [
    { label: "Total Projects", value: total, icon: "folder", sub: "+0 this month" },
    { label: "Active", value: active, icon: "pending", sub: "In current sprint" },
    { label: "Completed", value: completed, icon: "check_circle", sub: "Last 90 days" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-p-surface-container-low rounded-xl p-6 relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-p-on-surface-variant">
              {s.label}
            </span>
            <span className="material-symbols-outlined text-p-on-surface-variant opacity-20 group-hover:opacity-100 transition-opacity">
              {s.icon}
            </span>
          </div>
          <div className="text-4xl font-bold text-p-on-surface tabular-nums">
            {String(s.value).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[0.75rem] text-p-on-surface-variant">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
