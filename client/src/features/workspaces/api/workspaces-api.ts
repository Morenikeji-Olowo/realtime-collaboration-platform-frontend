import { apiFetch } from "@/lib/api/client"
import type { Workspace } from "@/features/workspaces/types/workspace"

export function listWorkspaces() {
  return apiFetch<Workspace[]>("/api/workspaces")
}