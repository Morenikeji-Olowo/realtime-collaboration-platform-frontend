import * as React from "react"
import * as Y from "yjs"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import { useAuthStore } from "@/stores/auth-store"
import { ensureSocketConnected } from "@/lib/socket/socket"
import { SocketYjsProvider } from "@/features/documents/lib/socket-yjs-provider"

export function useDocumentEditor(documentId: string) {
  const session = useAuthStore((s) => s.session)
  const [status, setStatus] = React.useState<"connecting" | "synced" | "error">("connecting")
  const [error, setError] = React.useState<string | null>(null)
  const ydocRef = React.useRef<Y.Doc | undefined>(undefined)
  const providerRef = React.useRef<SocketYjsProvider | undefined>(undefined)

  if (!ydocRef.current) ydocRef.current = new Y.Doc()

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ undoRedo: false }), // Yjs owns undo/redo history in collaborative mode
        Collaboration.configure({ document: ydocRef.current }),
      ],
      editable: status === "synced",
    },
    [status]
  )

  React.useEffect(() => {
    if (!session?.access_token || !ydocRef.current) return
    const socket = ensureSocketConnected(session.access_token)

    const provider = new SocketYjsProvider(socket, documentId, ydocRef.current, (s, err) => {
      setStatus(s)
      setError(err ?? null)
    })
    providerRef.current = provider
    provider.join()

    return () => {
      provider.destroy()
    }
  }, [documentId, session?.access_token])

  return { editor, status, error }
}