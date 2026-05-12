"use client"

import Image from "next/image"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { usePricingCheckout } from "@/contexts/PricingCheckoutContext"
import { AnimatedDialog } from "../custom-utils/AnimatedDialog"
import { DialogDescription, DialogTitle } from "../ui/dialog"


const SUCCESS_COPY = {
    host: {
        heading: "You're all set!",
        description: "You can start creating events and accessing premium tools immediately.",
        cta: "Go to dashboard",
        ctaHref: "/dashboard",
        icon: "hugeicons:calendar-add-02",
    },
    attendee: {
        heading: "You're all set!",
        description: "Your membership is active. Enjoy early access, exclusive deals, and boosted rewards from your next ticket purchase.",
        cta: "Browse events",
        ctaHref: "/events",
        icon: "hugeicons:ticket-02",
    },
} as const

export default function PricingSuccessMessage() {
    const { accountType, successPlan, resetSuccess } = usePricingCheckout()
    const copy = SUCCESS_COPY[accountType]

    return (
        <AnimatedDialog open={true} onOpenChange={(o) => { if (!o) resetSuccess() }} className="rounded-3xl! md:max-w-sm!" childrenContainerStyles="px-5 py-10">
            <div className="text-center">
                <Image
                    src="/images/vectors/scan-verified.svg"
                    alt="Payment successful"
                    width={160} height={160}
                    className="mx-auto mb-6"
                />

                {successPlan && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-6 bg-primary-1 px-3 py-1 rounded-full mb-4">
                        <Icon icon={copy.icon} width="14" height="14" />
                        {successPlan.name} activated
                    </span>
                )}

                <DialogTitle className={cn(space_grotesk.className, "text-2xl font-bold text-secondary-8 mb-2")}>
                    {copy.heading}
                </DialogTitle>
                <DialogDescription className="text-sm text-neutral-7 leading-relaxed">
                    {copy.description}
                </DialogDescription>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                        href={copy.ctaHref}
                        className="flex-1 px-6 py-3 rounded-full bg-primary-6 hover:bg-primary-7 text-white text-sm font-medium transition-colors"
                    >
                        {copy.cta}
                    </Link>
                    <button
                        onClick={resetSuccess}
                        className="flex-1 px-6 py-3 rounded-full border border-neutral-5 hover:bg-neutral-2 text-secondary-9 text-sm font-medium transition-colors"
                    >
                        View pricing
                    </button>
                </div>
            </div>
        </AnimatedDialog>
    )
}