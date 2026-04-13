"use client";

import { useEffect, useRef, useState } from "react";
import { Category, ProjectInCategory, ActivityItem } from "@/types";

type Step = "category" | "project" | "activity";

interface OptionItem {
  id: string;
  label: string;
  icon: string;
  hasChildren: boolean;
}

interface Props {
  entryData: { start_time: string; end_time: string; title: string };
  categories: Category[];
  onSelect: (
    data: { start_time: string; end_time: string; title: string },
    categoryId: string | null,
    projectId: string | null,
    activityId: string | null
  ) => void;
  onDismiss: () => void;
}

export default function ProjectSelector({ entryData, categories, onSelect, onDismiss }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [step, setStep] = useState<Step>("category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectInCategory | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  // Build current options list
  let options: OptionItem[] = [];
  if (step === "category") {
    options = categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      icon: "category",
      hasChildren: cat.projects.length > 0 || cat.activities.length > 0,
    }));
  } else if (step === "project" && selectedCategory) {
    options = selectedCategory.projects.map((proj) => ({
      id: proj.id,
      label: proj.name,
      icon: "folder_open",
      hasChildren: proj.activities.length > 0,
    }));
  } else if (step === "activity") {
    const acts: ActivityItem[] = selectedProject
      ? selectedProject.activities
      : selectedCategory?.activities ?? [];
    options = acts.map((act) => ({
      id: act.id,
      label: act.name,
      icon: "task_alt",
      hasChildren: false,
    }));
  }

  function handleSelect(index: number) {
    const opt = options[index];
    if (!opt) return;

    if (step === "category") {
      const cat = categories.find((c) => c.id === opt.id)!;
      setSelectedCategory(cat);
      setFocusedIndex(0);
      if (cat.projects.length > 0) {
        setStep("project");
      } else if (cat.activities.length > 0) {
        setStep("activity");
      } else {
        onSelect(entryData, cat.id, null, null);
      }
    } else if (step === "project") {
      const proj = selectedCategory!.projects.find((p) => p.id === opt.id)!;
      setSelectedProject(proj);
      setFocusedIndex(0);
      if (proj.activities.length > 0) {
        setStep("activity");
      } else {
        onSelect(entryData, selectedCategory!.id, proj.id, null);
      }
    } else if (step === "activity") {
      onSelect(entryData, selectedCategory?.id ?? null, selectedProject?.id ?? null, opt.id);
    }
  }

  function handleBack() {
    setFocusedIndex(0);
    if (step === "activity") {
      if (selectedProject) {
        setSelectedProject(null);
        setStep("project");
      } else {
        setSelectedCategory(null);
        setStep("category");
      }
    } else if (step === "project") {
      setSelectedCategory(null);
      setStep("category");
    }
  }

  // Click outside to dismiss
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onDismiss]);

  // Keyboard navigation
  useEffect(() => {
    const total = options.length;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onDismiss(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex((p) => (p + 1) % total); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex((p) => (p - 1 + total) % total); return; }
      if (e.key === "Enter") { e.preventDefault(); handleSelect(focusedIndex); return; }
      if (e.key === "Backspace" && step !== "category") { handleBack(); }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, options.length, step, onDismiss]);

  // Scroll focused item into view
  useEffect(() => {
    itemRefs.current[focusedIndex]?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  // Breadcrumb label
  const stepLabel =
    step === "category" ? "Choose Category" :
    step === "project" ? "Choose Project" :
    "Choose Activity";

  const breadcrumb: string[] = [];
  if (selectedCategory) breadcrumb.push(selectedCategory.name);
  if (selectedProject) breadcrumb.push(selectedProject.name);

  const SelectorContent = () => (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {step !== "category" && (
              <button
                onClick={handleBack}
                className="text-p-on-surface-variant/60 hover:text-p-on-surface transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              </button>
            )}
            <div className="min-w-0">
              {breadcrumb.length > 0 && (
                <div className="flex items-center gap-1 mb-0.5">
                  {breadcrumb.map((b, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="text-[0.6rem] text-p-on-surface-variant/40 truncate">{b}</span>
                      <span className="text-[0.6rem] text-p-on-surface-variant/30">›</span>
                    </span>
                  ))}
                </div>
              )}
              <span className="text-[0.6875rem] font-bold uppercase tracking-[0.05em] text-p-on-surface-variant">
                {stepLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-p-on-surface-variant/40 hover:text-p-on-surface-variant transition-colors cursor-pointer shrink-0 ml-2"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <p className="text-xs text-p-on-surface/50 truncate mt-1">
          &ldquo;{entryData.title}&rdquo;
        </p>
      </div>

      {/* Separator */}
      <div className="h-[1px] bg-p-surface-bright mx-4" />

      {/* Options list */}
      <div className="px-2 py-2 max-h-56 overflow-y-auto">
        {options.length === 0 ? (
          <p className="text-xs text-p-on-surface-variant/40 text-center py-3">Nothing here yet</p>
        ) : (
          options.map((opt, i) => {
            const focused = focusedIndex === i;
            return (
              <button
                key={opt.id}
                ref={(el) => { itemRefs.current[i] = el; }}
                onClick={() => handleSelect(i)}
                onMouseEnter={() => setFocusedIndex(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-100 cursor-pointer ${
                  focused ? "bg-p-surface-bright" : "hover:bg-p-surface-bright"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-p-on-surface-variant/60 shrink-0">
                  {opt.icon}
                </span>
                <span className="text-sm text-p-on-surface truncate flex-1">{opt.label}</span>
                {opt.hasChildren && (
                  <span className="material-symbols-outlined text-[14px] text-p-on-surface-variant/30 shrink-0">
                    chevron_right
                  </span>
                )}
                {focused && !opt.hasChildren && (
                  <span className="material-symbols-outlined text-[14px] text-p-on-surface-variant/40 shrink-0">
                    keyboard_return
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Keyboard hint */}
      <div className="h-[1px] bg-p-surface-bright mx-4" />
      <div className="px-4 py-2.5">
        <span className="text-[0.6rem] text-p-on-surface-variant/30 uppercase tracking-wider">
          ↑↓ navigate · ↵ select · esc dismiss{step !== "category" ? " · ⌫ back" : ""}
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: floating panel */}
      <div
        ref={ref}
        className="hidden md:block absolute top-full left-0 mt-2 z-40 w-72 glass-panel rounded-xl shadow-[0_8px_32px_rgba(231,229,229,0.06)] animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <SelectorContent />
      </div>

      {/* Mobile: bottom sheet */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onDismiss} />
        <div className="relative glass-panel rounded-t-2xl shadow-[0_-8px_32px_rgba(231,229,229,0.06)] animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-p-outline-variant/30" />
          </div>
          <SelectorContent />
          <div className="h-6" />
        </div>
      </div>
    </>
  );
}
