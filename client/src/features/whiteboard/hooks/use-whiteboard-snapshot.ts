import { useQuery } from "@tanstack/react-query"
import { apiFetch } from "@/lib/api/client"

type WhiteboardSnapshot = {
  state: { version: number; objects: any[] }
  updated_at: string
}

export function useWhiteboardSnapshot(workspaceId: string) {
  return useQuery({
    queryKey: ["whiteboard", workspaceId],
    queryFn: () => apiFetch<WhiteboardSnapshot>(`/api/workspaces/${workspaceId}/whiteboard`),
  })
}