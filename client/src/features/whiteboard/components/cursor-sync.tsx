import * as React from "react"
import { track, useEditor } from "tldraw"
import { useAuthStore } from "@/stores/auth-store"
import { useCurrentUser } from "@/features/users/hooks/use-current-user"
import { ensureSocketConnected } from "@/lib/socket/socket"

const EMIT_THROTTLE_MS = 50

type RemoteCursor = { id: string; email: string; position: { x: number; y: number } }

export function CursorSync({ workspaceId }: { workspaceId: string }) {
  const editor = useEditor()
  const session = useAuthStore((s) => s.session)
  const { data: currentUser } = useCurrentUser()
  const [cursors, setCursors] = React.useState<Record<string, RemoteCursor>>({})
  const lastEmit = React.useRef(0)

  React.useEffect(() => {
    if (!session?.access_token) return
    const socket = ensureSocketConnected(session.access_token)

    function handleCursor(cursor: RemoteCursor) {
      setCursors((prev) => ({ ...prev, [cursor.id]: cursor }))
    }
    function handleOffline(user: { id: string }) {
      setCursors((prev) => {
        const next = { ...prev }
        delete next[user.id]
        return next
      })
    }

    function handlePointerMove(e: PointerEvent) {
      const now = Date.now()
      if (now - lastEmit.current < EMIT_THROTTLE_MS) return
      lastEmit.current = now
      const pagePoint = editor.screenToPage({ x: e.clientX, y: e.clientY })
      socket.emit("whiteboard:cursor", workspaceId, { x: pagePoint.x, y: pagePoint.y })
    }

    socket.on("whiteboard:cursor", handleCursor)
    socket.on("user_offline", handleOffline)
    window.addEventListener("pointermove", handlePointerMove)

    return () => {
      socket.off("whiteboard:cursor", handleCursor)
      socket.off("user_offline", handleOffline)
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [editor, workspaceId, session?.access_token])

  return <CursorOverlay cursors={cursors} excludeUserId={currentUser?.id} />
}

// track() makes this re-render on camera pan/zoom automatically — it
// subscribes to whatever tldraw signals get read during render, and
// editor.pageToScreen() reads the camera internally.
const CursorOverlay = track(function CursorOverlay({
  cursors,
  excludeUserId,
}: {
  cursors: Record<string, RemoteCursor>
  excludeUserId: string | undefined
}) {
  const editor = useEditor()

  return (
    <div className="pointer-events-none absolute inset-0 z-[500]">
      {Object.values(cursors)
        .filter((c) => c.id !== excludeUserId)
        .map((cursor) => {
          const screenPoint = editor.pageToScreen(cursor.position)
          return (
            <div
              key={cursor.id}
              className="absolute flex items-center gap-1 transition-[left,top] duration-75"
              style={{ left: screenPoint.x, top: screenPoint.y }}
            >
              <div className="size-2 rounded-full bg-primary" />
              <span className="rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                {cursor.email}
              </span>
            </div>
          )
        })}
    </div>
  )
})