import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions, COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from '@/endpoints'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Pages that browsers hit while not yet signed in.
// A host with a valid host_access_token visiting these
// should be bounced straight to their dashboard.
const AUTH_PAGE_PATTERNS = [
    /^\/sign-in/,
    /^\/sign-up/,
    /^\/login/,
    /^\/register/,
]

function isAuthPage(pathname: string) {
    return AUTH_PAGE_PATTERNS.some((pattern) => pattern.test(pathname))
}

async function verifyToken(token: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE_URL}/${TOKEN_VERIFY_ENDPOINT}`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ token }),
        })
        return res.ok
    } catch {
        return false
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const response = NextResponse.next()

    // ── Region / currency detection ───────────────────────────────────────
    const hasRegion   = request.cookies.has(COOKIE_KEYS.USER_REGION)
    const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

    if (!hasRegion || !hasCurrency) {
        const country =
            request.headers.get('x-vercel-ip-country') ||
            request.headers.get('cf-ipcountry') ||
            'NG'

        const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION

        const regionCookieOptions = {
            path:     '/',
            maxAge:   365 * 24 * 60 * 60,
            sameSite: 'lax' as const,
            secure:   process.env.NODE_ENV === 'production',
        }

        if (!hasRegion)
            response.cookies.set(COOKIE_KEYS.USER_REGION,   JSON.stringify(detected.region),   regionCookieOptions)
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
            const hostTokenValid = await verifyToken(hostAccessToken)

            if (hostTokenValid) {
                const hostSite = process.env.NEXT_PUBLIC_HOST_SITE ?? '/'
                return NextResponse.redirect(hostSite)
            }

            // Token present but invalid — clear stale host cookies and continue
            const cleared = NextResponse.next()
            cleared.cookies.delete('host_access_token')
            cleared.cookies.delete('host_refresh_token')
            return cleared
        }
    }

    // ── Attendee token management ─────────────────────────────────────────
    // The proxy only ever manages attendee tokens. Host cookies are ignored.
    const accessToken  = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (accessToken) {
        const valid = await verifyToken(accessToken)
        if (valid) return response
        // Fall through to refresh if invalid
    }

    if (refreshToken) {
        try {
            const refreshRes = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ refresh: refreshToken }),
            })

            if (refreshRes.ok) {
                const { data } = await refreshRes.json()
                response.cookies.set('access_token', data.access, accessCookieOptions)
                return response
            }

            // Refresh failed — clear the dead attendee session
            response.cookies.delete('access_token')
            response.cookies.delete('refresh_token')
            return response

        } catch {
            return response
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}