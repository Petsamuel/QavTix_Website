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
import { cacheTag, cacheLife } from "next/cache"
import { cookies, headers } from "next/headers"

const REGIONAL_MIN_THRESHOLD = 8


async function getToken(): Promise<string | undefined> {
    const cookiesStore = await cookies()
    return cookiesStore.get("access_token")?.value
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


async function fetchEventCards(url: string, token?: string): Promise<any> {
    "use cache"
    cacheTag(CACHE_TAGS.EVENT_CARDS)
    cacheLife("minutes")

    const res = await fetch(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    })
    if (!res.ok) {
        console.log("[fetchEventCards] failed:", url, res.status)
        return null
    }
    const json = await res.json()
    return json.data ?? json
}

async function fetchWithTag(url: string, tag: string, token?: string, life: string = "minutes"): Promise<any> {
    "use cache"
    cacheTag(tag)
    cacheLife(life as any)

    const res = await fetch(url, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    })
    if (!res.ok) {
        console.log("[fetchWithTag] failed:", url, res.status)
        return null
    }
    const json = await res.json()
    return json.data ?? json
}


function mergeWithFallback(
    regional: PublicPagesEvent[],
    global: PublicPagesEvent[],
): PublicPagesEvent[] {
    const seenIds = new Set(regional.map(e => e.id))
    const extras = global.filter(e => !seenIds.has(e.id))
    return [...regional, ...extras]
}


export async function getFeaturedEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    if (country) {
        const [regional, global] = await Promise.all([
            fetchEventCards(`${base}/${FEATURED_EVENTS_ENDPOINT}?country=${country}`, token),
            fetchEventCards(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token),
        ])
        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await fetchEventCards(`${base}/${FEATURED_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

export async function getTrendingEvents(country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    if (country) {
        const [regional, global] = await Promise.all([
            fetchEventCards(`${base}/${TRENDING_EVENTS_ENDPOINT}?country=${country}`, token),
            fetchEventCards(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token),
        ])
        const regionalResults = regional?.results ?? []
        const globalResults = global?.results ?? []
        if (regionalResults.length >= REGIONAL_MIN_THRESHOLD) return regionalResults
        return mergeWithFallback(regionalResults, globalResults)
    }

    const data = await fetchEventCards(`${base}/${TRENDING_EVENTS_ENDPOINT}`, token)
    return data?.results ?? []
}

export async function getNearbyEvents(city: string, country?: string): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const token = await getToken()

    const [byCity, byCountry, global] = await Promise.all([
        fetchEventCards(`${base}/${EVENTS_NEARBY_ENDPOINT}?city=${city}`, token),
        country
            ? fetchEventCards(`${base}/${EVENTS_NEARBY_ENDPOINT}?country=${country}`, token)
            : Promise.resolve(null),
        fetchEventCards(`${base}/${EVENTS_NEARBY_ENDPOINT}`, token),
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
    const data = await fetchEventCards(`${base}/${TOP_LOCATIONS_ENDPOINT}`, token)
    return data?.data ?? (Array.isArray(data) ? data : [])
}

export async function getLocationPage(city: string): Promise<{ success: boolean; data?: LocationPageData; message?: string }> {
    "use cache"
    cacheTag(CACHE_TAGS.EVENT_CARDS)
    cacheLife("minutes")
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOCATION_PAGE_ENDPOINT.replace("[loc]", city)}`
        )
        const json = await res.json()
        if (!res.ok) return { success: false, message: json.message ?? "Failed to load location data." }
        return { success: true, data: json.data }
    } catch {
        return { success: false, message: "Request failed." }
    }
}

export async function getEventDetails(eventID: string): Promise<{ success: boolean; data?: EventDetails; message?: string }> {
    "use cache"
    cacheTag(CACHE_TAGS.EVENT_DETAILS)
    cacheTag(`event-${eventID}`)
    cacheLife("hours")

    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url)
        const json = await res.json()
        if (!res.ok) return { success: false, message: handleApiError(json) }
        return { success: true, data: json.data ?? json }
    } catch {
        return { success: false, message: "Failed to load event details." }
    }
}

export async function getMarketplaceEventDetails(eventID: string): Promise<{
    success: boolean
    data?: MarketplaceEventDetails
    message?: string
    statusCode?: number
    errorCode?: string | number | null
}> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${MARKETPLACE_EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`

        const res = await fetch(url, {
            cache: "no-store",
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        })

        const json = await res.json()
        if (!res.ok) {
            return {
                success: false,
                message: handleApiError(json),
                statusCode: res.status,
                errorCode: json.code || json.error_code || null,
            }
        }
        return { success: true, data: json.data ?? json }
    } catch {
        return { success: false, message: "Failed to load marketplace event details.", statusCode: 500 }
    }
}