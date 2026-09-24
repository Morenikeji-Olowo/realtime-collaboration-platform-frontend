import { Link, useLocation, useNavigate, useParams } from "react-router"
import {
  HomeIcon, FileTextIcon, PenToolIcon, MessageSquareIcon,
  BellIcon, UsersIcon, SettingsIcon, KeyboardIcon, SearchIcon,
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher"
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces"
import { useCurrentUser } from "@/features/users/hooks/use-current-user"
import { getInitials } from "@/features/users/lib/get-initials"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { signOut } from "@/features/auth/api/auth-api"
import * as React from "react"
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog"

export function WorkspaceSidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { pathname } = useLocation()
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { data: workspaces = [] } = useWorkspaces()
  const { data: currentUser } = useCurrentUser()
  const base = `/w/${workspaceId}`
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = React.useState(false)


  const navItems = [
    { label: "Home", to: base, icon: HomeIcon, end: true },
    { label: "Documents", to: `${base}/documents`, icon: FileTextIcon },
    { label: "Whiteboard", to: `${base}/whiteboard`, icon: PenToolIcon },
    { label: "Chat", to: `${base}/chat`, icon: MessageSquareIcon },
    { label: "Activity", to: `${base}/activity`, icon: BellIcon },
    { label: "Members", to: `${base}/members`, icon: UsersIcon },
  ]

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname.startsWith(to)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <WorkspaceSwitcher
          workspaces={workspaces}
          activeWorkspaceId={workspaceId ?? ""}
          onSelect={(id) => navigate(`/w/${id}`)}
          onCreateWorkspace={() => setCreateWorkspaceOpen(true)}
        />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onOpenSearch} tooltip="Search">
              <SearchIcon />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <CreateWorkspaceDialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen} />

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.to, item.end)}
                  tooltip={item.label}
                >
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link to={`${base}/settings`}>
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {/* TODO: wire to an actual keyboard-shortcuts modal (spec Section 18) */}
            <SidebarMenuButton tooltip="Keyboard shortcuts">
              <KeyboardIcon />
              <span>Keyboard shortcuts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton tooltip={currentUser?.name ?? ""} size="lg">
                  <Avatar className="size-6">
                    <AvatarFallback>
                      {currentUser ? getInitials(currentUser.name) : ""}
                    </AvatarFallback>
                  </Avatar>
                  <span>{currentUser?.name ?? "Loading..."}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="top" className="w-(--radix-dropdown-menu-trigger-width)">
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}