import { create } from "zustand"
import type { Session, User } from "@supabase/supabase-js"

type AuthState = {
  session: Session | null
  user: User | null
  isInitialized: boolean
  setSession: (session: Session | null) => void
  setInitialized: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isInitialized: false,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setInitialized: () => set({ isInitialized: true }),
}))