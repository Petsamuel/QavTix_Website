"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { confirmSplitPaymentToken, checkoutFromSplitPaymentToken } from "@/actions/checkout"
import Logo from "@/components/layout/Logo"

type Status = "loading" | "error" | "success"

const STEPS = [
    "Checking split payment token...",
    "Confirming your token...",
    "Token valid. Generating checkout link...",
    "Redirecting to checkout...",
]

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAuthPrompt } from "@/lib/redux/slices/showAuthPromptSlice"

export default function GroupSplitPaymentPage() {

    const token = useParams().token || "";
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isAuthenticated } = useAppSelector(s => s.auth)
    
    const [isMounted, setIsMounted] = useState(false)
    const [status, setStatus] = useState<Status>("loading")
    const [message, setMessage] = useState<string>(STEPS[0])
    const [stepIndex, setStepIndex] = useState(0)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isMounted) return
        
        if (!isAuthenticated) {
            dispatch(showAuthPrompt("Sign in to join this split payment"))
            setStatus("error")
            setMessage("Authentication required to join split payment")
            return
        }

        if (!token) {
            setStatus("error")
            setMessage("Missing payment token")
            return
        }

        const run = async () => {
            setStatus("loading")
            setStepIndex(0)
            setMessage(STEPS[0])

            const validation = await confirmSplitPaymentToken(token as string)

            setStepIndex(1)
            setMessage(STEPS[1])

            if (!validation.success) {
                setStatus("error")
                setMessage(validation.message ?? "Unable to validate token")
                return
            }

            setStepIndex(2)
            setMessage(STEPS[2])

            const checkoutResult = await checkoutFromSplitPaymentToken(token as string)
            if (!checkoutResult.success) {
                setStatus("error")
                setMessage(checkoutResult.message ?? "Unable to get checkout URL")
                return
            }

            const checkoutUrl = checkoutResult.checkout_url

            if (!checkoutUrl) {
                setStatus("error")
                setMessage("Checkout URL was not returned")
                return
            }

            setStepIndex(3)
            setMessage(STEPS[3])
            setStatus("success")

            if (checkoutUrl.startsWith("/")) {
                router.push(checkoutUrl)
            } else {
                window.location.href = checkoutUrl
            }
        }

        run().catch((err) => {
            console.error(err)
            setStatus("error")
            setMessage("Unexpected error processing payment token")
        })
    }, [token, router, isMounted, isAuthenticated, dispatch])

    return (
        <div className="min-h-screen bg-neutral-1 flex flex-col items-center justify-center px-4">

            {/* Card */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-neutral-5 overflow-hidden">

                {/* Header strip */}
                <div className="flex items-center justify-center py-6 border-b border-neutral-5 bg-neutral-1">
                    <Logo  />
                </div>

                {/* Body */}
                <div className="px-8 py-10 flex flex-col items-center text-center gap-6">

                    {/* ── LOADING ── */}
                    {status === "loading" && (
                        <>
                            {/* Spinner */}
                            <div className="relative flex items-center justify-center w-20 h-20">
                                {/* Outer ring */}
                                <svg
                                    className="absolute inset-0 w-full h-full animate-spin"
                                    viewBox="0 0 80 80"
                                    fill="none"
                                >
                                    <circle
                                        cx="40" cy="40" r="34"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        strokeDasharray="60 150"
                                        className="text-primary-500"
                                    />
                                </svg>
                                {/* Inner pulsing dot */}
                                <span className="w-4 h-4 rounded-full bg-primary-500 animate-pulse" />
                            </div>

                            <div>
                                <p className="text-base font-semibold text-secondary-9 mb-1">
                                    Processing your payment
                                </p>
                                <p className="text-sm text-neutral-7">{message}</p>
                            </div>

                            {/* Step dots */}
                            <div className="flex items-center gap-2">
                                {STEPS.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`block rounded-full transition-all duration-300 ${
                                            i < stepIndex
                                                ? "w-2 h-2 bg-primary-5"
                                                : i === stepIndex
                                                ? "w-4 h-2 bg-primary-500"
                                                : "w-2 h-2 bg-neutral-7"
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            {/* Animated check circle */}
                            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-4 border-green-100">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-9 h-9 text-green-600"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        d="M5 13l4 4L19 7"
                                        className="[stroke-dasharray:30] [stroke-dashoffset:30] animate-[dash_0.4s_ease-out_forwards]"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-base font-semibold text-secondary-9 mb-1">
                                    You're all set!
                                </p>
                                <p className="text-sm text-neutral-6">{message}</p>
                            </div>

                            {/* Redirect bar */}
                            <div className="w-full h-1.5 rounded-full bg-neutral-3 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full animate-[grow_2s_linear_forwards]" />
                            </div>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            {/* Error icon */}
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-4 border-red-100">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-9 h-9 text-red-500"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                >
                                    <path d="M12 8v4M12 16h.01" />
                                    <circle cx="12" cy="12" r="9" />
                                </svg>
                            </div>

                            <div>
                                <p className="text-base font-semibold text-secondary-9 mb-1">
                                    Something went wrong
                                </p>
                                <p className="text-sm text-neutral-6">{message}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 w-full">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                                >
                                    Try again
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full py-2.5 rounded-xl border border-neutral-6 bg-neutral-2 text-neutral-7 text-sm font-medium hover:bg-neutral-3 transition-colors"
                                >
                                    Go home
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-neutral-6 bg-neutral-1 text-center">
                    <p className="text-xs text-neutral-6">
                        Secured · Group Split Payment
                    </p>
                </div>
            </div>
        </div>
    )
}