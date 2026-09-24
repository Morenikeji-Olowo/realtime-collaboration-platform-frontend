import { useInfiniteQuery } from "@tanstack/react-query"
import { listActivity } from "@/features/activity/api/activity-api"

export function useActivity(workspaceId: string) {
  return useInfiniteQuery({
    queryKey: ["activity", workspaceId],
    queryFn: ({ pageParam }: { pageParam?: string }) => listActivity(workspaceId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}