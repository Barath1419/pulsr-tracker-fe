import { Project, ProjectStatus } from "@/types";

interface Props {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; badge: string; bar: string; accent: string }
> = {
  active: {
    label: "Active",
    badge: "bg-p-secondary-container text-p-secondary-fixed-dim",
    bar: "bg-p-tertiary-dim",
    accent: "bg-p-tertiary-dim",
  },
  upcoming: {
    label: "Upcoming",
    badge: "bg-p-surface-container-high text-p-on-surface-variant",
    bar: "bg-p-outline-variant",
    accent: "bg-p-tertiary opacity-40",
  },
  completed: {
    label: "Completed",
    badge: "bg-p-secondary-container/50 text-p-secondary-dim",
    bar: "bg-p-secondary",
    accent: "bg-p-secondary",
  },
};

function formatDate(d: string | null): string {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const cfg = statusConfig[project.status];

  return (
    <div className="bg-p-surface-container-low rounded-xl p-1 relative group hover:bg-p-surface-container transition-all duration-300">
      {/* Accent bar */}
      <div className={`absolute left-0 top-6 bottom-6 w-1 ${cfg.accent} rounded-full`} />

      <div className="pl-8 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span
              className={`inline-block px-2 py-0.5 rounded text-[0.6rem] font-bold uppercase tracking-wider mb-2 ${cfg.badge}`}
            >
              {cfg.label}
            </span>
            <h3 className="text-xl font-bold text-p-on-surface">{project.name}</h3>
            {project.notes && (
              <p className="text-xs text-p-on-surface-variant mt-1 line-clamp-1">{project.notes}</p>
            )}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(project)}
              className="p-2 rounded-lg bg-p-surface-bright text-p-on-surface-variant hover:text-p-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-2 rounded-lg bg-p-surface-bright text-p-on-surface-variant hover:text-p-error transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[0.75rem] text-p-on-surface-variant">
            <span>Start: {formatDate(project.start_date)}</span>
            <span>End: {formatDate(project.end_date)}</span>
          </div>

          <div className="relative h-2 bg-p-surface-container-high rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full ${cfg.bar} rounded-full transition-all duration-500`}
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={`text-[0.6875rem] font-bold uppercase tracking-widest text-p-tertiary-dim`}>
              {project.progress.toFixed(0)}% Progress
            </span>
            {project.status === "completed" && (
              <div className="flex items-center gap-1 text-p-secondary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="text-[0.6875rem] font-bold uppercase tracking-widest">Finalized</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
