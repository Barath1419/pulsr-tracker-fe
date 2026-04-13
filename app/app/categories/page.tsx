"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  createProject, updateProject, deleteProject,
  createActivity, updateActivity, deleteActivity,
} from "@/lib/api";
import { Category, ProjectInCategory, ActivityItem } from "@/types";

const sideNavLinks = [
  { icon: "history_edu", label: "Journal", href: "/app" },
  { icon: "analytics", label: "Insights", href: "/app/insights" },
  { icon: "category", label: "Categories", href: "/app/categories", active: true },
  { icon: "tune", label: "Settings", href: "#" },
];

// ─── Inline editable text ───────────────────────────────────────────────────
function InlineInput({
  value, onSave, onCancel, placeholder = "Name...",
}: {
  value: string; onSave: (v: string) => void; onCancel: () => void; placeholder?: string;
}) {
  const [val, setVal] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <input
      ref={ref}
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && val.trim()) onSave(val.trim());
        if (e.key === "Escape") onCancel();
      }}
      onBlur={() => { if (val.trim()) onSave(val.trim()); else onCancel(); }}
      placeholder={placeholder}
      className="bg-p-surface-container-lowest ghost-border rounded-lg px-3 py-1.5 text-sm text-p-on-surface outline-none w-full max-w-xs"
    />
  );
}

// ─── Add item row ────────────────────────────────────────────────────────────
function AddItemInput({
  placeholder, onAdd,
}: {
  placeholder: string; onAdd: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-p-on-surface-variant/50 hover:text-p-on-surface hover:bg-p-surface-bright transition-colors text-xs font-medium cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">add</span>
        {placeholder}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={ref}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val.trim()) { onAdd(val.trim()); setVal(""); setOpen(false); }
          if (e.key === "Escape") { setVal(""); setOpen(false); }
        }}
        onBlur={() => { setVal(""); setOpen(false); }}
        placeholder={placeholder}
        className="bg-p-surface-container-lowest ghost-border rounded-lg px-3 py-1.5 text-sm text-p-on-surface outline-none w-48"
      />
      <span className="text-[0.6rem] text-p-on-surface-variant/30">↵ to add · esc cancel</span>
    </div>
  );
}

// ─── Activity leaf ────────────────────────────────────────────────────────────
function ActivityRow({
  activity, onUpdate, onDelete,
}: {
  activity: ActivityItem;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const typeIcons: Record<string, string> = { task: "check_circle", meeting: "groups", personal: "self_improvement" };

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-p-surface-bright/50 transition-colors group">
      <span className="material-symbols-outlined text-[14px] text-p-on-surface-variant/40 shrink-0">
        {typeIcons[activity.type] ?? "radio_button_unchecked"}
      </span>
      {editing ? (
        <InlineInput
          value={activity.name}
          onSave={(v) => { onUpdate(activity.id, v); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <span className="text-sm text-p-on-surface-variant flex-1">{activity.name}</span>
      )}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setEditing(true)}
          className="p-1 rounded text-p-on-surface-variant/40 hover:text-p-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">edit</span>
        </button>
        <button
          onClick={() => { if (confirm("Delete this activity?")) onDelete(activity.id); }}
          className="p-1 rounded text-p-on-surface-variant/40 hover:text-p-error transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">delete</span>
        </button>
      </div>
    </div>
  );
}

// ─── Project item ─────────────────────────────────────────────────────────────
function ProjectItem({
  project, categoryId,
  onUpdate, onDelete, onAddActivity, onUpdateActivity, onDeleteActivity,
}: {
  project: ProjectInCategory;
  categoryId: string;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddActivity: (catId: string, projId: string, name: string) => void;
  onUpdateActivity: (id: string, name: string) => void;
  onDeleteActivity: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-p-surface-container transition-colors group">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-p-on-surface-variant/40 hover:text-p-on-surface-variant transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">
            {expanded ? "expand_more" : "chevron_right"}
          </span>
        </button>
        <span className="material-symbols-outlined text-[16px] text-p-on-secondary-container shrink-0">
          folder_open
        </span>
        {editing ? (
          <InlineInput
            value={project.name}
            onSave={(v) => { onUpdate(project.id, v); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <span
            className="text-sm font-medium text-p-on-surface flex-1 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {project.name}
          </span>
        )}
        <span className="text-[0.6rem] text-p-on-surface-variant/30 font-medium shrink-0">
          {project.activities.length} activities
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1 rounded text-p-on-surface-variant/40 hover:text-p-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
          </button>
          <button
            onClick={() => { if (confirm("Delete this project?")) onDelete(project.id); }}
            className="p-1 rounded text-p-on-surface-variant/40 hover:text-p-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="ml-8 mt-1 mb-2 space-y-0.5">
          {project.activities.map((a) => (
            <ActivityRow
              key={a.id}
              activity={a}
              onUpdate={onUpdateActivity}
              onDelete={onDeleteActivity}
            />
          ))}
          <div className="pt-1">
            <AddItemInput
              placeholder="Add activity"
              onAdd={(name) => onAddActivity(categoryId, project.id, name)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────
function CategoryCard({
  category,
  onUpdate, onDelete,
  onAddProject, onUpdateProject, onDeleteProject,
  onAddActivity, onUpdateActivity, onDeleteActivity,
}: {
  category: Category;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddProject: (catId: string, name: string) => void;
  onUpdateProject: (id: string, name: string) => void;
  onDeleteProject: (id: string) => void;
  onAddActivity: (catId: string, projId: string | null, name: string) => void;
  onUpdateActivity: (id: string, name: string) => void;
  onDeleteActivity: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);

  const totalItems = category.projects.length + category.activities.length;

  return (
    <div className="bg-p-surface-container-low rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 hover:bg-p-surface-container transition-colors group">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-p-on-surface-variant hover:text-p-on-surface transition-colors cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">
            {expanded ? "expand_more" : "chevron_right"}
          </span>
        </button>

        <div
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={() => { if (!editing) setExpanded(!expanded); }}
        >
          <div className="w-8 h-8 rounded-lg bg-p-surface-container-high flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[16px] text-p-secondary">category</span>
          </div>
          {editing ? (
            <InlineInput
              value={category.name}
              onSave={(v) => { onUpdate(category.id, v); setEditing(false); }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <span className="text-base font-bold text-p-on-surface tracking-tight">{category.name}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-p-on-surface-variant/40">
            {totalItems} items
          </span>
          <span
            className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              category.type === "system"
                ? "bg-p-surface-container-high text-p-on-surface-variant"
                : "bg-p-secondary-container text-p-on-secondary-container"
            }`}
          >
            {category.type}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="p-1.5 rounded-lg text-p-on-surface-variant/40 hover:text-p-on-surface hover:bg-p-surface-bright transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (confirm(`Delete "${category.name}"?`)) onDelete(category.id); }}
              className="p-1.5 rounded-lg text-p-on-surface-variant/40 hover:text-p-error hover:bg-p-surface-bright transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-1">
          {/* Projects */}
          {category.projects.map((p) => (
            <ProjectItem
              key={p.id}
              project={p}
              categoryId={category.id}
              onUpdate={onUpdateProject}
              onDelete={onDeleteProject}
              onAddActivity={onAddActivity}
              onUpdateActivity={onUpdateActivity}
              onDeleteActivity={onDeleteActivity}
            />
          ))}

          {/* Direct activities (no project) */}
          {category.activities.length > 0 && (
            <div className="ml-4 mt-2">
              <div className="text-[0.6rem] font-bold uppercase tracking-widest text-p-on-surface-variant/30 px-3 pb-1">
                Direct Activities
              </div>
              {category.activities.map((a) => (
                <ActivityRow
                  key={a.id}
                  activity={a}
                  onUpdate={onUpdateActivity}
                  onDelete={onDeleteActivity}
                />
              ))}
            </div>
          )}

          {/* Add buttons */}
          <div className="ml-4 pt-2 flex flex-wrap gap-4">
            <AddItemInput
              placeholder="Add project"
              onAdd={(name) => onAddProject(category.id, name)}
            />
            <AddItemInput
              placeholder="Add direct activity"
              onAdd={(name) => onAddActivity(category.id, null, name)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    getCategories()
      .then(setCategories)
      .catch((err) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.toLowerCase().includes("unauthorized") || msg.toLowerCase().includes("not authenticated")) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      })
      .finally(() => setFetching(false));
  }, [router]);

  function refresh() {
    getCategories().then(setCategories).catch(() => {});
  }

  // Category CRUD
  async function handleAddCategory(name: string) {
    await createCategory({ name });
    refresh();
  }

  async function handleUpdateCategory(id: string, name: string) {
    const updated = await updateCategory(id, { name });
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: updated.name } : c)));
  }

  async function handleDeleteCategory(id: string) {
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  // Project CRUD
  async function handleAddProject(catId: string, name: string) {
    await createProject({ name, start_date: new Date().toISOString().split("T")[0], category_id: catId });
    refresh();
  }

  async function handleUpdateProject(id: string, name: string) {
    await updateProject(id, { name });
    refresh();
  }

  async function handleDeleteProject(id: string) {
    await deleteProject(id);
    refresh();
  }

  // Activity CRUD
  async function handleAddActivity(catId: string, projId: string | null, name: string) {
    await createActivity({ name, category_id: catId, project_id: projId });
    refresh();
  }

  async function handleUpdateActivity(id: string, name: string) {
    await updateActivity(id, { name });
    refresh();
  }

  async function handleDeleteActivity(id: string) {
    await deleteActivity(id);
    refresh();
  }

  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-16 glass-panel z-50 shadow-[0_8px_30px_rgba(231,229,229,0.06)]">
        <span className="text-2xl font-black tracking-tighter text-p-on-surface">Pulsr</span>
        <button className="material-symbols-outlined text-p-primary p-2 hover:bg-p-surface-bright rounded-full transition-all duration-200 active:scale-95">
          account_circle
        </button>
      </header>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full py-8 px-4 bg-p-surface-container-low w-64 z-40 mt-16">
        <div className="flex flex-col gap-6 h-full">
          <div className="px-4 py-2">
            <h3 className="text-xl font-bold text-p-on-surface tracking-tight">Journal</h3>
            <p className="text-xs text-p-on-surface-variant mt-1">The Digital Curator</p>
          </div>
          <nav className="flex flex-col gap-1 mt-4">
            {sideNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  link.active
                    ? "text-p-on-surface font-semibold bg-p-surface-container-high"
                    : "text-p-on-surface-variant hover:text-p-on-surface hover:bg-p-surface-container-high/50"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{link.icon}</span>
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
      <main className="lg:pl-64 pt-16 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">

          {/* Page header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <nav className="flex items-center gap-2 mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.05em] text-p-on-surface-variant">
                <span>Home</span>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-p-on-surface">Categories</span>
              </nav>
              <h1 className="text-3xl font-bold tracking-tight text-p-on-surface mb-1">Categories</h1>
              <p className="text-p-on-surface-variant text-sm">
                Organize your work into categories, projects, and activities
              </p>
            </div>
          </div>

          {/* Content */}
          {fetching ? (
            <div className="flex items-center justify-center py-32">
              <p className="text-sm text-p-on-surface-variant animate-pulse">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onUpdate={handleUpdateCategory}
                  onDelete={handleDeleteCategory}
                  onAddProject={handleAddProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                  onAddActivity={handleAddActivity}
                  onUpdateActivity={handleUpdateActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              ))}

              {/* Add category */}
              <div className="bg-p-surface-container-low rounded-xl px-6 py-4">
                <AddItemInput
                  placeholder="Add new category"
                  onAdd={handleAddCategory}
                />
              </div>

              {categories.length === 0 && !fetching && (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-xl bg-p-surface-container-high flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-p-on-surface-variant">category</span>
                  </div>
                  <p className="text-sm text-p-on-surface-variant">No categories yet.</p>
                  <p className="text-xs text-p-on-surface-variant/50 mt-1">Use the field above to add your first one.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const name = prompt("New category name:");
            if (name?.trim()) handleAddCategory(name.trim());
          }}
          className="w-14 h-14 bg-p-primary text-p-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
        >
          <span className="material-symbols-outlined text-[28px]">add</span>
        </button>
      </div>
    </div>
  );
}
