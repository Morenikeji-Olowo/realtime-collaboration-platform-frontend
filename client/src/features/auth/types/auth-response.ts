import type { User, Session } from "@supabase/supabase-js"

export type SignupResponse = { user: User | null; session: Session | null }
export type LoginResponse = { user: User; session: Session }