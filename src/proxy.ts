import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions, COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from '@/endpoints'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export async function proxy(request: NextRequest) {
  const response = NextResponse.next()

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

    if (!hasRegion)   response.cookies.set(COOKIE_KEYS.USER_REGION,   JSON.stringify(detected.region),   regionCookieOptions)
    if (!hasCurrency) response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), regionCookieOptions)
  }

  const accessToken  = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (accessToken) {
    try {
      const verifyRes = await fetch(`${API_BASE_URL}/${TOKEN_VERIFY_ENDPOINT}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      })

      if (verifyRes.ok) return response

    } catch {
      // Network error — fall through to refresh
    }
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

      response.cookies.delete('access_token')
      response.cookies.delete('refresh_token')
      return response
    } catch {
      return response;
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}