"use client"

import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { usePricingCheckout } from "@/contexts/PricingCheckoutContext"

// CONTENT VARIES BY ACCOUNT TYPE AND PLAN
const SUCCESS_COPY = {
    host: {
        heading:     "You're all set!",
        description: "You can start creating events and accessing premium tools immediately.",
        cta:         "Go to dashboard",
        ctaHref:     "/dashboard",
        icon:        "hugeicons:calendar-add-02",
    },
    attendee: {
        heading:     "You're all set!",
        description: "Your membership is active. Enjoy early access, exclusive deals, and boosted rewards from your next ticket purchase.",
        cta:         "Browse events",
        ctaHref:     "/events",
        icon:        "hugeicons:ticket-02",
    },
} as const

interface PricingSuccessMessageProps {
    className?: string
}

export default function PricingSuccessMessage({ className }: PricingSuccessMessageProps) {

    const { accountType, successPlan, resetSuccess } = usePricingCheckout()

    const copy = SUCCESS_COPY[accountType]

    return (
        <div className={cn(
            "flex flex-col items-center justify-center text-center px-6",
            className
        )}>
            <Image
                src="/images/vectors/transaction-success.svg"
                alt="Payment successful"
                width={200}
                height={200}
                className="mx-auto mb-8"
            />

            <div className="max-w-sm mx-auto space-y-3">
                {successPlan && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-6 bg-primary-1 px-3 py-1 rounded-full mb-2">
                        <Icon icon={copy.icon} width="14" height="14" />
                        {successPlan.name} activated
                    </span>
                )}

                <h2 className={cn(
                    space_grotesk.className,
                    "text-2xl font-bold text-secondary-9"
                )}>
                    {copy.heading}
                </h2>

                <p className="text-sm text-neutral-7 leading-relaxed">
                    {copy.description}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                    href={copy.ctaHref}
                    className="px-6 py-3 rounded-full bg-primary-6 hover:bg-primary-7 text-white text-sm font-medium transition-colors"
                >
                    {copy.cta}
                </Link>
                <button
                    onClick={resetSuccess}
                    className="px-6 py-3 rounded-full border border-neutral-7 hover:bg-neutral-1 text-secondary-9 text-sm font-medium transition-colors"
                >
                    View pricing
                </button>
            </div>
        </div>
    )
}