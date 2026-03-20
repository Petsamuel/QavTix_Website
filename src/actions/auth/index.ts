"use server"

import { LOGOUT_PATH } from "@/apiPaths"
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const logOut = async () => {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(LOGOUT_PATH)
    } catch {
        // If the server call fails, proceed anyway — client must be logged out
    }

    // Clear both auth cookies regardless of backend response
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")

    redirect(process.env.NEXT_PUBLIC_AUTH_URL || "/auth/signin")
}