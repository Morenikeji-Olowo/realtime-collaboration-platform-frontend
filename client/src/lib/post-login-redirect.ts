const KEY = "post_login_redirect"

export function setPostLoginRedirect(path: string) {
  try { localStorage.setItem(KEY, path) } catch {}
}

export function consumePostLoginRedirect(): string | null {
  try {
    const value = localStorage.getItem(KEY)
    if (value) localStorage.removeItem(KEY)
    return value
  } catch { return null }
}