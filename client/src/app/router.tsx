import { BrowserRouter, Routes, Route } from "react-router"
import { RequireAuth, RequireGuest, RequireUnverified, WorkspaceEntryRedirect, RequireWorkspaceMembership } from "@/app/guards"
import { WorkspaceLayout } from "@/app/workspace-layout"
import * as Pages from "@/app/placeholder-pages"

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireGuest />}>
          <Route path="/login" element={<Pages.Login />} />
          <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
          <Route path="/reset-password" element={<Pages.ResetPassword />} />
        </Route>

        <Route element={<RequireUnverified />}>
          <Route path="/verify" element={<Pages.Verify />} />
        </Route>
          <Route element={<RequireAuth />}>
            <Route path="/onboarding" element={<Pages.Onboarding />} />
            <Route path="/workspaces" element={<Pages.WorkspaceSelector />} />
            <Route path="/settings/profile" element={<Pages.ProfileSettings />} />
            <Route path="/invitations/:invitationId" element={<Pages.InvitationAccept />} />
            <Route path="/" element={<WorkspaceEntryRedirect />} />

            <Route path="/w/:workspaceId" element={<RequireWorkspaceMembership />}>
            <Route element={<WorkspaceLayout />}>
              <Route index element={<Pages.Home />} />
              <Route path="documents" element={<Pages.Documents />} />
              <Route path="documents/:documentId" element={<Pages.DocumentEditor />} />
              <Route path="whiteboard" element={<Pages.Whiteboard />} />
              <Route path="chat" element={<Pages.Chat />} />
              <Route path="activity" element={<Pages.Activity />} />
              <Route path="members" element={<Pages.Members />} />
              <Route path="settings" element={<Pages.WorkspaceSettings />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Pages.NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}