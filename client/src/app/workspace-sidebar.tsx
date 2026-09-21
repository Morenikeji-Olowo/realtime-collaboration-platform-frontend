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

export function WorkspaceSidebar({ onOpenSearch }: { onOpenSearch: () => void }) {
  const { pathname } = useLocation()
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const { data: workspaces = [] } = useWorkspaces()
  const { data: currentUser } = useCurrentUser()
  const base = `/w/${workspaceId}`


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
          onCreateWorkspace={() => {}}
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
            <SidebarMenuButton asChild tooltip={currentUser?.name ?? ""} size="lg">
              <Link to="/settings/profile">
                <Avatar className="size-6">
                  <AvatarFallback>
                    {currentUser ? getInitials(currentUser.name) : ""}
                  </AvatarFallback>
                </Avatar>
                <span>{currentUser?.name ?? "Loading..."}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}