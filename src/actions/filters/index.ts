"use server"

import { CATEGORIES_ENDPOINT, CATEGORY_PAGE_ENDPOINT, SEARCH_EVENTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

export interface ApiCategory {
    id:   number
    name: string
}

export interface GetCategoriesResult {
    success:    boolean
    data:       ApiCategory[]
    message?:   string
}

export async function getCategories(): Promise<GetCategoriesResult> {
    try {
        const cookiesStore = await cookies()
        const token = cookiesStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`,
            {
                next: { revalidate: 60 * 60 * 6, tags: [CACHE_TAGS.CATEGORIES] },
                headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            }
        )
        if (!res.ok) return { success: false, data: [] }
        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}


interface CategoryPageResult {
    success:  boolean
    data?:    CategoryPageData
    message?: string
}

export async function getCategoryPage(categoryPath: string): Promise<CategoryPageResult> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")}/${CATEGORY_PAGE_ENDPOINT.replace("[category_name]", categoryPath)}`
        const res = await fetch(url, {
            next: { revalidate: 60 * 5, tags: [CACHE_TAGS.CATEGORIES] },
        })
        const json = await res.json()

        if (!res.ok) {
            console.log("[getCategoryPage] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getCategoryPage] error:", err)
        return { success: false, message: "Failed to load category." }
    }
}


export interface SearchEventsResult {
    success:  boolean
    data?:    PublicPagesEvent[]
    total?:   number
    message?: string
}

export interface SearchEventsFilters {
    categories?:  number[]
    country?:     string
    state?:       string
    min_price?:   number
    max_price?:   number
    start_date?:  string
    end_date?:    string
}

export async function searchEvents(
    query:   string,
    limit  = 3,
    filters: SearchEventsFilters = {},
): Promise<SearchEventsResult> {
    try {
        const params = new URLSearchParams({ search: query, limit: String(limit) })

        if (filters.categories?.length) {
            filters.categories.forEach(id => params.append("category", String(id)))
        }
        if (filters.country)            params.set("country",    filters.country)
        if (filters.state)              params.set("state",      filters.state)
        if (filters.min_price != null)  params.set("min_price",  String(filters.min_price))
        if (filters.max_price != null)  params.set("max_price",  String(filters.max_price))
        if (filters.start_date)         params.set("start_date", filters.start_date)
        if (filters.end_date)           params.set("end_date",   filters.end_date)

        const base    = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
        const fullUrl = `${base}/${SEARCH_EVENTS_ENDPOINT}?${params}`

        console.log("[searchEvents] URL:", fullUrl)
        console.log("[searchEvents] filters:", JSON.stringify(filters, null, 2))

        const res  = await fetch(fullUrl, { cache: "no-store" })
        const json = await res.json()

        if (!res.ok) {
            console.log("[searchEvents] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const results = json.data?.results ?? json.results ?? []
        const total   = json.data?.count   ?? json.count   ?? results.length

        console.log("[searchEvents] total:", total, "| returned:", results.length)

        return { success: true, data: results, total }
    } catch (err) {
        console.log("[searchEvents] error:", err)
        return { success: false, message: "Search failed. Please try again." }
    }
}