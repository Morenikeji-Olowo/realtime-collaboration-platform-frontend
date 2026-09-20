import { Link, useLocation, useParams } from "react-router"
import {
  HomeIcon,
  FileTextIcon,
  PenToolIcon,
  MessageSquareIcon,
  BellIcon,
  UsersIcon,
  SettingsIcon,
  KeyboardIcon,
  SearchIcon,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher"

// TODO: replace with real data once workspace/user TanStack Query hooks exist
const MOCK_WORKSPACES = [{ id: "demo", name: "Demo Workspace" }]
const MOCK_USER = { name: "Keji", initials: "KJ" }

export function WorkspaceSidebar({
  onOpenSearch,
}: {
  onOpenSearch: () => void
}) {
  const { pathname } = useLocation()
  const { workspaceId } = useParams()
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
          workspaces={MOCK_WORKSPACES}
          activeWorkspaceId={workspaceId ?? MOCK_WORKSPACES[0].id}
          onSelect={() => {}}
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
            {/* TODO: wire to real user session + profile menu */}
            <SidebarMenuButton asChild tooltip={MOCK_USER.name} size="lg">
              <Link to="/settings/profile">
                <Avatar className="size-6">
                  <AvatarFallback>{MOCK_USER.initials}</AvatarFallback>
                </Avatar>
                <span>{MOCK_USER.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}