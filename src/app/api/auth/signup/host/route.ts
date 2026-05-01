import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { HOST_REGISTER_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        console.log("[host-register] body:", body)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${HOST_REGISTER_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        // Safely parse — the API might return an HTML error page on 5xx
        const contentType = res.headers.get("content-type") ?? ""
        const isJson      = contentType.includes("application/json")
        const json        = isJson ? await res.json() : null

        console.log("[host-register] status:", res.status)
        console.log("[host-register] raw json:", JSON.stringify(json, null, 2))

        if (!res.ok) {
            const message = res.status === 409
                ? "An account with these details already exists. Please log in."
                : json
                    ? handleApiError(json)
                    : `Server error (${res.status}). Please try again.`

            return NextResponse.json({ message }, { status: res.status })
        }

        const { access, refresh, email } = json.data

        const response = NextResponse.json(
            { message: json.message, user: email },
            { status: 201 }
        )

        response.cookies.set("host_access_token",  access,  accessCookieOptions)
        response.cookies.set("host_refresh_token", refresh, refreshCookieOptions)

        return response

    } catch (err) {
        console.log("[host-register] caught error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}