"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { buildAppleUrl, buildFacebookUrl, buildGoogleUrl } from "@/helper-fns/buildAuthUrl"

type Provider = "google" | "facebook" | "apple"

export default function SocialAuthButtons() {

    const [loading, setLoading] = useState<Provider | null>(null)

    const handleClick = (provider: Provider, url: string) => {
        setLoading(provider)
        window.location.href = url
    }

    return (
        <>
            <button
                onClick={() => handleClick("google", buildGoogleUrl())}
                disabled={!!loading}
                className="rounded-lg basis-[47%] lg:basis-[30%] flex text-sm items-center justify-center gap-2 border-[1.5px] border-neutral-5 h-14 hover:bg-neutral-2 hover:border-neutral-6 focus:outline-none focus:ring-2 focus:ring-primary-6 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading === "google"
                    ? <Icon icon="eos-icons:three-dots-loading" className="size-8 text-primary" />
                    : <Icon icon="material-icon-theme:google" className="size-6" />
                }
                <span className="font-bold">Google</span>
            </button>

            <button
                onClick={() => handleClick("facebook", buildFacebookUrl())}
                disabled={!!loading}
                className="rounded-lg basis-[47%] lg:basis-[30%] flex text-sm items-center justify-center gap-2 border-[1.5px] border-neutral-5 h-14 hover:bg-neutral-2 hover:border-neutral-6 focus:outline-none focus:ring-2 focus:ring-primary-6 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading === "facebook"
                    ? <Icon icon="eos-icons:three-dots-loading" className="size-8 text-primary" />
                    : <Icon icon="devicon:facebook" className="size-6" />
                }
                <span className="font-bold">Facebook</span>
            </button>

            <button
                onClick={() => handleClick("apple", buildAppleUrl())}
                disabled
                className="flex-1 lg:flex-auto lg:basis-[30%] bg-neutral-10 flex text-sm items-center justify-center gap-2 h-14 rounded-lg text-white hover:bg-neutral-9 focus:outline-none focus:ring-2 focus:ring-neutral-8 focus:ring-offset-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading === "apple"
                    ? <Icon icon="eos-icons:three-dots-loading" className="size-8 text-white" />
                    : <Icon icon="ic:baseline-apple" className="size-6" />
                }
                <span className="font-bold">Apple</span>
            </button>
        </>
    )
}