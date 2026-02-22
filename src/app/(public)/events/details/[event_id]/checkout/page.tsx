"use client"

import CheckoutPageContent from "@/components/checkout/CheckoutPageContent";
import CloseBtn from "@/components/custom-utils/buttons/event-search/CloseBtn";
import EventDetailsPreview from "@/components/forms/checkout-flow-steps/EventDetailsPreview";
import { CheckoutAttendeeInfoFormProvider } from "@/contexts/CheckoutAttendeeInfoFormContext";
import { CheckoutFlowProvider } from "@/contexts/CheckoutFlowProvider";
import { SplitPaymentProvider } from "@/contexts/SplitPaymentContextProvider";
import { space_grotesk } from "@/lib/fonts";
import { useState } from "react";

export default function EventTicketCheckoutPage(){

    const [showCloseLeaveCheckoutPrompt, setShowCloseLeaveCheckoutPrompt] = useState(false)

    return (
        <CheckoutFlowProvider>
            <CheckoutAttendeeInfoFormProvider>
                <SplitPaymentProvider>
                    <main className="py-7 md:pt-10 global-px max-w-7xl mx-auto">
                        <div className="md:flex justify-between gap-6 lg:gap-16 items-start">
                            <div className="flex md:w-[50%] lg:max-w-[calc(100%-40%-4rem)] items-center gap-6 justify-between">
                                <h1 className={`${space_grotesk.className} font-medium text-2xl text-secondary-9`}>
                                    Ticketing checkout
                                </h1>
                                <CloseBtn action={() => setShowCloseLeaveCheckoutPrompt(true)} />
                            </div>

                            <div className="mt-10 md:mt-0 md:flex-1 lg:max-w-[40%]">
                                <EventDetailsPreview />
                            </div>
                        </div>

                        <CheckoutPageContent setShowCloseLeaveCheckoutPrompt={setShowCloseLeaveCheckoutPrompt} showCloseLeaveCheckoutPrompt={showCloseLeaveCheckoutPrompt} />
                    </main>
                </SplitPaymentProvider>
            </CheckoutAttendeeInfoFormProvider>
        </CheckoutFlowProvider>
    )
}