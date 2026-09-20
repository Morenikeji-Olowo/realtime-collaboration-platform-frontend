import { Outlet } from "react-router"

// TODO: read real session state (Supabase + Zustand) once auth is built.
// - not authenticated           → redirect to /login
// - authenticated, unverified   → redirect to /verify
// - authenticated, onboarding incomplete → redirect to /onboarding
export function RequireAuth() {
  return <Outlet />
}

// TODO: opposite of RequireAuth — for /login, /forgot-password, etc.
// - already authenticated → redirect away (to / , which resolves via WorkspaceEntryRedirect)
export function RequireGuest() {
  return <Outlet />
}

// TODO: decide where a just-authenticated user lands.
// - zero workspaces      → onboarding / create-workspace state
// - exactly one workspace → redirect straight to /w/:thatWorkspaceId
// - multiple workspaces   → redirect to /workspaces (selector)
export function WorkspaceEntryRedirect() {
  return <Outlet />
}

// TODO: check membership of :workspaceId for the current user.
// - not a member of this specific workspace → permission-denied
export function RequireWorkspaceMembership() {
  return <Outlet />
}