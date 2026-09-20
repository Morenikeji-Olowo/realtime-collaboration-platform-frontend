import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Workspace = { id: string; name: string }

export function WorkspaceSwitcher({
  workspaces,
  activeWorkspaceId,
  onSelect,
  onCreateWorkspace,
}: {
  workspaces: Workspace[]
  activeWorkspaceId: string
  onSelect: (id: string) => void
  onCreateWorkspace: () => void
}) {
  const active = workspaces.find((w) => w.id === activeWorkspaceId)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <span className="flex-1 truncate font-medium">
                {active?.name ?? "Select workspace"}
              </span>
              <ChevronsUpDownIcon className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width)">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {workspaces.map((w) => (
              <DropdownMenuItem key={w.id} onClick={() => onSelect(w.id)}>
                {w.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateWorkspace}>
              <PlusIcon />
              Create workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}