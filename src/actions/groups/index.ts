"use server"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { GET_GROUPS_ENDPOINT } from "@/endpoints"

interface GroupsResult {
    success:  boolean
    data?:    Group[]
    message?: string
}

export async function getGroups(): Promise<GroupsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(GET_GROUPS_ENDPOINT)

        const raw = data.data ?? data
        const groups = Array.isArray(raw) ? raw : []

        return { success: true, data: groups }
    } catch (error: any) {
        console.log("[getGroups] status:", error?.response?.status)
        console.log("[getGroups] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}