import * as Y from "yjs"
import type { Socket } from "socket.io-client"

type BinaryPayload = ArrayBuffer | Uint8Array

// Browsers receive Socket.IO binary as ArrayBuffer; Node receives Buffer (a Uint8Array).
// Yjs needs a Uint8Array, so normalize before any Y.applyUpdate call.
function toUint8Array(data: BinaryPayload): Uint8Array {
  return data instanceof Uint8Array ? data : new Uint8Array(data)
}

export class SocketYjsProvider {
  public ydoc: Y.Doc
  private socket: Socket
  private documentId: string
  private joined = false
  private updateHandler: (update: Uint8Array, origin: unknown) => void
  private remoteHandler: (update: BinaryPayload) => void
  private onStatusChange: (status: "connecting" | "synced" | "error", error?: string) => void

  constructor(
    socket: Socket,
    documentId: string,
    ydoc: Y.Doc,
    onStatusChange: (status: "connecting" | "synced" | "error", error?: string) => void
  ) {
    this.socket = socket
    this.documentId = documentId
    this.ydoc = ydoc
    this.onStatusChange = onStatusChange

    // Local edits -> network. Skip anything whose origin is this provider —
    // that means it came FROM the network already, and re-sending it would
    // create the exact echo loop this pattern exists to prevent.
    this.updateHandler = (update, origin) => {
      console.log("[yjs] local update fired, origin match?", origin === this, "joined?", this.joined)
      if (origin === this) return
      if (!this.joined) return
      this.socket.emit("document:update", this.documentId, update)
    }
    this.ydoc.on("update", this.updateHandler)

    // Network -> local doc, explicitly tagged with this provider as origin
    // so the handler above correctly ignores rebroadcasting it.
    this.remoteHandler = (update: BinaryPayload) => {
      const bytes = toUint8Array(update)
      console.log("[yjs] remote update received, byte length:", bytes.byteLength)
      Y.applyUpdate(this.ydoc, bytes, this)
    }
    this.socket.on("document:update", this.remoteHandler)

    this.socket.on("connect", this.rejoin)
  }

  private rejoin = () => {
    // Same discipline as chat/whiteboard: no socket.recovered reliance,
    // explicit re-join on every reconnect, not just the first connect.
    this.join()
  }

  join() {
    this.onStatusChange("connecting")
    this.socket.emit(
      "document:join",
      this.documentId,
      (res: { success: true; state: BinaryPayload } | { success: false; error: string }) => {
        if (!res.success) {
          this.joined = false
          this.onStatusChange("error", res.error)
          return
        }
        Y.applyUpdate(this.ydoc, toUint8Array(res.state), this)
        this.joined = true
        this.onStatusChange("synced")
        console.log("[yjs] joined successfully, documentId:", this.documentId)

        const localState = Y.encodeStateAsUpdate(this.ydoc)
        this.socket.emit("document:update", this.documentId, localState)
      }
    )
  }

  destroy() {
    this.socket.emit("document:leave", this.documentId)
    this.socket.off("document:update", this.remoteHandler)
    this.socket.off("connect", this.rejoin)
    this.ydoc.off("update", this.updateHandler)
    this.joined = false
  }
}