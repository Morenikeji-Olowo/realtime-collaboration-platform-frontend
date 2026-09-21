import { Navigate, Outlet, useLocation, useParams } from "react-router"
import { useAuthStatus } from "@/app/use-auth-status"
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces"

export function RequireAuth() {
  const status = useAuthStatus()
  const location = useLocation()

  if (status === "loading") return null
  if (status === "guest") return <Navigate to="/login" state={{ from: location }} replace />
  if (status === "unverified") return <Navigate to="/verify" replace />

  return <Outlet />
}

export function RequireGuest() {
  const status = useAuthStatus()

  if (status === "loading") return null
  if (status === "unverified") return <Navigate to="/verify" replace />
  if (status === "authenticated") return <Navigate to="/" replace />

  return <Outlet />
}

export function RequireUnverified() {
  const status = useAuthStatus()

  if (status === "loading") return null
  if (status === "guest") return <Navigate to="/login" replace />
  if (status === "authenticated") return <Navigate to="/" replace />

  return <Outlet />
}

export function WorkspaceEntryRedirect() {
  const { data: workspaces, isLoading, isError } = useWorkspaces()

  if (isLoading) return null
  if (isError) {
    return <div className="p-8 text-sm text-destructive">Couldn't load your workspaces. Try refreshing.</div>
  }

  if (!workspaces || workspaces.length === 0) return <Navigate to="/onboarding" replace />
  if (workspaces.length === 1) return <Navigate to={`/w/${workspaces[0].id}`} replace />
  return <Navigate to="/workspaces" replace />
}

export function RequireWorkspaceMembership() {
  const { workspaceId } = useParams()
  const { data: workspaces, isLoading, isError } = useWorkspaces()

  if (isLoading) return null
  if (isError) {
    return <div className="p-8 text-sm text-destructive">Couldn't verify workspace access.</div>
  }

  const isMember = workspaces?.some((w) => w.id === workspaceId)
  if (!isMember) return <Navigate to="/workspaces" replace />

  return <Outlet />
}