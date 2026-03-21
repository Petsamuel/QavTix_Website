"use server"

import { FORGOT_PASSWORD_ENDPOINT, VERIFY_OTP_ENDPOINT, RESET_PASSWORD_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
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

interface ActionResult {
    success:  boolean
    message?: string
}

interface VerifyOtpResult {
    success:  boolean
    token?:   string
    message?: string
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${FORGOT_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[requestPasswordReset] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }

    } catch (err) {
        console.log("[requestPasswordReset] error:", err)
        return { success: false, message: "Request failed. Please try again." }
    }
}

export async function verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${VERIFY_OTP_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, otp }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[verifyOtp] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true, token: json.data?.token ?? json.token }

    } catch (err) {
        console.log("[verifyOtp] error:", err)
        return { success: false, message: "Verification failed. Please try again." }
    }
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${RESET_PASSWORD_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ token, new_password: newPassword }),
        })

        const json = await res.json()

        if (!res.ok) {
            console.log("[resetPassword] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }

    } catch (err) {
        console.log("[resetPassword] error:", err)
        return { success: false, message: "Reset failed. Please try again." }
    }
}