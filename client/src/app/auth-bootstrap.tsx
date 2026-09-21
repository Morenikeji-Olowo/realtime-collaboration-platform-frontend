import * as React from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuthStore } from "@/stores/auth-store"

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      useAuthStore.getState().setSession(data.session)
      useAuthStore.getState().setInitialized()
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  return <>{children}</>
}