import { create } from "zustand"

type PresenceState = {
  onlineUserIds: Set<string>
  setOnlineUsers: (ids: string[]) => void
  addOnlineUser: (id: string) => void
  removeOnlineUser: (id: string) => void
  clear: () => void
}

export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUserIds: new Set(),
  setOnlineUsers: (ids) => set({ onlineUserIds: new Set(ids) }),
  addOnlineUser: (id) =>
    set((state) => ({ onlineUserIds: new Set(state.onlineUserIds).add(id) })),
  removeOnlineUser: (id) =>
    set((state) => {
      const next = new Set(state.onlineUserIds)
      next.delete(id)
      return { onlineUserIds: next }
    }),
  clear: () => set({ onlineUserIds: new Set() }),
}))