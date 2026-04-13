export interface Entry {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  project_id: string | null;
  activity_id: string | null;
  category: string | null;
}

export interface ProjectBreakdownItem {
  name: string;
  minutes: number;
}

export interface DailyInsights {
  total_tracked: number;
  untracked_minutes: number;
  peak_window: string | null;
  project_breakdown: ProjectBreakdownItem[];
  category_breakdown: {
    work: number;
    personal_care: number;
    breaks: number;
    others: number;
  };
}

export interface WeeklyInsights {
  total_per_day: { day: string; minutes: number }[];
  top_project: { name: string; total_minutes: number; change_percentage: number };
  project_totals: ProjectBreakdownItem[];
}

export interface ActivityItem {
  id: string;
  name: string;
  description: string | null;
  type: string;
  project_id: string | null;
}

export interface ProjectInCategory {
  id: string;
  name: string;
  activities: ActivityItem[];
}

export interface Category {
  id: string;
  name: string;
  type: string;
  created_at: string;
  projects: ProjectInCategory[];
  activities: ActivityItem[]; // direct (no project)
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export type ProjectStatus = "active" | "upcoming" | "completed";

export interface Project {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  status: ProjectStatus;
  progress: number;
  progress_override: number | null;
  created_at: string;
  updated_at: string;
}
