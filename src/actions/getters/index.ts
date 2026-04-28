"use server"

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

async function publicFetch<T>(url: string, token?: string, tags?: string[]): Promise<T | null> {
    try {
        const res = await fetch(url, {
            cache: "force-cache",
            next: {
                revalidate: 60 * 10,
                ...(tags?.length ? { tags } : {}),
            },
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        })
        if (!res.ok) {
            console.log("[publicFetch] failed:", url, res.status)
            return null
        }
        const json = await res.json()
        return json.data ?? json
    } catch (err) {
        console.log("[publicFetch] error:", url, err)
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

export async function getUserLocation(): Promise<{ city: string; country: string }> {
    const headersList = await headers()
    const city = headersList.get("x-vercel-ip-city") ?? "Lagos"
    const countryCode = headersList.get("x-vercel-ip-country") ?? "NG"

    return {
        city: decodeURIComponent(city),
        country: resolveCountryLabel(countryCode),
    }
}

export async function getFeaturedEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    if (country) {
        const [regional, global] = await Promise.all([
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}?country=${country}`, token, [CACHE_TAGS.EVENT_CARDS]),
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS]),
        ])

        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []

        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS])
    return data?.results ?? []
}

export async function getTrendingEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    if (country) {
        const [regional, global] = await Promise.all([
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}?country=${country}`, token, [CACHE_TAGS.EVENT_CARDS]),
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS]),
        ])

        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []

        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS])
    return data?.results ?? []
}

export async function getNearbyEvents(city: string, country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    const cityParams = new URLSearchParams({ city })
    const countryParams = country ? new URLSearchParams({ country }) : null

    const [byCity, byCountry, global] = await Promise.all([
        publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${cityParams}`, token, [CACHE_TAGS.EVENT_CARDS]),
        countryParams
            ? publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${countryParams}`, token, [CACHE_TAGS.EVENT_CARDS])
            : Promise.resolve(null),
        publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS]),
    ])

    const cityResults = byCity?.results ?? []
    const countryResults = byCountry?.results ?? []
    const globalResults = global?.results ?? []

    if (cityResults.length >= REGIONAL_MIN_THRESHOLD) return cityResults

    const withCountry = mergeWithFallback(cityResults, countryResults)
    if (withCountry.length >= REGIONAL_MIN_THRESHOLD) return withCountry

    return mergeWithFallback(withCountry, globalResults)
}

export async function getTopLocations(): Promise<TopLocation[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()
    const data = await publicFetch<{ data: TopLocation[] }>(`${base}/${TOP_LOCATIONS_ENDPOINT}`, token, [CACHE_TAGS.EVENT_CARDS])
    return data?.data ?? (Array.isArray(data) ? data : [])
}

interface LocationPageResult {
    success: boolean
    data?: LocationPageData
    message?: string
}

export async function getLocationPage(city: string): Promise<LocationPageResult> {
    try {
        const token = await getToken()
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOCATION_PAGE_ENDPOINT.replace("[loc]", city)}`,
            {
                next: { revalidate: 60 * 5 },
                headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.log("[getLocationPage] status:", res.status, JSON.stringify(json))
            return { success: false, message: json.message ?? "Failed to load location data." }
        }

        return { success: true, data: json.data }

    } catch (err) {
        console.log("[getLocationPage] error:", err)
        return { success: false, message: "Request failed." }
    }
}

interface GetEventDetailsResult {
    success: boolean
    data?: EventDetails
    message?: string
}

export async function getEventDetails(eventID: string): Promise<GetEventDetailsResult> {
    try {
        const cookiesStore = await cookies()
        const token = cookiesStore.get("access_token")?.value

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url, {
            cache: "force-cache",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            next: { tags: [CACHE_TAGS.EVENT_DETAILS], revalidate: 600 },
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[getEventDetails] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getEventDetails] error:", err)
        return { success: false, message: "Failed to load event details." }
    }
}

interface GetMarketplaceEventDetailsResult {
    success: boolean
    data?: MarketplaceEventDetails
    message?: string
    statusCode?: number
    errorCode?: string | number | null
}

export async function getMarketplaceEventDetails(eventID: string): Promise<GetMarketplaceEventDetailsResult> {
    try {
        const cookiesStore = await cookies()
        const token = cookiesStore.get("access_token")?.value

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${MARKETPLACE_EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`

        const res = await fetch(url, {
            cache: "no-store",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            next: { tags: [CACHE_TAGS.EVENT_DETAILS] },
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[getMarketplaceEventDetails] status:", res.status, JSON.stringify(json))
            return {
                success: false,
                message: handleApiError(json),
                statusCode: res.status,
                errorCode: json.code || json.error_code || null,
            }
        }

        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getMarketplaceEventDetails] error:", err)
        return {
            success: false,
            message: "Failed to load marketplace event details.",
            statusCode: 500,
        }
    }
}