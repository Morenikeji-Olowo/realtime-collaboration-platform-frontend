import { z } from "zod"

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Workspace name is required")
    .max(200, "Workspace name must be 200 characters or fewer"),
})

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>