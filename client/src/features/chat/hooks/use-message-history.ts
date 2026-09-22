import { useQuery } from "@tanstack/react-query"
import { listMessages } from "@/features/chat/api/messages-api"

export function useMessageHistory(workspaceId: string) {
  return useQuery({
    queryKey: ["messages", workspaceId],
    queryFn: () => listMessages(workspaceId),
  })
}