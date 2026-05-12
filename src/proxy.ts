import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions, COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'
import { REFRESH_TOKEN_ENDPOINT } from '@/endpoints'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const AUTH_PAGE_PATTERNS = [
    /^\/sign-in/,
    /^\/sign-up/,
    /^\/login/,
    /^\/register/,
]

function isAuthPage(pathname: string) {
    return AUTH_PAGE_PATTERNS.some((pattern) => pattern.test(pathname))
}

/**
 * Decodes a JWT and checks if it's expired or close to expiring.
 * Returns true if expired or invalid.
 */
function isTokenExpiredLocally(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1]
        if (!payloadBase64) return true

        const decoded = JSON.parse(atob(payloadBase64))
        const exp = decoded.exp
        if (!exp) return true

        // Return true if token expires in less than 30 seconds
        const currentTime = Math.floor(Date.now() / 1000)
        return exp < currentTime + 30
    } catch {
        return true
    }
}

async function refreshAccessToken(
    refreshToken: string,
): Promise<{ success: true; accessToken: string } | { success: false; networkError: boolean }> {
    try {
        const res = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        })

        if (res.ok) {
            const { data } = await res.json()
            return { success: true, accessToken: data.access }
        }

        return { success: false, networkError: false }
    } catch {
        return { success: false, networkError: true }
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const response = NextResponse.next()

    // ── Region / currency detection ───────────────────────────────────────
    const hasRegion = request.cookies.has(COOKIE_KEYS.USER_REGION)
    const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

    if (!hasRegion || !hasCurrency) {
        const country =
            request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') ||
            'NG'

        const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION

        const regionCookieOptions = {
            path: '/',
            maxAge: 365 * 24 * 60 * 60,
            sameSite: 'lax' as const,
            secure: process.env.NODE_ENV === 'production',
        }

        if (!hasRegion)
            response.cookies.set(COOKIE_KEYS.USER_REGION, JSON.stringify(detected.region), regionCookieOptions)
        if (!hasCurrency)
            response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), regionCookieOptions)
    }

    // ── Host token check ──────────────────────────────────────────────────
    // Hosts are never authenticated on the public website. Their tokens
    // are stored under separate cookie names so they never collide with
    // attendee sessions. The only thing we do here is redirect a host
    // who is already signed in away from auth pages — no point making
    // them log in again.
    if (isAuthPage(pathname)) {
        const hostAccessToken = request.cookies.get('host_access_token')?.value

        if (hostAccessToken) {
            if (!isTokenExpiredLocally(hostAccessToken)) {
                const hostSite = process.env.NEXT_PUBLIC_HOST_SITE ?? '/'
                return NextResponse.redirect(hostSite)
            }

            // Token present but expired — clear stale host cookies and continue
            const cleared = NextResponse.next()
            cleared.cookies.delete('host_access_token')
            cleared.cookies.delete('host_refresh_token')
            return cleared
        }
    }

    // ── Attendee token management ─────────────────────────────────────────
    // The proxy only ever manages attendee tokens. Host cookies are ignored.
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    // Access token exists and is still valid — fast path, no network call
    if (accessToken && !isTokenExpiredLocally(accessToken)) {
        return response
    }

    // Access token missing or expiring — try refresh
    if (refreshToken) {
        // Don't bother calling the API if the refresh token is also expired
        if (isTokenExpiredLocally(refreshToken)) {
            response.cookies.delete('access_token')
            response.cookies.delete('refresh_token')
            return response
        }

        const result = await refreshAccessToken(refreshToken)

        if (result.success) {
            response.cookies.set('access_token', result.accessToken, accessCookieOptions)
            return response
        }

        if (result.networkError) return response  // backend down — let them through

        // Refresh failed with a server error — clear the dead attendee session
        response.cookies.delete('access_token')
        response.cookies.delete('refresh_token')
        return response
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}