"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Icon } from "@iconify/react"
import axios, { AxiosError } from "axios"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { AUTH_ROUTES, NAV_LINKS } from "@/components-data/navigation/navLinks"
import { SOCIAL_AUTH_PATH } from "@/apiPaths"

export default function OAuthCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useAppDispatch()
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const code = searchParams.get("code")
        const provider = searchParams.get("state")
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/auth/callback`

        if (!code || !provider) {
            setError("Invalid callback. Please try again.")
            return
        }

        const exchange = async () => {
            try {
                const { data } = await axios.post(
                    SOCIAL_AUTH_PATH.replace("[provider]", provider),
                    {
                        code,
                        redirect_uri: callbackUrl,
                    }
                )

                dispatch(setUser(data.user))

                if (data.user?.role === "host") {
                    const protocol = process.env.NODE_ENV === "production" ? "https://" : "http://"
                    window.location.href = `${protocol}host.${process.env.NEXT_PUBLIC_APP_DOMAIN?.replace(/^https?:\/\//, "")}`
                } else {
                    router.push(NAV_LINKS.HOME.href)
                }
            } catch (err) {
                if (err instanceof AxiosError) {
                    setError(err.response?.data?.message ?? "Authentication failed.")
                } else {
                    setError("An unexpected error occurred.")
                }
            }
        }

        exchange()
    }, [searchParams, router, dispatch])

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="p-3 rounded-full bg-red-50">
                    <Icon icon="mingcute:warning-line" className="size-8 text-red-400" />
                </div>
                <p className="text-sm font-medium text-neutral-9">{error}</p>
                <button
                    onClick={() => router.push(AUTH_ROUTES.SIGN_IN.href)}
                    className="text-sm text-primary font-medium hover:underline"
                >
                    Go back and try again
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <Icon icon="eos-icons:three-dots-loading" className="size-12 text-primary" />
            <p className="text-sm text-neutral-6">Completing sign in...</p>
        </div>
    )
}