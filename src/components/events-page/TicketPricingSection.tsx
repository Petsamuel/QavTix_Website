"use client"

import { useState } from "react"
import AccessDeniedModal from "../modals/AccessDeniedModal"
import { formatPrice } from "@/helper-fns/formatPrice"
import { useRouter } from "next/navigation"
import { EVENT_ROUTES } from "@/components-data/navigation/navLinks"
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink"
import { useAppSelector } from "@/lib/redux/hooks"



interface Props {
    initialVisibleCount?: number
    event: EventDetails
    affiliateCode?: string
}

export default function TicketPricingSection({
    initialVisibleCount = 4,
    event,
    affiliateCode,
}: Props) {

    const router = useRouter()

    const [showAll, setShowAll] = useState(false)
    const { isAuthenticated, user } = useAppSelector(store => store.auth)
    const [showAgeRestrictionModal, setShowAgeRestrictionModal] = useState(false)

    const visibleTickets = showAll ? event.tickets : event.tickets.slice(0, initialVisibleCount)
    const hasMore = event.tickets.length > initialVisibleCount

    return (
        <section>
            {event.tickets.length > 0 && (
                <div className="w-full bg-accent-1 mt-12 rounded-xl p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center flex-wrap gap-6 overflow-x-auto pb-2">
                            {visibleTickets.map((ticket, i) => (
                                <div key={`${ticket.ticket_type}-${i}`} className="shrink-0 border-e-[1.5px] pe-3 border-accent-2">
                                    <p className="text-sm text-neutral-7 mb-2">{ticket.ticket_type}</p>
                                    <p className="text-sm font-medium text-neutral-10 tracking-[10%] md:tracking-[12%]">
                                        {parseFloat(ticket.price) === 0 ? 'Free' : formatPrice(parseFloat(ticket.price), event.currency)}
                                    </p>
                                </div>
                            ))}

                            {hasMore && !showAll && (
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="shrink-0 text-sm text-neutral-7 hover:text-neutral-9 underline transition-colors"
                                >
                                    See more
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                {event.location_type === "online" && (event.tickets[0].price === "0.00") && new Date(event.start_datetime).getTime() > Date.now() ? (
                    <button
                        disabled
                        className="bg-neutral-3 text-[#6b7280] border border-neutral-4 px-6 py-4 rounded-full font-medium cursor-not-allowed select-none inline-flex items-center justify-center text-sm"
                    >
                        Upcoming Webinar
                    </button>
                ) : (
                    <LiquidLink
                        onClick={() => {
                            //checker for free online event wit location type "online"
                            if (event.location_type === "online" && event.tickets[0].price === "0.00") {
                                const fields = [
                                    event.event_location?.address,
                                    event.event_location?.venue_name
                                ];
                                let onlineLink = null;
                                for (const f of fields) {
                                    if (f && (f.trim().startsWith("http://") || f.trim().startsWith("https://"))) {
                                        onlineLink = f.trim();
                                        break;
                                    }
                                }
                                //if online link found open it in new tab else redirect to checkout page
                                if (onlineLink) {
                                    window.open(onlineLink, "_blank", "noopener,noreferrer");
                                } else {
                                    router.push(EVENT_ROUTES.CHECKOUT.href.replace("[event_id]", event.id.toString()));
                                }
                                return;
                            }

                            const userAge = user?.dob
                                ? new Date().getFullYear() - new Date(user.dob).getFullYear()
                                : null;

                            const isUnderAge = event.age_restriction && isAuthenticated && userAge !== null && event.minimum_age !== null && userAge < event.minimum_age;

                            if (isUnderAge) {
                                setShowAgeRestrictionModal(true)
                                return
                            }

                            const checkoutHref = EVENT_ROUTES.CHECKOUT.href.replace("[event_id]", event.id.toString())

                            router.push(affiliateCode ? `${checkoutHref}?ref=${encodeURIComponent(affiliateCode)}` : checkoutHref)
                        }}
                        className="bg-primary-6 hover:bg-primary-7 text-white px-6 py-4 rounded-full font-medium transition-colors"
                    >
                        {event.location_type === "online" && event.tickets[0].price === "0.00" ? "Join the Webinar" : "Get Ticket"}
                        
                    </LiquidLink>
                )}
            </div>

            <AccessDeniedModal open={showAgeRestrictionModal} setOpen={setShowAgeRestrictionModal} eventID={event.id.toString()} />
        </section>
    )
}