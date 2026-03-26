"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"

interface Props {
    error:  Error & { digest?: string }
    reset:  () => void
}

function extractErrorMessage(error: unknown): string {
    if (!error) return ""

    let raw = ""

    if (typeof error === "string") {
        raw = error
    } else if (error instanceof Error) {
        raw = error.message ?? ""
    } else if (typeof error === "object" && "message" in error) {
        const msg = (error as Record<string, unknown>).message
        raw = typeof msg === "string" ? msg : ""
    }

    if (!raw) return ""

    // Reject if it looks like an HTML document
    if (/<html|<!doctype/i.test(raw)) return ""

    const stripped = raw.replace(/<[^>]*>/g, "").trim()

    try {
        const parsed = JSON.parse(stripped)
        if (typeof parsed === "object" && parsed !== null) return ""
    } catch {
        // Not JSON — safe to display
    }

    if (stripped.length > 200) return stripped.slice(0, 200).trimEnd() + "…"

    return stripped
}

export default function ErrorPage({ error, reset }: Props) {
    useEffect(() => {
        console.error("[ErrorPage]", error)
    }, [error])

    const message = extractErrorMessage(error)

    return (
        <main
            className="min-h-screen flex flex-col items-center justify-center px-6 bg-white"
            aria-labelledby="error-title"
            role="alert"
        >
            {/* Icon */}
            <div
                className="
                    size-20 rounded-full
                    bg-red-50 border border-red-100
                    flex items-center justify-center
                    mb-6
                "
                aria-hidden="true"
            >
                <Icon
                    icon="hugeicons:alert-circle"
                    className="size-9 text-red-500"
                />
            </div>

            {/* Copy */}
            <div className="text-center max-w-md">
                <h1
                    id="error-title"
                    className="text-2xl sm:text-3xl font-bold text-secondary-9 tracking-tight"
                >
                    Something went wrong
                </h1>

                {message ? (
                    <p className="mt-3 text-sm sm:text-base text-neutral-5 leading-relaxed">
                        {message}
                    </p>
                ) : (
                    <p className="mt-3 text-sm sm:text-base text-neutral-5 leading-relaxed">
                        An unexpected error occurred. Our team has been notified.
                        <br />
                        Please try again or return to the homepage.
                    </p>
                )}

                {error?.digest && (
                    <p className="mt-3 text-xs text-neutral-4 font-mono">
                        Error ID:{" "}
                        <span className="text-neutral-5 select-all">{error.digest}</span>
                    </p>
                )}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                <button
                    onClick={reset}
                    className="
                        inline-flex items-center justify-center gap-2
                        px-8 py-3 rounded-full bg-primary text-white
                        text-sm font-medium
                        transition-all duration-200
                        hover:bg-primary-7 hover:shadow-lg hover:shadow-primary/25
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                        active:scale-[0.97]
                    "
                    aria-label="Try again"
                >
                    <Icon icon="hugeicons:refresh" className="size-4" aria-hidden="true" />
                    Try again
                </button>

                <Link
                    href="/"
                    className="
                        inline-flex items-center justify-center
                        px-8 py-3 rounded-full border border-secondary-9 text-secondary-9
                        text-sm font-medium
                        transition-all duration-200
                        hover:bg-secondary-9 hover:text-white
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-9 focus-visible:ring-offset-2
                        active:scale-[0.97]
                    "
                    aria-label="Go to homepage"
                >
                    Go to homepage
                </Link>
            </div>
        </main>
    )
}