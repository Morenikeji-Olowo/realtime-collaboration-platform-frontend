import { useAuthStore } from "@/stores/auth-store"

export function useAuthStatus() {
  const { session, isInitialized } = useAuthStore()
  if (!isInitialized) return "loading" as const
  if (!session) return "guest" as const
  if (!session.user.email_confirmed_at) return "unverified" as const
  return "authenticated" as const
}