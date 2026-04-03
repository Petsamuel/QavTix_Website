"use server"

import { CACHE_TAGS } from "@/cache-tags"
import {
    TRENDING_HOSTS_ENDPOINT,
    FOLLOW_HOST_ENDPOINT,
    HOST_DETAILS_ENDPOINT,
    CONTACT_HOST_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"


interface GetTrendingHostsResult {
    success:  boolean
    data?:    TrendingHost[]
    message?: string
}

interface GetHostDetailsResult {
    success:  boolean
    data?:    HostDetails
    message?: string
}

interface MutateResult {
    success:  boolean
    message?: string
}


export async function getTrendingHosts(): Promise<GetTrendingHostsResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${TRENDING_HOSTS_ENDPOINT}`,
            { next: { revalidate: 60 * 10, tags: [CACHE_TAGS.HOSTS] } }
        )

        const json = await res.json()

        if (!res.ok) {
            console.log("[getTrendingHosts] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const results = json.data ?? json.results.data ?? []
        return { success: true, data: results }

    } catch (err) {
        console.log("[getTrendingHosts] error:", err)
        return { success: false, message: "Failed to load hosts." }
    }
}

export async function getHostDetails(hostId: number | string): Promise<GetHostDetailsResult> {
    try {
        const url = `${HOST_DETAILS_ENDPOINT.replace("[host_id]", String(hostId))}`

        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.get(url)

        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[getHostDetails] status:", error?.response?.status)
        console.log("[getHostDetails] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function followHost(hostID: number | string): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const url = FOLLOW_HOST_ENDPOINT
            .replace("[host_id]", String(hostID))
            .replace("[action]", "follow")

        await axiosInstance.post(url, { host_id: hostID })

        revalidateTag(CACHE_TAGS.HOSTS, "max")
        revalidateTag(CACHE_TAGS.HOST_DETAILS, "max")

        return { success: true }

    } catch (error: any) {
        console.log("[followHost] status:", error?.response?.status)
        console.log("[followHost] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function unfollowHost(hostID: number | string): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const url = FOLLOW_HOST_ENDPOINT
            .replace("[host_id]", String(hostID))
            .replace("[action]", "unfollow")

        await axiosInstance.delete(url, { data: { host_id: hostID } })

        
        revalidateTag(CACHE_TAGS.HOSTS, "max")
        revalidateTag(CACHE_TAGS.HOST_DETAILS, "max")

        return { success: true }

    } catch (error: any) {
        console.log("[unfollowHost] status:", error?.response?.status)
        console.log("[unfollowHost] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}



interface ContactHostResult {
    success:  boolean
    message?: string
}

export async function contactHost(payload: ContactHostPayload): Promise<ContactHostResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CONTACT_HOST_ENDPOINT}`,
            {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(payload),
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.log("[contactHost] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }

    } catch (err) {
        console.log("[contactHost] error:", err)
        return { success: false, message: "Failed to send message. Please try again." }
    }
}