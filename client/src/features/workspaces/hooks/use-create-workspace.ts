import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createWorkspace } from "@/features/workspaces/api/workspaces-api"

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createWorkspace(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}