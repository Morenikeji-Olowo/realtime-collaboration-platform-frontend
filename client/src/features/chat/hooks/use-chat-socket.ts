import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useAuthStore } from "@/stores/auth-store"
import { ensureSocketConnected } from "@/lib/socket/socket"
import type { Message } from "@/features/chat/types/message"

export function useChatSocket(workspaceId: string) {
  const session = useAuthStore((s) => s.session)
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = React.useState(false)

  React.useEffect(() => {
    if (!session?.access_token) return
    const socket = ensureSocketConnected(session.access_token)

    function handleIncoming(message: Message) {
      // Backend confirmed a sender never receives their own broadcast, so
      // there's no overlap with the ack-based append in sendMessage below —
      // trusting that contract rather than defensively deduping by id.
      queryClient.setQueryData<Message[]>(["messages", workspaceId], (old) => [
        ...(old ?? []),
        message,
      ])
    }

    socket.on("chat:message", handleIncoming)
    return () => {
      socket.off("chat:message", handleIncoming)
    }
  }, [workspaceId, queryClient, session?.access_token])

  function sendMessage(content: string): Promise<{ success: boolean; error?: string }> {
    if (!session?.access_token) {
      return Promise.resolve({ success: false, error: "Not connected." })
    }
    const socket = ensureSocketConnected(session.access_token)
    setIsSending(true)

    return new Promise((resolve) => {
      socket.emit(
        "chat:message",
        workspaceId,
        content,
        (res: { success: boolean; data?: Message; error?: string }) => {
          setIsSending(false)
          if (res.success && res.data) {
            queryClient.setQueryData<Message[]>(["messages", workspaceId], (old) => [
              ...(old ?? []),
              res.data!,
            ])
          }
          resolve(res)
        }
      )
    })
  }

  return { sendMessage, isSending }
}