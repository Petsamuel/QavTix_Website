"use server"

import {
    TRENDING_HOSTS_ENDPOINT,
    FOLLOW_HOST_ENDPOINT,
    HOST_DETAILS_ENDPOINT,
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

const CACHE_TAGS = {
    TRENDING_HOSTS: "trending-hosts",
}


export async function getTrendingHosts(): Promise<GetTrendingHostsResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${TRENDING_HOSTS_ENDPOINT}`,
            { next: { revalidate: 60 * 10, tags: [CACHE_TAGS.TRENDING_HOSTS] } }
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
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${HOST_DETAILS_ENDPOINT.replace("[host_id]", String(hostId))}`

        const res = await fetch(url, { next: { revalidate: 60 * 5 } })
        const json = await res.json()

        if (!res.ok) {
            console.log("[getHostDetails] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getHostDetails] error:", err)
        return { success: false, message: "Failed to load host details." }
    }
}


export async function followHost(hostID: number | string): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const url = FOLLOW_HOST_ENDPOINT
            .replace("[host_id]", String(hostID))
            .replace("[action]", "follow")

        await axiosInstance.post(url, { host_id: hostID })

        revalidateTag(CACHE_TAGS.TRENDING_HOSTS, "max")

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

        revalidateTag(CACHE_TAGS.TRENDING_HOSTS, "max")

        return { success: true }

    } catch (error: any) {
        console.log("[unfollowHost] status:", error?.response?.status)
        console.log("[unfollowHost] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}