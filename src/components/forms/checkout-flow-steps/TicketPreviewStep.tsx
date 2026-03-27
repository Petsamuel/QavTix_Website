"use client"

import { TicketCard } from "@/components/custom-utils/cards/TicketCard"
import { useCheckout } from "@/contexts/CheckoutFlowProvider"

export default function TicketPreviewStep() {
    
    const { tickets, event } = useCheckout()

    if (tickets.length === 0) {
        return (
            <div
                className="py-16 text-center text-neutral-5 text-sm"
                data-testid="ticket-preview-empty"
            >
                No tickets are available for this event.
            </div>
        )
    }

    return (
        <div
            className="space-y-6"
            data-testid="ticket-preview-step"
        >
            {tickets.map((ticket) => (
                <TicketCard
                    key={ticket._key}
                    ticketKey={ticket._key}
                    data-testid={`ticket-card-${ticket._key}`}
                />
            ))}
        </div>
    )
}