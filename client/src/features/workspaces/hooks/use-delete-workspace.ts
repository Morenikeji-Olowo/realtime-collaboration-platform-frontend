import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteWorkspace } from "@/features/workspaces/api/workspaces-api"

export function useDeleteWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteWorkspace(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}