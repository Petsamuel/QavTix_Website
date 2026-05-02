import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { NextRequest, NextResponse } from "next/server"

const PROVIDER_ENDPOINTS: Record<string, string> = {
    google:   "auth/social/google/",
    facebook: "auth/social/facebook/",
    apple:    "auth/social/apple/",
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
        
        // Map callback_url to redirect_uri if needed by backend
        const backendPayload = {
            ...body,
            redirect_uri: body.redirect_uri || body.callback_url
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(backendPayload),
        })

        const text = await res.text()
        let json: any
        try {
            json = JSON.parse(text)
        } catch {
            console.error(`[social-auth:${provider}] Non-JSON response:`, text)
            return NextResponse.json(
                { message: "Backend returned an invalid response" },
                { status: 502 }
            )
        }

        if (!res.ok) {
            console.log(`[social-auth:${provider}] status:`, res.status)
            console.log(`[social-auth:${provider}] body:`, JSON.stringify(json, null, 2))

            const message = res.status === 409
                ? "An account with these details already exists. Please log in."
                : handleApiError(json)

            return NextResponse.json(
                { message },
                { status: res.status }
            )
        }

        // Handle both nested { data: { user, tokens } } and root-level { user, access, refresh }
        const data = json.data ?? json
        const user = data.user
        
        // Normalize tokens structure
        const accessToken = data.tokens?.access ?? data.access ?? data.access_token
        const refreshToken = data.tokens?.refresh ?? data.refresh ?? data.refresh_token

        if (!accessToken) {
            console.error(`[social-auth:${provider}] Tokens missing in response:`, JSON.stringify(json))
            return NextResponse.json({ message: "Authentication successful but tokens were missing" }, { status: 500 })
        }

        const response = NextResponse.json(
            { message: json.message ?? "Authentication successful", user },
            { status: 200 }
        )

        response.cookies.set("access_token", accessToken, accessCookieOptions)

        if (refreshToken) {
            response.cookies.set("refresh_token", refreshToken, refreshCookieOptions)
        }

        return response

    } catch (err) {
        console.log(`[social-auth:${provider}] caught error:`, err)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}