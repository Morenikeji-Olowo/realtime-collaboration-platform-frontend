import * as React from "react"
import { useAuthStore } from "@/stores/auth-store"
import { ensureSocketConnected, disconnectSocket } from "@/lib/socket/socket"

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((s) => s.session)

  React.useEffect(() => {
    if (session?.access_token) {
      ensureSocketConnected(session.access_token)
    } else {
      disconnectSocket()
    }
  }, [session?.access_token])

  return <>{children}</>
}