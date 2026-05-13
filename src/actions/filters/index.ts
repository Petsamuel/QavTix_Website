import { CATEGORIES_ENDPOINT, CATEGORY_PAGE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

export async function getCategories(): Promise<GetCategoriesResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`,
            {
                // Categories rarely change — cache for 1 hour across all users
                next: { revalidate: 3600, tags: [CACHE_TAGS.CATEGORIES] },
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
    success: boolean
    data?: CategoryPageData
    message?: string
}

export async function getCategoryPage(categoryPath: string): Promise<CategoryPageResult> {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")}/${CATEGORY_PAGE_ENDPOINT.replace("[category_name]", categoryPath)}`
        const res = await fetch(url, {
            // Category pages are mostly static — cache for 5 minutes
            next: { revalidate: 300, tags: [CACHE_TAGS.CATEGORIES] },
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