import { useParams } from "react-router"
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces"

export function useCurrentWorkspaceRole() {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { data: workspaces } = useWorkspaces()
  return workspaces?.find((w) => w.id === workspaceId)?.role
}