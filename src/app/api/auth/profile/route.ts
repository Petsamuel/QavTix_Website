import { GET_ATTENDEE_PROFILE_ENDPOINT, GET_HOST_PROFILE_ENDPOINT, } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const accessToken = req.cookies.get("access_token")?.value

        if (!accessToken) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const role = req.nextUrl.searchParams.get("role") ?? ""

        if (!role) {
            return NextResponse.json(
                { message: "Bad Request" },
                { status: 400 }
            )
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${role === "host" ? GET_HOST_PROFILE_ENDPOINT : GET_ATTENDEE_PROFILE_ENDPOINT}`, {
            method:  "GET",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
        })

        const json : ProfileResponse = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch user" },
                { status: res.status }
            )
        }

        return NextResponse.json({ user: json.data }, { status: 200 })

    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}