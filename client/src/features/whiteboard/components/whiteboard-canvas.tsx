import * as React from "react"
import { Tldraw, useEditor, createTLStore, type TLRecord } from "tldraw"
import "tldraw/tldraw.css"
import { useAuthStore } from "@/stores/auth-store"
import { ensureSocketConnected } from "@/lib/socket/socket"
import { useWhiteboardSnapshot } from "@/features/whiteboard/hooks/use-whiteboard-snapshot"
import { CursorSync } from "@/features/whiteboard/components/cursor-sync"

// Drag/resize fires many intermediate updates per second — batch each
// record's updates and send only the settled value, ~200ms after the last
// change to that specific record. Deletes and the record's most recent
// value both still go through, just not every intermediate frame.
const UPSERT_DEBOUNCE_MS = 200

function SyncBridge({ workspaceId }: { workspaceId: string }) {
  const editor = useEditor()
  const session = useAuthStore((s) => s.session)
  const timers = React.useRef(new Map<string, ReturnType<typeof setTimeout>>())

  React.useEffect(() => {
    if (!session?.access_token) return
    const socket = ensureSocketConnected(session.access_token)

    // Local changes → network, debounced per-record.
    const unlisten = editor.store.listen(
      (entry) => {
        for (const record of Object.values(entry.changes.added)) {
          scheduleUpsert(record as TLRecord)
        }
        for (const [, record] of Object.values(entry.changes.updated)) {
          scheduleUpsert(record as TLRecord)
        }
        for (const record of Object.values(entry.changes.removed)) {
          socket.emit("whiteboard:operation", workspaceId, record.id, "delete", null, () => {})
        }
      },
      { source: "user", scope: "document" }
    )

    function scheduleUpsert(record: TLRecord) {
      const existing = timers.current.get(record.id)
      if (existing) clearTimeout(existing)
      timers.current.set(
        record.id,
        setTimeout(() => {
          socket.emit("whiteboard:operation", workspaceId, record.id, "upsert", record, () => {})
          timers.current.delete(record.id)
        }, UPSERT_DEBOUNCE_MS)
      )
    }

    // Remote changes → local store, tagged 'remote' so the listener above
    // (filtered to source:'user') never re-broadcasts them back out.
    function handleRemoteOp({
      objectId,
      action,
      data,
    }: {
      objectId: string
      action: "upsert" | "delete"
      data: TLRecord | null
    }) {
      editor.store.mergeRemoteChanges(() => {
        if (action === "upsert" && data) editor.store.put([data])
        if (action === "delete") editor.store.remove([objectId as TLRecord["id"]])
      })
    }

    socket.on("whiteboard:operation", handleRemoteOp)

    return () => {
      unlisten()
      socket.off("whiteboard:operation", handleRemoteOp)
      timers.current.forEach(clearTimeout)
      timers.current.clear()
    }
  }, [editor, workspaceId, session?.access_token])

  return null
}

export function WhiteboardCanvas({ workspaceId }: { workspaceId: string }) {
  const { data: snapshot, isLoading } = useWhiteboardSnapshot(workspaceId)
  const [store] = React.useState(() => createTLStore())
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => {
    if (!snapshot || loaded) return
    store.mergeRemoteChanges(() => {
      store.put(snapshot.state.objects as TLRecord[])
    })
    setLoaded(true)
  }, [snapshot, loaded, store])

  if (isLoading) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">Loading whiteboard...</div>
  }

  return (
    <div className="relative h-full">
      <Tldraw store={store}>
        <SyncBridge workspaceId={workspaceId} />
        <CursorSync workspaceId={workspaceId} />
      </Tldraw>
    </div>
  )
}