import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useIsDesktop } from "@/hooks/use-is-desktop"
import { useIsMobile } from "@/hooks/use-mobile"

export type ContextPanelTab = {
  value: string
  label: string
  content: React.ReactNode
}

type ContextPanelState = {
  isOpen: boolean
  tabs: ContextPanelTab[]
  activeTab: string | undefined
  open: (tabs: ContextPanelTab[], activeTab?: string) => void
  close: () => void
  setActiveTab: (value: string) => void
}

const ContextPanelContext = React.createContext<ContextPanelState | null>(null)

export function useContextPanel() {
  const ctx = React.useContext(ContextPanelContext)
  if (!ctx) {
    throw new Error("useContextPanel must be used within a ContextPanelProvider.")
  }
  return ctx
}

export function ContextPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [tabs, setTabs] = React.useState<ContextPanelTab[]>([])
  const [activeTab, setActiveTabState] = React.useState<string | undefined>(undefined)

  const open = React.useCallback((newTabs: ContextPanelTab[], initialTab?: string) => {
    setTabs(newTabs)
    setActiveTabState(initialTab ?? newTabs[0]?.value)
    setIsOpen(true)
  }, [])

  const close = React.useCallback(() => setIsOpen(false), [])
  const setActiveTab = React.useCallback((value: string) => setActiveTabState(value), [])

  const value = React.useMemo(
    () => ({ isOpen, tabs, activeTab, open, close, setActiveTab }),
    [isOpen, tabs, activeTab, open, close, setActiveTab]
  )

  return <ContextPanelContext.Provider value={value}>{children}</ContextPanelContext.Provider>
}

// Shared between the desktop pane and the overlay — tabs only render once
// `open()` has actually been called, so `activeTab` is guaranteed defined here.
function ContextPanelTabs({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: ContextPanelTab[]
  activeTab: string | undefined
  onTabChange: (value: string) => void
}) {
  if (tabs.length === 0) return null

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="flex h-full flex-col">
      <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-2">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="flex-1 overflow-auto p-4">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

// Desktop (≥1280): persistent pane, rendered inline in the shell.
export function ContextPanelDesktopSlot() {
  const { isOpen, tabs, activeTab, setActiveTab } = useContextPanel()
  const isDesktop = useIsDesktop()

  if (!isDesktop || !isOpen) return null

  return (
    <aside className="w-80 shrink-0 border-l bg-background">
      <ContextPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
    </aside>
  )
}

// Tablet (768-1279) + mobile (<768): overlay via Sheet. Mobile gets a
// near-full-width overlay per spec Section 19; tablet gets a drawer width.
export function ContextPanelOverlay() {
  const { isOpen, tabs, activeTab, setActiveTab, close } = useContextPanel()
  const isDesktop = useIsDesktop()
  const isMobile = useIsMobile()

  if (isDesktop) return null

  return (
    <Sheet open={isOpen} onOpenChange={(next) => !next && close()}>
      <SheetContent
        side="right"
        className={isMobile ? "w-full sm:max-w-full!" : "w-96 sm:max-w-96!"}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Context panel</SheetTitle>
        </SheetHeader>
        <ContextPanelTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </SheetContent>
    </Sheet>
  )
}