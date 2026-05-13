import {
    FEATURED_EVENTS_ENDPOINT,
    EVENTS_NEARBY_ENDPOINT,
    TOP_LOCATIONS_ENDPOINT,
    LOCATION_PAGE_ENDPOINT,
    TRENDING_EVENTS_ENDPOINT,
    EVENT_DETAILS_ENDPOINT,
    MARKETPLACE_EVENT_DETAILS_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getAuthToken } from "@/helper-fns/getAuthToken"
import { CACHE_TAGS } from "@/cache-tags"

const REGIONAL_MIN_THRESHOLD = 8

// ─── raw fetcher — public vs authenticated ─────────────────────────────────────
// Public fetches are ISR-cached for 60 s (shared across all users — fast!).
// Authenticated fetches always go to the origin so users see their own data.

async function apiFetch<T>(url: string, token?: string): Promise<T | null> {
    try {
        const res = await fetch(url, token
            ? {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            }
            : {
                next: { revalidate: 60, tags: [CACHE_TAGS.EVENT_CARDS] },
            }
        )
        if (!res.ok) {
            console.log("[apiFetch] failed:", url, res.status)
            return null
        }
        const json = await res.json()
        return json.data ?? json
    } catch (err) {
        console.log("[apiFetch] error:", url, err)
        return null
    }
}

function mergeWithFallback(
    regional: PublicPagesEvent[],
    global: PublicPagesEvent[],
): PublicPagesEvent[] {
    const seenIds = new Set(regional.map(e => e.id))
    const extras = global.filter(e => !seenIds.has(e.id))
    return [...regional, ...extras]
}

// ─── featured events ──────────────────────────────────────────────────────────

export async function getFeaturedEvents(country?: string): Promise<PublicPagesEvent[]> {
    const token = await getAuthToken()
    return _getFeaturedEvents(token, country)
}

async function _getFeaturedEvents(
    token: string | undefined,
    country?: string,
): Promise<PublicPagesEvent[]> {

    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        // Fetch regional first — only call global if regional is sparse
        const regional = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${FEATURED_EVENTS_ENDPOINT}?country=${country}`, token
        )
        const regionalResults = regional?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults

        // Not enough regional results — supplement with global
        const global = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${FEATURED_EVENTS_ENDPOINT}`, token
        )
        return mergeWithFallback(regionalResults, global?.results ?? [])
    }

    const data = await apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

// ─── trending events ──────────────────────────────────────────────────────────

export async function getTrendingEvents(country?: string): Promise<PublicPagesEvent[]> {
    const token = await getAuthToken()
    return _getTrendingEvents(token, country)
}

async function _getTrendingEvents(
    token: string | undefined,
    country?: string,
): Promise<PublicPagesEvent[]> {

    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        const regional = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${TRENDING_EVENTS_ENDPOINT}?country=${country}`, token
        )
        const regionalResults = regional?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults

        const global = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${TRENDING_EVENTS_ENDPOINT}`, token
        )
        return mergeWithFallback(regionalResults, global?.results ?? [])
    }

    const data = await apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

// ─── nearby events ────────────────────────────────────────────────────────────

export async function getNearbyEvents(city: string, country?: string): Promise<PublicPagesEvent[]> {
    const token = await getAuthToken()
    return _getNearbyEvents(token, city, country)
}

async function _getNearbyEvents(
    token: string | undefined,
    city: string,
    country?: string,
): Promise<PublicPagesEvent[]> {

    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    // Fetch by city first — most specific
    const byCity = await apiFetch<{ results: PublicPagesEvent[] }>(
        `${base}/${EVENTS_NEARBY_ENDPOINT}?city=${encodeURIComponent(city)}`, token
    )
    const cityResults = byCity?.results ?? []
    if (cityResults.length >= REGIONAL_MIN_THRESHOLD) return cityResults

    // Not enough — try country
    if (country) {
        const byCountry = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${EVENTS_NEARBY_ENDPOINT}?country=${encodeURIComponent(country)}`, token
        )
        const countryResults = byCountry?.results ?? []
        const withCountry = mergeWithFallback(cityResults, countryResults)
        if (withCountry.length >= REGIONAL_MIN_THRESHOLD) return withCountry

        // Still not enough — global fallback
        const global = await apiFetch<{ results: PublicPagesEvent[] }>(
            `${base}/${EVENTS_NEARBY_ENDPOINT}`, token
        )
        return mergeWithFallback(withCountry, global?.results ?? [])
    }

    // No country given — go straight to global
    const global = await apiFetch<{ results: PublicPagesEvent[] }>(
        `${base}/${EVENTS_NEARBY_ENDPOINT}`, token
    )
    return mergeWithFallback(cityResults, global?.results ?? [])
}

// ─── top locations ────────────────────────────────────────────────────────────

export async function getTopLocations(): Promise<TopLocation[]> {
    const token = await getAuthToken()
    return _getTopLocations(token)
}

async function _getTopLocations(token: string | undefined): Promise<TopLocation[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await apiFetch<{ data: TopLocation[] }>(`${base}/${TOP_LOCATIONS_ENDPOINT}`, token)
    return data?.data ?? (Array.isArray(data) ? data as TopLocation[] : [])
}

// ─── location page ────────────────────────────────────────────────────────────

export async function getLocationPage(city: string): Promise<{ success: boolean; data?: LocationPageData; message?: string }> {
    const token = await getAuthToken()
    return _getLocationPage(token, city)
}

async function _getLocationPage(
    token: string | undefined,
    city: string,
): Promise<{ success: boolean; data?: LocationPageData; message?: string }> {

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOCATION_PAGE_ENDPOINT.replace("[loc]", city)}`,
            { headers: { ...(token && { Authorization: `Bearer ${token}` }) } },
        )
        const json = await res.json()
        if (!res.ok) return { success: false, message: json.message ?? "Failed to load location data." }
        return { success: true, data: json.data }
    } catch {
        return { success: false, message: "Request failed." }
    }
}

// ─── event details ────────────────────────────────────────────────────────────

export async function getEventDetails(eventID: string): Promise<{ success: boolean; data?: EventDetails; message?: string }> {
    const token = await getAuthToken()
    return _getEventDetails(token, eventID)
}

async function _getEventDetails(
    token: string | undefined,
    eventID: string,
): Promise<{ success: boolean; data?: EventDetails; message?: string }> {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url, {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        })
        const json = await res.json()
        if (!res.ok) return { success: false, message: handleApiError(json) }
        return { success: true, data: json.data ?? json }
    } catch {
        return { success: false, message: "Failed to load event details." }
    }
}

// ─── marketplace event details ────────────────────────────────────────────────

export async function getMarketplaceEventDetails(eventID: string): Promise<{
    success: boolean
    data?: MarketplaceEventDetails
    message?: string
    statusCode?: number
    errorCode?: string | number | null
}> {
    const token = await getAuthToken()
    return _getMarketplaceEventDetails(token, eventID)
}

async function _getMarketplaceEventDetails(
    token: string | undefined,
    eventID: string,
): Promise<{
    success: boolean
    data?: MarketplaceEventDetails
    message?: string
    statusCode?: number
    errorCode?: string | number | null
}> {

    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${MARKETPLACE_EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url, {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        })
        const json = await res.json()
        if (!res.ok) return {
            success: false,
            message: handleApiError(json),
            statusCode: res.status,
            errorCode: json.code || json.error_code || null,
        }
        return { success: true, data: json.data ?? json }
    } catch {
        return { success: false, message: "Failed to load marketplace event details.", statusCode: 500 }
    }
}
