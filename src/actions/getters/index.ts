import {
    FEATURED_EVENTS_ENDPOINT,
    EVENTS_NEARBY_ENDPOINT,
    TOP_LOCATIONS_ENDPOINT,
    LOCATION_PAGE_ENDPOINT,
    TRENDING_EVENTS_ENDPOINT,
    EVENT_DETAILS_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { headers } from "next/headers"

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

export async function getFeaturedEvents(): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${FEATURED_EVENTS_ENDPOINT}`)
    return data?.results ?? []
}

export async function getTrendingEvents(): Promise<PublicPagesEvent[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await publicFetch<{ results: PublicPagesEvent[] }>(`${base}/${TRENDING_EVENTS_ENDPOINT}`)
    return data?.results ?? []
}

export async function getNearbyEvents(city: string): Promise<PublicPagesEvent[]> {
    const base   = process.env.NEXT_PUBLIC_API_BASE_URL
    const params = new URLSearchParams({ city })
    const data   = await publicFetch<{ results: PublicPagesEvent[] }>(
        `${base}/${EVENTS_NEARBY_ENDPOINT}?${params}`
    )
    return data?.results ?? []
}


export async function getUserLocation(): Promise<{ city: string; country: string }> {
  const headersList = await headers()
  const city    = headersList.get("x-vercel-ip-city")    ?? "Lagos"
  const country = headersList.get("x-vercel-ip-country") ?? "NG"
  return { city: decodeURIComponent(city), country }
}

export async function getTopLocations(): Promise<TopLocation[]> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL
    const data = await publicFetch<{ data: TopLocation[] }>(`${base}/${TOP_LOCATIONS_ENDPOINT}`)
    return data?.data ?? (Array.isArray(data) ? data : [])
}

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





interface GetEventDetailsResult {
    success:  boolean
    data?:    EventDetails
    message?: string
}

export async function getEventDetails(eventID: string): Promise<GetEventDetailsResult> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`
        const res = await fetch(url, { next: { revalidate: 60 * 5 } })
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