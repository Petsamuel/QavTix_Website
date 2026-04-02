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

async function publicFetch<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, { next: { revalidate: 60 * 10 } })
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

// Deduplicates two arrays by event id — regional results take priority
function mergeWithFallback(
    regional: PublicPagesEvent[],
    global:   PublicPagesEvent[],
): PublicPagesEvent[] {
    const seenIds = new Set(regional.map(e => e.id))
    const extras  = global.filter(e => !seenIds.has(e.id))
    return [...regional, ...extras]
}

export async function getUserLocation(): Promise<{ city: string; country: string }> {
    const headersList = await headers()
    const city        = headersList.get("x-vercel-ip-city")    ?? "Lagos"
    const countryCode = headersList.get("x-vercel-ip-country") ?? "NG"

    return {
        city:    decodeURIComponent(city),
        country: resolveCountryLabel(countryCode),
    }
}

// Featured Events
export async function getFeaturedEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        const [regional, global] = await Promise.all([
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}?country=${country}`),
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`),
        ])

        const regionalResults = regional?.results ?? []
        const globalResults   = global?.results   ?? []

        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`)
    return data?.results ?? []
}

// Trending Events
export async function getTrendingEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    if (country) {
        const [regional, global] = await Promise.all([
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}?country=${country}`),
            publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`),
        ])

        const regionalResults = regional?.results ?? []
        const globalResults   = global?.results   ?? []

        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`)
    return data?.results ?? []
}

// Nearby Events
// Nearby already filters by city — fall back to country, then global
export async function getNearbyEvents(city: string, country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL

    const cityParams    = new URLSearchParams({ city })
    const countryParams = country ? new URLSearchParams({ country }) : null

    const [byCity, byCountry, global] = await Promise.all([
        publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${cityParams}`),
        countryParams
            ? publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}?${countryParams}`)
            : Promise.resolve(null),
        publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${EVENTS_NEARBY_ENDPOINT}`),
    ])

    const cityResults    = byCity?.results    ?? []
    const countryResults = byCountry?.results ?? []
    const globalResults  = global?.results    ?? []

    // City results are sufficient
    if (cityResults.length >= REGIONAL_MIN_THRESHOLD) return cityResults

    // City thin — pad with country results
    const withCountry = mergeWithFallback(cityResults, countryResults)
    if (withCountry.length >= REGIONAL_MIN_THRESHOLD) return withCountry

    // Still thin — pad with global
    return mergeWithFallback(withCountry, globalResults)
}

// Top Locations
export async function getTopLocations(): Promise<TopLocation[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await publicFetch<{ data: TopLocation[] }>(`${base}/${TOP_LOCATIONS_ENDPOINT}`)
    return data?.data ?? (Array.isArray(data) ? data : [])
}

// Location Page
interface LocationPageResult {
    success:  boolean
    data?:    LocationPageData
    message?: string
}

export async function getLocationPage(city: string): Promise<LocationPageResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOCATION_PAGE_ENDPOINT.replace("[loc]", city)}`,
            { next: { revalidate: 60 * 5 } }
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

// Event Details
interface GetEventDetailsResult {
    success:  boolean
    data?:    EventDetails
    message?: string
}

export async function getEventDetails(eventID: string): Promise<GetEventDetailsResult> {
    try {
        const cookiesStore = await cookies()
        const token        = cookiesStore.get("access_token")?.value

        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url, {
            cache:   "no-store",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            next: { tags: [CACHE_TAGS.EVENT_DETAILS] },
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
    success:  boolean
    data?:    MarketplaceEventDetails
    message?: string
    statusCode?: number;
    errorCode?: string | number | null;
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
                errorCode: json.code || json.error_code || null 
            }
        }

        return { 
            success: true, 
            data: json.data ?? json 
        }

    } catch (err) {
        console.log("[getMarketplaceEventDetails] error:", err)
        return { 
            success: false, 
            message: "Failed to load marketplace event details.",
            statusCode: 500
        }
    }
}