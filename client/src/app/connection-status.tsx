import * as React from "react"
import { getSocket } from "@/lib/socket/socket"

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = React.useState(true)

  React.useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // Covers the case where this mounts while already disconnected —
    // otherwise we'd sit on the optimistic default until the next event fires.
    setIsConnected(socket.connected)

    function handleDisconnect() {
      setIsConnected(false)
    }
    function handleConnect() {
      setIsConnected(true)
    }

    socket.on("disconnect", handleDisconnect)
    socket.on("connect", handleConnect)

    return () => {
      socket.off("disconnect", handleDisconnect)
      socket.off("connect", handleConnect)
    }
  }, [])

  if (isConnected) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-1.5 animate-pulse rounded-full bg-warning-text" />
      Reconnecting...
    </div>
  )
}