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

        const json = await res.json()

        if (!res.ok) {
            console.log("[host-register] status:", res.status)
            console.log("[host-register] raw json:", JSON.stringify(json, null, 2))

            const message = res.status === 409
                ? "An account with this email already exists. Please sign in instead."
                : handleApiError(json)

            return NextResponse.json({ message }, { status: res.status })
        }

        const { access, refresh, email } = json.data

        const response = NextResponse.json(
            { message: json.message, user: email },
            { status: 201 }
        )

        // Host tokens are namespaced separately so the public
        // website's proxy never picks them up as attendee sessions.
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