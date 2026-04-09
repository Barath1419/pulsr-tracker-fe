export interface Entry {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
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
