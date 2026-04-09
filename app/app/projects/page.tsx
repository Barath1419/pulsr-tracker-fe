"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { getProjects, createProject, updateProject, deleteProject } from "@/lib/api";
import ProjectCard from "@/components/app/ProjectCard";
import ProjectStats from "@/components/app/ProjectStats";
import ProjectModal from "@/components/app/ProjectModal";

const sideNavLinks = [
  { icon: "history_edu", label: "Journal", href: "/app" },
  { icon: "folder_open", label: "Projects", href: "/app/projects", active: true },
  { icon: "analytics", label: "Insights", href: "#" },
  { icon: "tune", label: "Settings", href: "#" },
];

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState(""); // shown in grid area
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchProjects();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("not authenticated")) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        setFetchError("Failed to load projects. Is the backend running?");
      }
    } finally {
      setFetching(false);
    }
  }

  async function handleSave(data: {
    name: string;
    start_date: string;
    end_date: string | null;
    notes: string | null;
  }) {
    if (editingProject) {
      const updated = await updateProject(editingProject.id, data);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProject(data);
      setProjects((prev) => [created, ...prev]);
    }
    setEditingProject(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function openCreate() { setEditingProject(null); setModalOpen(true); }
  function openEdit(p: Project) { setEditingProject(p); setModalOpen(true); }

  return (
    <div className="min-h-screen bg-p-background text-p-on-surface overflow-hidden">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-50 bg-p-surface-variant/80 backdrop-blur-xl shadow-[0_24px_24px_rgba(231,229,229,0.06)] h-16 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-p-on-surface tracking-tighter">Pulsr</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-p-primary p-2 hover:bg-p-surface-bright rounded-full transition-all duration-200 active:scale-95">
            settings
          </button>
        </div>
      </header>

      {/* Left Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-8 px-4 bg-p-surface-container-low w-64 z-40 mt-16">
        <div className="flex flex-col gap-6 h-full">
          <div className="px-4 py-2">
            <h3 className="text-xl font-bold text-p-on-surface tracking-tight">Journal</h3>
            <p className="text-xs text-p-on-surface-variant mt-1">The Digital Curator</p>
          </div>

          <button
            onClick={openCreate}
            className="mx-2 bg-p-primary text-p-on-primary font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Project</span>
          </button>

          <nav className="flex flex-col gap-1 mt-4">
            {sideNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 transition-colors rounded-lg ${
                  link.active
                    ? "text-p-on-surface font-bold bg-p-surface-container-high"
                    : "text-p-on-surface-variant hover:text-p-on-surface hover:bg-p-surface-container-high/50"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={link.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span className="text-[0.875rem]">{link.label}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-p-on-surface-variant hover:text-p-on-surface transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
              <span className="text-[0.875rem]">Support</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64 pt-16 h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <nav className="flex items-center gap-2 mb-4 text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-p-on-surface-variant">
                <span>Home</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-p-primary-dim">Projects</span>
              </nav>
              <h2 className="text-4xl font-extrabold tracking-tighter text-p-on-surface mb-2">
                Projects
              </h2>
              <p className="text-p-on-surface-variant">
                Organize and track your work sessions across all active domains.
              </p>
            </div>
            <button
              onClick={openCreate}
              className="bg-p-primary text-p-on-primary font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(198,198,198,0.2)] transition-all active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined">add</span>
              <span>New Project</span>
            </button>
          </div>

          {/* Stats */}
          <ProjectStats projects={projects} />

          {/* Grid */}
          {fetching ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-p-on-surface-variant animate-pulse">Loading...</p>
            </div>
          ) : fetchError ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-p-error">{fetchError}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}

              {/* Add placeholder */}
              <button
                onClick={openCreate}
                className="border-2 border-dashed border-p-outline-variant/20 rounded-xl flex flex-col items-center justify-center p-8 text-p-on-surface-variant hover:border-p-outline-variant/40 hover:bg-p-surface-container-low transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-p-surface-container-high flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <span className="text-sm font-semibold">
                  {projects.length === 0 ? "Start your first project" : "Initialize New Project"}
                </span>
                <span className="text-[0.7rem] text-p-outline mt-1">Ready for curation</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={openCreate}
          className="w-14 h-14 bg-p-primary text-p-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>

      {/* Modal */}
      <ProjectModal
        open={modalOpen}
        project={editingProject}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
