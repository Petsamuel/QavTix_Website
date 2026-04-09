const ALLOWED_ORIGINS = [
    process.env.NEXT_PUBLIC_HOST_SITE,
    process.env.NEXT_PUBLIC_ATTENDEE_SITE,
].filter(Boolean) as string[]

// Extensions that should never be redirect destinations
const BLOCKED_EXTENSIONS = [
    ".ico", ".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp",
    ".css", ".js", ".woff", ".woff2", ".ttf", ".eot",
    ".pdf", ".zip", ".map",
]

export const validateReturnTo = (returnTo: string | null): string | null => {
    if (!returnTo) return null

    let parsed: URL
    try {
        parsed = new URL(returnTo)
    } catch {
        // Not an absolute URL — reject it (no relative paths accepted)
        return null
    }

    // Must be https (or http in dev)
    const isDev = process.env.NODE_ENV === "development"
    const allowedProtocols = isDev ? ["https:", "http:"] : ["https:"]
    if (!allowedProtocols.includes(parsed.protocol)) return null

    // Origin must exactly match one of the allowed sites
    const originAllowed = ALLOWED_ORIGINS.some(
        (site) => new URL(site).origin === parsed.origin
    )
    if (!originAllowed) return null

    // Reject public assets
    const ext = parsed.pathname.toLowerCase().split(".").pop()
    if (ext && BLOCKED_EXTENSIONS.some((e) => parsed.pathname.toLowerCase().endsWith(e))) {
        return null
    }

    // Reject API routes, _next internals, and common static folders
    const blockedPrefixes = ["/api/", "/_next/", "/static/", "/public/", "/favicon"]
    if (blockedPrefixes.some((prefix) => parsed.pathname.startsWith(prefix))) {
        return null
    }

    // Sanitize - return only origin + pathname + search, drop hash and any extra
    return `${parsed.origin}${parsed.pathname}${parsed.search}`
}