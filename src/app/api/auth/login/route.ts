import { accessCookieOptions } from "@/components-data/cookie-keys"
import { LOGIN_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"

const STATUS_MESSAGES: Record<number, string> = {
    400: "Invalid credentials. Please check your email and password.",
    401: "Unauthorized. Please check your credentials.",
    403: "Access denied. You do not have permission to perform this action.",
    404: "Account not found. Please check your email address.",
    422: "Invalid input. Please check the information you entered.",
    429: "Too many attempts. Please wait a moment and try again.",
    500: "Server error. Please try again later.",
    502: "Service temporarily unavailable. Please try again later.",
    503: "Service temporarily unavailable. Please try again later.",
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${LOGIN_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[login] status:", res.status)
            console.log("[login] raw json:", JSON.stringify(json, null, 2))

            const message =
                STATUS_MESSAGES[res.status] ??
                `Something went wrong (${res.status}). Please try again.`

            return NextResponse.json({ message }, { status: res.status })
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
        console.log("[login] caught error:", err)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}