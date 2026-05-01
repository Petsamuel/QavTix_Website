import { cookies } from "next/headers"

/**
 * Server-side helper to retrieve the authentication token from cookies.
 * This should be used inside Server Components or Server Actions.
 */
export async function getAuthToken(): Promise<string | undefined> {
    try {
        const cookieStore = await cookies()
        return cookieStore.get("access_token")?.value;
    } catch (error) {
        console.error("[getAuthToken] error:", error)
        return undefined
    }
}
