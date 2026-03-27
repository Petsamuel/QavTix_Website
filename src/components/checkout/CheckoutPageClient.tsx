'use client'

import CloseBtn from "@/components/custom-utils/buttons/event-search/CloseBtn"
import EventDetailsPreview from "@/components/forms/checkout-flow-steps/EventDetailsPreview"
import { space_grotesk } from "@/lib/fonts"
import { useState } from "react"
import CheckoutPageContent from "./CheckoutPageContent"
import { Group } from "@/actions/groups"

interface Props {
    event:  EventDetails
}

export default function CheckoutPageClient({ event }: Props) {
    const [showCloseLeaveCheckoutPrompt, setShowCloseLeaveCheckoutPrompt] = useState(false)

    return (
        <main
            className="py-7 md:pt-10 global-px max-w-7xl mx-auto"
            data-page="checkout"
            data-event-id={event.id}
        >
            <div className="md:flex justify-between gap-6 lg:gap-16 items-start">
                <div className="flex md:w-[50%] lg:max-w-[calc(100%-40%-4rem)] items-center gap-6 justify-between">
                    <h1 className={`${space_grotesk.className} font-medium text-2xl text-secondary-9`}>
                        Ticketing checkout
                    </h1>
                    <CloseBtn action={() => setShowCloseLeaveCheckoutPrompt(true)} />
                </div>

                <div className="mt-10 md:mt-0 md:flex-1 lg:max-w-[40%]">
                    <EventDetailsPreview event={event} />
                </div>
            </div>

            <CheckoutPageContent
                showCloseLeaveCheckoutPrompt={showCloseLeaveCheckoutPrompt}
                setShowCloseLeaveCheckoutPrompt={setShowCloseLeaveCheckoutPrompt}
            />
        </main>
    )
}