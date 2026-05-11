const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return res.json();
}

// Auth
export async function googleSignIn(idToken: string) {
  return request<{ access_token: string; token_type: string }>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function signup(email: string, password: string) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// Entries
export async function getEntries(date?: string) {
  const query = date ? `?date=${date}` : "";
  return request<import("@/types").Entry[]>(`/entries${query}`);
}

export async function createEntry(data: {
  title: string;
  start_time: string;
  end_time: string;
  project_id?: string | null;
  activity_id?: string | null;
  category?: string | null;
}) {
  return request<import("@/types").Entry>("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteEntry(id: string) {
  return request(`/entries/${id}`, { method: "DELETE" });
}

// Categories
export async function getCategories() {
  return request<import("@/types").Category[]>("/categories");
}

export async function createCategory(data: { name: string; type?: string }) {
  return request<import("@/types").Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: { name?: string; type?: string }) {
  return request<import("@/types").Category>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return request(`/categories/${id}`, { method: "DELETE" });
}

// Activities
export async function createActivity(data: {
  name: string;
  category_id: string;
  project_id?: string | null;
  description?: string | null;
  type?: string;
}) {
  return request<import("@/types").ActivityItem>("/activities", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateActivity(id: string, data: { name?: string; description?: string | null; type?: string }) {
  return request<import("@/types").ActivityItem>(`/activities/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteActivity(id: string) {
  return request(`/activities/${id}`, { method: "DELETE" });
}

export async function getDailyInsights(date: string) {
  return request<import("@/types").DailyInsights>(`/insights/daily?date=${date}`);
}

export async function getWeeklyInsights() {
  return request<import("@/types").WeeklyInsights>(`/insights/weekly`);
}

export async function assignProject(entryId: string, projectId: string | null) {
  return request<import("@/types").Entry>(`/entries/${entryId}/assign-project`, {
    method: "PUT",
    body: JSON.stringify({ project_id: projectId }),
  });
}

// Projects
export async function getProjects() {
  return request<import("@/types").Project[]>("/projects");
}

export async function createProject(data: {
  name: string;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
  category_id?: string | null;
}) {
  return request<import("@/types").Project>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProject(
  id: string,
  data: Partial<{ name: string; start_date: string; end_date: string | null; notes: string | null; category_id: string | null }>
) {
  return request<import("@/types").Project>(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string) {
  return request(`/projects/${id}`, { method: "DELETE" });
}

// Profile
export async function getProfile() {
  return request<import("@/types").UserProfile>("/profile");
}

export async function updateProfile(data: { name?: string; avatar_url?: string }) {
  return request<import("@/types").UserProfile>("/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAccount() {
  return request("/profile", { method: "DELETE" });
}

// Goals
export async function getGoals() {
  return request<import("@/types").Goal[]>("/goals");
}

export async function createGoal(data: {
  name: string;
  target_minutes: number;
  current_minutes?: number;
  period?: string;
  color?: string | null;
}) {
  return request<import("@/types").Goal>("/goals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateGoal(id: string, data: {
  name?: string;
  target_minutes?: number;
  current_minutes?: number;
  period?: string;
  color?: string | null;
}) {
  return request<import("@/types").Goal>(`/goals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteGoal(id: string) {
  return request(`/goals/${id}`, { method: "DELETE" });
}

// Reflections
export async function getReflections() {
  return request<import("@/types").Reflection[]>("/reflections");
}

export async function upsertReflection(data: { date: string; content: string }) {
  return request<import("@/types").Reflection>("/reflections", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
