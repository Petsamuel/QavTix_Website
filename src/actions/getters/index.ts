"use server"

import { cacheLife, cacheTag, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
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
import { resolveCountryLabel } from "@/helper-fns/resolveCountryCode"
import { cookies, headers } from "next/headers"

const REGIONAL_MIN_THRESHOLD = 8

async function getToken(): Promise<string | undefined> {
    const cookiesStore = await cookies()
    return cookiesStore.get("access_token")?.value
}

// ─── raw fetcher — no cache here, callers own caching ────────────────────────

async function apiFetch<T>(url: string, token?: string): Promise<T | null> {
    try {
        const res = await fetch(url, {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        })
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

// ─── user location (never cached — reads request headers) ────────────────────

export async function getUserLocation(): Promise<{ city: string; country: string }> {
    const headersList = await headers()
    const city = headersList.get("x-vercel-ip-city") ?? "Lagos"
    const countryCode = headersList.get("x-vercel-ip-country") ?? "NG"
    return {
        city: decodeURIComponent(city),
        country: resolveCountryLabel(countryCode),
    }
}

// ─── featured events ──────────────────────────────────────────────────────────

export async function getFeaturedEvents(country?: string): Promise<PublicPagesEvent[]> {
    const token = await getToken()
    return _getFeaturedEvents(token, country)
}

async function _getFeaturedEvents(
    token: string | undefined,
    country?: string,
): Promise<PublicPagesEvent[]> {
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_CARDS)

    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        const [regional, global] = await Promise.all([
            apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}?country=${country}`, token),
            apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token),
        ])
        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

// ─── trending events ──────────────────────────────────────────────────────────

export async function getTrendingEvents(country?: string): Promise<PublicPagesEvent[]> {
    const token = await getToken()
    return _getTrendingEvents(token, country)
}

async function _getTrendingEvents(
    token: string | undefined,
    country?: string,
): Promise<PublicPagesEvent[]> {
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_CARDS)

    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        const [regional, global] = await Promise.all([
            apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}?country=${country}`, token),
            apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token),
        ])
        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

// ─── nearby events ────────────────────────────────────────────────────────────

export async function getNearbyEvents(city: string, country?: string): Promise<PublicPagesEvent[]> {
    const token = await getToken()
    return _getNearbyEvents(token, city, country)
}

async function _getNearbyEvents(
    token: string | undefined,
    city: string,
    country?: string,
): Promise<PublicPagesEvent[]> {
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_CARDS)

    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const cityParams = new URLSearchParams({ city })
    const countryParams = country ? new URLSearchParams({ country }) : null

    const [byCity, byCountry, global] = await Promise.all([
        apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${cityParams}`, token),
        countryParams
            ? apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${countryParams}`, token)
            : Promise.resolve(null),
        apiFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}`, token),
    ])

    const cityResults = byCity?.results ?? []
    const countryResults = byCountry?.results ?? []
    const globalResults = global?.results ?? []

    if (cityResults.length >= REGIONAL_MIN_THRESHOLD) return cityResults
    const withCountry = mergeWithFallback(cityResults, countryResults)
    if (withCountry.length >= REGIONAL_MIN_THRESHOLD) return withCountry
    return mergeWithFallback(withCountry, globalResults)
}

// ─── top locations ────────────────────────────────────────────────────────────

export async function getTopLocations(): Promise<TopLocation[]> {
    const token = await getToken()
    return _getTopLocations(token)
}

async function _getTopLocations(token: string | undefined): Promise<TopLocation[]> {
    "use cache"
    cacheLife("hours")  // locations change rarely
    cacheTag(CACHE_TAGS.EVENT_CARDS)

    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await apiFetch<{ data: TopLocation[] }>(`${base}/${TOP_LOCATIONS_ENDPOINT}`, token)
    return data?.data ?? (Array.isArray(data) ? data as TopLocation[] : [])
}

// ─── location page ────────────────────────────────────────────────────────────

export async function getLocationPage(city: string): Promise<{ success: boolean; data?: LocationPageData; message?: string }> {
    const token = await getToken()
    return _getLocationPage(token, city)
}

async function _getLocationPage(
    token: string | undefined,
    city: string,
): Promise<{ success: boolean; data?: LocationPageData; message?: string }> {
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_CARDS)

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
    const token = await getToken()
    return _getEventDetails(token, eventID)
}

async function _getEventDetails(
    token: string | undefined,
    eventID: string,
): Promise<{ success: boolean; data?: EventDetails; message?: string }> {
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_DETAILS)

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
    const token = await getToken()
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
    "use cache"
    cacheLife("minutes")
    cacheTag(CACHE_TAGS.EVENT_DETAILS)

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

// ─── revalidation helpers (call these from mutations) ────────────────────────

export async function revalidateEventCards() {
    revalidateTag(CACHE_TAGS.EVENT_CARDS, "max")
}

export async function revalidateEventDetails() {
    revalidateTag(CACHE_TAGS.EVENT_DETAILS, "max")
}