import { CITY_SUBSCRIBE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface SubscribeResult {
    success:  boolean
    message?: string
}

export async function subscribeToCity(city: string, email: string): Promise<SubscribeResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CITY_SUBSCRIBE_ENDPOINT}`,
            {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify({ city, email }),
            }
        )

        const json = await res.json()

        if (!res.ok) {
            console.log("[subscribeToCity] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, message: json.message }

    } catch (err) {
        console.log("[subscribeToCity] error:", err)
        return { success: false, message: "Request failed. Please try again." }
    }
}