import { io, Socket } from "socket.io-client"
import { env } from "@/config/env"

let socket: Socket | null = null
let connectedToken: string | null = null

export function getSocket() {
  return socket
}

export function ensureSocketConnected(token: string) {
  if (socket && connectedToken === token) return socket
  if (socket) socket.disconnect()
  connectedToken = token
  socket = io(env.VITE_API_URL, { auth: { token } })
  return socket
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
  connectedToken = null
}