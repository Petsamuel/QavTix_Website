import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_KEYS } from '@/components-data/cookie-keys'
import { DEFAULT_LOCATION, REGION_CURRENCY_MAP } from '@/components-data/settings.data'

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // 1. Check if cookies already exist
  const hasRegion = request.cookies.has(COOKIE_KEYS.USER_REGION)
  const hasCurrency = request.cookies.has(COOKIE_KEYS.USER_CURRENCY)

  if (!hasRegion || !hasCurrency) {
    const country = request.headers.get('x-vercel-ip-country') || 
                    request.headers.get('cf-ipcountry') || 
                    'NG'

    const detected = REGION_CURRENCY_MAP[country] || DEFAULT_LOCATION

    const cookieOptions = {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax' as const,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }

    if (!hasRegion) {
      response.cookies.set(COOKIE_KEYS.USER_REGION, JSON.stringify(detected.region), cookieOptions)
    }
    if (!hasCurrency) {
      response.cookies.set(COOKIE_KEYS.USER_CURRENCY, JSON.stringify(detected.currency), cookieOptions)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}