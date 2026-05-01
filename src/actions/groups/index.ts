import { handleApiError } from "@/helper-fns/handleApiErrors"
import { GET_GROUPS_ENDPOINT } from "@/endpoints"
import { getAuthToken } from "@/helper-fns/getAuthToken"

interface GroupsResult {
    success:  boolean
    data?:    Group[]
    message?: string
}

export async function getGroups(): Promise<GroupsResult> {
    const token = await getAuthToken()
    return _getGroups(token)
}

async function _getGroups(token: string | undefined): Promise<GroupsResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_GROUPS_ENDPOINT}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            console.log("[getGroups] status:", res.status)
            console.log("[getGroups] body:", JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const data = await res.json()
        const raw = data.data ?? data
        const groups = Array.isArray(raw) ? raw : []

        return { success: true, data: groups }
    } catch (error: any) {
        console.log("[getGroups] error:", error)
        return { success: false, message: "Failed to load groups." }
    }
}