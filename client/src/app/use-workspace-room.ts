import * as React from "react"
import { useAuthStore } from "@/stores/auth-store"
import { ensureSocketConnected } from "@/lib/socket/socket"
import { usePresenceStore } from "@/stores/presence-store"

export function useWorkspaceRoom(workspaceId: string | undefined) {
  const session = useAuthStore((s) => s.session)
  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers)
  const addOnlineUser = usePresenceStore((s) => s.addOnlineUser)
  const removeOnlineUser = usePresenceStore((s) => s.removeOnlineUser)
  const clearPresence = usePresenceStore((s) => s.clear)

  React.useEffect(() => {
    if (!workspaceId || !session?.access_token) return
    const socket = ensureSocketConnected(session.access_token)

    function join() {
      socket.emit(
        "workspace:join",
        workspaceId,
        (res: { success: boolean; onlineUsers?: string[] }) => {
          if (res.success && res.onlineUsers) setOnlineUsers(res.onlineUsers)
        }
      )
    }

    function handleOnline(user: { id: string }) {
      addOnlineUser(user.id)
    }
    function handleOffline(user: { id: string }) {
      removeOnlineUser(user.id)
    }

    join()
    // Re-join on every reconnect, not just the first connect — backend was
    // explicit that socket.recovered is not reliable in this environment.
    socket.on("connect", join)
    socket.on("user_online", handleOnline)
    socket.on("user_offline", handleOffline)

    return () => {
      socket.emit("workspace:leave", workspaceId)
      socket.off("connect", join)
      socket.off("user_online", handleOnline)
      socket.off("user_offline", handleOffline)
      clearPresence()
    }
  }, [workspaceId, session?.access_token])
}