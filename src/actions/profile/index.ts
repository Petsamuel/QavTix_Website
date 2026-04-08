"use server"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"

interface ProfileResult {
    success:  boolean
    data?:    AuthUser
    message?: string
}

export async function getProfile(): Promise<ProfileResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PROFILE_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PROFILE] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const profile = json.data?.results?.[0] ?? json.data ?? json.results?.[0] ?? json
        return { success: true, data: profile }

    } catch (error: any) {
        console.log("[getProfile] error:", error)
        return { success: false, message: "Failed to load profile." }
    }
}