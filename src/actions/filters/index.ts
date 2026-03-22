"use server"

import { CATEGORIES_ENDPOINT, CATEGORY_PAGE_ENDPOINT, SEARCH_EVENTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

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
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(CATEGORIES_ENDPOINT)
        return { success: true, data: data.data ?? [] }
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
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORY_PAGE_ENDPOINT.replace("[category_name]", categoryPath)}`
        const res = await fetch(url, { next: { revalidate: 60 * 5 } })
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

export async function searchEvents(query: string, limit = 3): Promise<SearchEventsResult> {
    try {
        const params = new URLSearchParams({ search: query, limit: String(limit) })
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${SEARCH_EVENTS_ENDPOINT}?${params}`,
            { cache: "no-store" } 
        )

        const json = await res.json()

        if (!res.ok) {
            console.log("[searchEvents] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const results = json.data?.results ?? json.results ?? []
        const total   = json.data?.count   ?? json.count   ?? results.length

        return { success: true, data: results, total }

    } catch (err) {
        console.log("[searchEvents] error:", err)
        return { success: false, message: "Search failed. Please try again." }
    }
}