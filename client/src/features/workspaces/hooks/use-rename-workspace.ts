import { useMutation, useQueryClient } from "@tanstack/react-query"
import { renameWorkspace } from "@/features/workspaces/api/workspaces-api"

export function useRenameWorkspace(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => renameWorkspace(workspaceId, name),
    onSuccess: () => {
      // Same query key WorkspaceSwitcher/sidebar already read from —
      // invalidating this is what makes the new name show up there too,
      // not a separate update.
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}