import { apiFetch } from "@/lib/api/client"
import type { Message } from "@/features/chat/types/message"

export function listMessages(workspaceId: string) {
  return apiFetch<Message[]>(`/api/workspaces/${workspaceId}/messages`)
}