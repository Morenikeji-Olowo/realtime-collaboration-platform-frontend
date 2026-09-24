export type ActivityEventType = "workspace_created" | "document_created" | "member_joined"

export type ActivityActor = {
  id: string
  name: string
  email: string
} | null

export type ActivityEvent = {
  id: string
  event_type: ActivityEventType
  actor: ActivityActor
  target_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}