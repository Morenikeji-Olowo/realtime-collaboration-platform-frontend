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