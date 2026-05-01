"use server"

import { SEARCH_EVENTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface SearchEventsFilters {
    categories?: number[]
    country?: string
    state?: string
    min_price?: number
    max_price?: number
    start_date?: string
    end_date?: string
}

export interface SearchEventsResult {
    success: boolean
    data?: PublicPagesEvent[]
    total?: number
    message?: string
}

export async function searchEvents(
    query: string,
    limit = 3,
    filters: SearchEventsFilters = {},
): Promise<SearchEventsResult> {
    try {
        const params = new URLSearchParams({ search: query, limit: String(limit) })

        if (filters.categories?.length) {
            filters.categories.forEach(id => params.append("category", String(id)))
        }
        if (filters.country) params.set("country", filters.country)
        if (filters.state) params.set("state", filters.state)
        if (filters.min_price != null) params.set("min_price", String(filters.min_price))
        if (filters.max_price != null) params.set("max_price", String(filters.max_price))
        if (filters.start_date) params.set("start_date", filters.start_date)
        if (filters.end_date) params.set("end_date", filters.end_date)

        const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
        const fullUrl = `${base}/${SEARCH_EVENTS_ENDPOINT}?${params}`

        console.log("[searchEvents] URL:", fullUrl)

        const res = await fetch(fullUrl)
        const json = await res.json()

        if (!res.ok) {
            console.log("[searchEvents] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const results = json.data?.results ?? json.results ?? []
        const total = json.data?.count ?? json.count ?? results.length

        return { success: true, data: results, total }
    } catch (err) {
        console.log("[searchEvents] error:", err)
        return { success: false, message: "Search failed. Please try again." }
    }
}
