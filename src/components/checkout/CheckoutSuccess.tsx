"use client"

import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import ActionButton1 from "../custom-utils/buttons/ActionButton1";
import { useParams, useRouter } from "next/navigation";
import { EVENT_ROUTES } from "@/components-data/navigation/navLinks";

export default function CheckoutSuccessMessage() {

    const router = useRouter()
    const { event_id } = useParams() 

    return (
        <div className="flex h-screen justify-center items-center flex-col">
            <Image src="/images/vectors/transaction-success.svg" alt="Success Indicator" width={200} height={200} className="mx-auto my-8" />
            <div className="max-w-xs mx-auto">
                <h2 className={`text-center text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>You’re All Set!</h2>
                <p className="text-center text-[#616166] text-sm">
                    Your spot is secured. We look forward to seeing you.
                </p>

                <ActionButton1 buttonText="On Getting Ticket" className="w-full mt-6" buttonType="button" action={() => router.push(EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", typeof event_id === "string" ? event_id : ""))} />
            </div>
        </div>
    )
}