import { accessCookieOptions } from "@/components-data/cookie-keys"
import { HOST_REGISTER_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        console.log(body)

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${HOST_REGISTER_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[register] status:", res.status)
            console.log("[register] raw json:", JSON.stringify(json, null, 2))

            const message = res.status === 409
                ? "An account with this email already exists. Please sign in instead."
                : handleApiError(json)

            return NextResponse.json(
                { message },
                { status: res.status }
            )
        }

        const { user, tokens } = json.data

        const response = NextResponse.json(
            { message: json.message, user },
            { status: 201 }
        )

        response.cookies.set("access_token", tokens.access, accessCookieOptions)

        response.cookies.set("refresh_token", tokens.refresh, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === "production",
            sameSite: "strict",
            path:     "/api/auth",
            maxAge:   60 * 60 * 24 * 7,
        })

        return response

    } catch (err) {
        console.log("[host-register] caught error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}