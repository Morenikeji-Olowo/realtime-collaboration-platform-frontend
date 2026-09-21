import { supabase } from "@/lib/supabase/client"
import { env } from "@/config/env"

type ApiEnvelope<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string }

export class ApiError extends Error {
  code?: string
  constructor(message: string, code?: string) {
    super(message)
    this.code = code
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  const res = await fetch(`${env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  })

  const body: ApiEnvelope<T> = await res.json()

  if (!body.success) {
    throw new ApiError(body.error, body.code)
  }

  return body.data
}