import { apiFetch } from "@/lib/api/client"
import type { Workspace } from "@/features/workspaces/types/workspace"

export function listWorkspaces() {
  return apiFetch<Workspace[]>("/api/workspaces")
}

export function createWorkspace(name: string) {
  return apiFetch<Workspace>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify({ name }),
  })
}
export function renameWorkspace(workspaceId: string, name: string) {
  return apiFetch<Workspace>(`/api/workspaces/${workspaceId}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  })
}

export function deleteWorkspace(workspaceId: string) {
  return apiFetch<null>(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
  })
}