import { supabase } from "@/lib/supabase/client"
import { env } from "@/config/env"
import { ApiError } from "@/lib/api/client"
import type { ActivityEvent } from "@/features/activity/types/activity-event"

type ActivityResponse =
  | { success: true; data: ActivityEvent[]; next_cursor: string | null }
  | { success: false; error: string }

// Not using apiFetch here — its generic signature assumes everything useful
// lives under `data`, but this endpoint's `next_cursor` sits as a sibling
// field, not nested inside it. Reimplementing the auth/fetch logic rather
// than distorting apiFetch's contract for one endpoint's shape.
export async function listActivity(workspaceId: string, before?: string) {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token

  const params = new URLSearchParams({ limit: "20" })
  if (before) params.set("before", before)

  const res = await fetch(`${env.VITE_API_URL}/api/workspaces/${workspaceId}/activity?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const body: ActivityResponse = await res.json()

  if (!body.success) throw new ApiError(body.error)
  return { events: body.data, nextCursor: body.next_cursor }
}