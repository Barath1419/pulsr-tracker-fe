"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProfile, updateProfile, deleteAccount,
  createGoal, updateGoal, deleteGoal,
} from "@/lib/api";
import { getCached } from "@/lib/cache";
import { ProfileSkeleton } from "@/components/app/Skeleton";
import { UserProfile, Goal } from "@/types";

function fmtTime(minutes: number): string {
  if (minutes <= 0) return "0m";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase();
}


const PERIOD_COLORS: Record<string, string> = {
  daily: "bg-p-secondary-dim",
  weekly: "bg-p-tertiary-dim",
  monthly: "bg-p-primary-dim",
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalPeriod, setGoalPeriod] = useState("weekly");
  const [savingGoal, setSavingGoal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [editCurrentMin, setEditCurrentMin] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    // Show stale cached data immediately — no Loading screen
    const cached = getCached<UserProfile>("profile");
    if (cached) {
      setProfile(cached);
      setNameInput(cached.name ?? "");
      setLoading(false);
    }

    getProfile()
      .then((p) => { setProfile(p); setNameInput(p.name ?? ""); })
      .catch(() => { if (!cached) router.push("/login"); })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (editName) nameRef.current?.focus();
  }, [editName]);

  async function saveName() {
    if (!profile) return;
    setSavingName(true);
    try {
      const updated = await updateProfile({ name: nameInput.trim() || undefined });
      setProfile(updated);
      setEditName(false);
    } finally {
      setSavingName(false);
    }
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !goalName || !goalTarget) return;
    setSavingGoal(true);
    try {
      const goal = await createGoal({
        name: goalName.trim(),
        target_minutes: Math.round(parseFloat(goalTarget) * 60),
        period: goalPeriod,
      });
      setProfile({ ...profile, goals: [...profile.goals, goal] });
      setShowGoalForm(false);
      setGoalName("");
      setGoalTarget("");
    } finally {
      setSavingGoal(false);
    }
  }

  async function handleDeleteGoal(id: string) {
    if (!profile) return;
    await deleteGoal(id);
    setProfile({ ...profile, goals: profile.goals.filter((g) => g.id !== id) });
  }

  async function saveGoalProgress() {
    if (!profile || !editGoal) return;
    const mins = Math.round(parseFloat(editCurrentMin) * 60);
    const updated = await updateGoal(editGoal.id, { current_minutes: isNaN(mins) ? 0 : mins });
    setProfile({
      ...profile,
      goals: profile.goals.map((g) => g.id === updated.id ? updated : g),
    });
    setEditGoal(null);
  }

  async function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  async function handleDeleteAccount() {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    await deleteAccount();
    localStorage.removeItem("token");
    router.push("/login");
  }

  if (loading) return <ProfileSkeleton />;
  if (!profile) return null;

  const displayName = profile.name || profile.email.split("@")[0];
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-p-surface text-p-on-surface">
      {/* Main */}
      <main className="pt-24 lg:ml-64 px-6 md:px-12 pb-32 max-w-5xl mx-auto space-y-16">

        {/* Identity */}
        <section className="flex items-end gap-8">
          <Link href="/app/profile/avatar" className="relative group flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-p-surface-container-high flex items-center justify-center text-4xl font-extrabold text-p-on-surface ring-4 ring-p-surface-container-low overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
            </div>
          </Link>
          <div className="space-y-2">
            {editName ? (
              <div className="flex items-center gap-3">
                <input
                  ref={nameRef}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditName(false); }}
                  className="text-4xl font-extrabold bg-transparent border-b border-p-outline-variant outline-none text-p-on-surface w-64"
                  placeholder="Your name"
                />
                <button onClick={saveName} disabled={savingName} className="text-xs uppercase tracking-widest px-3 py-1 bg-p-surface-container-high rounded-full text-p-on-surface-variant hover:text-p-on-surface transition-colors">
                  {savingName ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditName(false)} className="text-xs uppercase tracking-widest px-3 py-1 text-p-on-surface-variant hover:text-p-on-surface transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <h2 className="text-5xl font-extrabold tracking-tight text-p-on-surface">{displayName}</h2>
            )}
            <div className="flex items-center gap-4">
              <p className="text-p-on-surface-variant text-sm">{profile.email}</p>
              <button
                onClick={() => setEditName(true)}
                className="px-4 py-1 text-xs font-label uppercase tracking-widest bg-p-surface-container-high text-p-on-surface-variant rounded-full hover:bg-p-surface-bright transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </section>

        {/* Patterns */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-4">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-p-on-surface-variant opacity-60">
              Your Patterns
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-p-surface-container-low p-6 rounded-xl space-y-4">
                <span className="material-symbols-outlined text-p-secondary opacity-70">schedule</span>
                <div>
                  <p className="text-[0.625rem] uppercase tracking-wider text-p-on-surface-variant">Avg. Daily</p>
                  <p className="text-2xl font-bold text-p-on-surface">{fmtTime(profile.avg_daily_minutes)}</p>
                </div>
              </div>
              <div className="bg-p-surface-container-low p-6 rounded-xl space-y-4 border-l-4 border-p-secondary/30">
                <span className="material-symbols-outlined text-p-tertiary-dim opacity-70">category</span>
                <div>
                  <p className="text-[0.625rem] uppercase tracking-wider text-p-on-surface-variant">Top Category</p>
                  <p className="text-2xl font-bold text-p-on-surface">{profile.top_category}</p>
                </div>
              </div>
              <div className="bg-p-surface-container-low p-6 rounded-xl space-y-4">
                <span className="material-symbols-outlined text-p-primary opacity-70">rocket_launch</span>
                <div>
                  <p className="text-[0.625rem] uppercase tracking-wider text-p-on-surface-variant">Most Used</p>
                  <p className="text-2xl font-bold text-p-on-surface truncate">{profile.most_used_project}</p>
                </div>
              </div>
            </div>
          </div>

          {/* How You Work */}
          <div className="col-span-12 lg:col-span-4 flex flex-col justify-end gap-4">
            <div className="bg-p-surface-container-lowest border border-p-outline-variant/15 p-5 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-p-tertiary-dim mt-0.5 text-lg">lightbulb</span>
                <p className="text-p-on-surface-variant text-sm leading-relaxed">{profile.productivity_insight}</p>
              </div>
            </div>
            <div className="bg-p-surface-container-lowest border border-p-outline-variant/15 p-5 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-p-secondary mt-0.5 text-lg">check_circle</span>
                <p className="text-p-on-surface-variant text-sm leading-relaxed">{profile.consistency_insight}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consistency + Goals */}
        <div className="grid grid-cols-12 gap-8">
          {/* Streak */}
          <div className="col-span-12 md:col-span-4 bg-p-surface-container-low p-8 rounded-xl flex flex-col justify-between">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-p-on-surface-variant mb-8">
              Consistency
            </p>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <p className="text-p-on-surface-variant text-sm">Current Streak</p>
                <p className="text-4xl font-bold text-p-secondary">
                  {profile.current_streak} <span className="text-base font-normal">days</span>
                </p>
              </div>
              <div className="h-px bg-p-outline-variant/10" />
              <div className="flex justify-between items-end">
                <p className="text-p-on-surface-variant text-sm">Best Streak</p>
                <p className="text-xl font-bold text-p-on-surface">
                  {profile.best_streak} days
                </p>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="col-span-12 md:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-p-on-surface-variant">
                Active Goals
              </p>
              <button
                onClick={() => setShowGoalForm(true)}
                className="flex items-center gap-1 text-[0.6875rem] uppercase tracking-widest text-p-on-surface-variant hover:text-p-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add
              </button>
            </div>

            {showGoalForm && (
              <form onSubmit={handleCreateGoal} className="bg-p-surface-container-high p-5 rounded-xl space-y-3">
                <input
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Goal name (e.g. Deep Work)"
                  className="w-full bg-transparent text-p-on-surface text-sm outline-none border-b border-p-outline-variant/30 pb-1"
                  required
                />
                <div className="flex gap-3">
                  <input
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    placeholder="Target hours (e.g. 5)"
                    type="number"
                    min="0.5"
                    step="0.5"
                    className="flex-1 bg-transparent text-p-on-surface text-sm outline-none border-b border-p-outline-variant/30 pb-1"
                    required
                  />
                  <select
                    value={goalPeriod}
                    onChange={(e) => setGoalPeriod(e.target.value)}
                    className="bg-p-surface-container-low text-p-on-surface-variant text-xs rounded-lg px-3 py-1 outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={savingGoal} className="text-xs uppercase tracking-widest px-4 py-1.5 bg-p-primary text-p-on-primary rounded-lg hover:opacity-90 transition-opacity">
                    {savingGoal ? "Saving…" : "Create"}
                  </button>
                  <button type="button" onClick={() => setShowGoalForm(false)} className="text-xs uppercase tracking-widest text-p-on-surface-variant hover:text-p-on-surface transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {profile.goals.length === 0 && !showGoalForm && (
              <p className="text-p-on-surface-variant text-sm px-1">No goals yet. Add one above.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.goals.map((goal) => {
                const pct = Math.min(100, Math.round((goal.current_minutes / goal.target_minutes) * 100));
                const barColor = PERIOD_COLORS[goal.period] || "bg-p-primary-dim";
                return (
                  <div key={goal.id} className="bg-p-surface-container-high p-6 rounded-xl space-y-4 group">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-p-on-surface">{goal.name}</p>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditGoal(goal); setEditCurrentMin(String(goal.current_minutes / 60)); }}
                          className="text-p-on-surface-variant hover:text-p-on-surface transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button onClick={() => handleDeleteGoal(goal.id)} className="text-p-error hover:opacity-80 transition-opacity">
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-p-on-surface-variant">
                      <span className="uppercase tracking-widest">{goal.period}</span>
                      <span>{fmtTime(goal.current_minutes)} / {fmtTime(goal.target_minutes)}</span>
                    </div>
                    <div className="w-full bg-p-surface-container-low h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${barColor} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    {/* Inline progress edit */}
                    {editGoal?.id === goal.id && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          value={editCurrentMin}
                          onChange={(e) => setEditCurrentMin(e.target.value)}
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="Current hours"
                          className="flex-1 bg-transparent border-b border-p-outline-variant/30 text-p-on-surface text-xs outline-none pb-0.5"
                          autoFocus
                        />
                        <button onClick={saveGoalProgress} className="text-xs uppercase tracking-widest text-p-on-surface-variant hover:text-p-on-surface">Save</button>
                        <button onClick={() => setEditGoal(null)} className="text-xs text-p-on-surface-variant hover:text-p-on-surface">✕</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Reflections */}
        {profile.recent_reflections.length > 0 && (
          <section className="space-y-4">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-p-on-surface-variant">
              Recent Reflections
            </p>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
              {profile.recent_reflections.map((r) => (
                <div
                  key={r.id}
                  className="min-w-[280px] bg-p-surface-container-lowest border border-p-outline-variant/15 p-6 rounded-xl"
                >
                  <p className="text-[0.625rem] text-p-on-surface-variant mb-3">{formatDate(r.date)}</p>
                  <p className="text-p-on-surface italic text-sm line-clamp-4">&ldquo;{r.content}&rdquo;</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Account Actions */}
        <footer className="pt-12 border-t border-p-outline-variant/10 flex flex-col gap-4">
          <div className="flex gap-8">
            <button
              onClick={handleLogout}
              className="text-xs font-label uppercase tracking-widest text-p-on-surface-variant hover:text-p-on-surface transition-colors"
            >
              Logout
            </button>
            <button
              onClick={handleDeleteAccount}
              className="text-xs font-label uppercase tracking-widest text-p-error-dim hover:text-p-error transition-colors"
            >
              Delete Account
            </button>
          </div>
          <p className="text-[0.625rem] text-p-on-surface-variant opacity-40">
            Pulsr v1.0 — Your data is yours.
          </p>
        </footer>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 w-full flex justify-around items-center bg-p-surface-variant/90 backdrop-blur-xl h-20 px-4 border-t border-p-outline-variant/10 z-50">
        <Link href="/app" className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">history_edu</span>
          <span className="text-[10px]">Journal</span>
        </Link>
        <Link href="/app/insights" className="flex flex-col items-center gap-1 text-p-on-surface-variant">
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-[10px]">Insights</span>
        </Link>
        <Link href="/app/profile" className="flex flex-col items-center gap-1 text-p-primary">
          <span className="material-symbols-outlined">account_circle</span>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
