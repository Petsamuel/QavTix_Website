"use client"

import { useEffect, useRef } from "react"
import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { EVENT_ROUTES } from "@/components-data/navigation/navLinks";
import { useCheckout } from "@/contexts/CheckoutFlowProvider";

export default function CheckoutSuccessMessage() {

    const router = useRouter()
    const { event_id } = useParams()
    const { event } = useCheckout()
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

        const timer = setTimeout(() => {
            router.push(EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", (event_id || event.id).toString()))
        }, 3000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div ref={ref} className="flex h-screen justify-center items-center flex-col">
            <Image src="/images/vectors/transaction-success.svg" alt="Success Indicator" width={200} height={200} className="mx-auto my-8" />
            <div className="max-w-xs mx-auto">
                <h2 className={`text-center text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>You're All Set!</h2>
                <p className="text-center text-[#616166] text-sm">
                    Your spot is secured. We look forward to seeing you.
                </p>
            </div>
        </div>
    )
}