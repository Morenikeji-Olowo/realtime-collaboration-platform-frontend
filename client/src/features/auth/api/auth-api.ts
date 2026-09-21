import { apiFetch } from "@/lib/api/client"
import { supabase } from "@/lib/supabase/client"
import type { SignupResponse, LoginResponse } from "@/features/auth/types/auth-response"

export async function signup(input: { email: string; password: string; name: string }) {
  return apiFetch<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function login(input: { email: string; password: string }) {
  const result = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })

  // Adopt the backend-issued session into the SDK — this is the one-time
  // handoff point described in the architecture proposal. Only login ever
  // reaches this line; signup's session is null until email confirmation.
  await supabase.auth.setSession({
    access_token: result.session.access_token,
    refresh_token: result.session.refresh_token,
  })

  return result
}