import { apiFetch } from "@/lib/api/client"
import type { CurrentUser } from "@/features/users/types/user"

export function getCurrentUser() {
  return apiFetch<CurrentUser>("/api/users/me")
}