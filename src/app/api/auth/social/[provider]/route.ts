import { accessCookieOptions } from "@/components-data/cookie-keys"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { NextRequest, NextResponse } from "next/server"

const PROVIDER_ENDPOINTS: Record<string, string> = {
    google:   "auth/google/",
    facebook: "auth/facebook/",
    apple:    "auth/apple/",
}

export async function POST(
    req:     NextRequest,
    context: { params: Promise<{ provider: string }> },
) {
    const { provider } = await context.params
    const endpoint = PROVIDER_ENDPOINTS[provider]

    if (!endpoint) {
        return NextResponse.json({ message: "Unknown provider" }, { status: 400 })
    }

    try {
        const body = await req.json()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log(`[social-auth:${provider}] status:`, res.status)
            console.log(`[social-auth:${provider}] body:`, JSON.stringify(json, null, 2))
            return NextResponse.json(
                { message: handleApiError(json) },
                { status: res.status }
            )
        }

        const { user, tokens } = json.data

        const response = NextResponse.json(
            { message: json.message, user },
            { status: 200 }
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
        console.log(`[social-auth:${provider}] caught error:`, err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}