import { useInfiniteQuery } from "@tanstack/react-query"
import { listFiles } from "@/features/files/api/files-api"

export function useFiles(workspaceId: string) {
  return useInfiniteQuery({
    queryKey: ["workspace-files", workspaceId],
    queryFn: ({ pageParam }: { pageParam?: string }) => listFiles(workspaceId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}