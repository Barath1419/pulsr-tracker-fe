const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface SignupPayload {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.detail || data?.message || "Something went wrong");
  }

  return data as T;
}

export async function signupUser(payload: SignupPayload): Promise<void> {
  await post("/auth/signup", payload);
}

export async function loginUser(payload: SignupPayload): Promise<AuthToken> {
  return post<AuthToken>("/auth/login", payload);
}

export function storeToken(token: string): void {
  localStorage.setItem("token", token);
}

// Client-side validation — returns error string or null
export function validateSignup(
  email: string,
  password: string,
  confirm: string
): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email address";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password !== confirm) return "Passwords do not match";
  return null;
}
