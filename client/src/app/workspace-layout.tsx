import { Outlet } from "react-router"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { WorkspaceSidebar } from "@/app/workspace-sidebar"
import { CommandMenu } from "@/app/command-menu"
import { useIsDesktop } from "@/hooks/use-is-desktop"
import * as React from "react"
import { ContextPanelProvider, ContextPanelDesktopSlot, ContextPanelOverlay } from "@/app/context-panel"

export function WorkspaceLayout() {
  const isDesktop = useIsDesktop()
  const [searchOpen, setSearchOpen] = React.useState(false)

  return (
    <ContextPanelProvider>
      <SidebarProvider defaultOpen={isDesktop}>
        <WorkspaceSidebar onOpenSearch={() => setSearchOpen(true)} />
        <SidebarInset>
          <div className="flex h-full">
            <div className="flex flex-1 flex-col">
              <header className="flex h-12 items-center gap-2 border-b px-3">
                <SidebarTrigger />
              </header>
              <div className="flex-1 overflow-auto">
                <Outlet />
              </div>
            </div>
            <ContextPanelDesktopSlot />
          </div>
        </SidebarInset>
        <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
        <ContextPanelOverlay />
      </SidebarProvider>
    </ContextPanelProvider>
  )
}