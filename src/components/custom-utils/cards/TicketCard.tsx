'use client'

import { space_grotesk } from '@/lib/fonts'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'
import { formatPrice, parsePrice } from '@/helper-fns/formatPrice'

interface TicketCardProps {
    ticketKey: string
}

export function TicketCard({
    ticketKey,
}: TicketCardProps) {

    const { 
        tickets, 
        incrementTicket, 
        isMarketplace,
        decrementTicket,
    } = useCheckout()

    const ticket  = tickets.find(v => v._key === ticketKey)

    if (!ticket) return null;

    return (
        <div
            className={cn(
                ticket.soldOut ? "border-neutral-5 opacity-50" : "border-primary-6",
                'border-[1.6px] rounded-[30px] p-5 sm:p-6 transition-all bg-white'
            )}
        >
            <div className="flex flex-col xsm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 mb-4">
                <div className="flex-1 space-y-2">
                    <h3
                        className={`${space_grotesk.className} text-xl text-secondary-9`}
                    >
                        {ticket.ticket_type}
                    </h3>

                    {ticket.price === 0 ? (
                        <p className={`${space_grotesk.className} font-medium text-xl text-primary-6`}>
                            Free
                        </p>
                    ) : (
                        <div className="flex items-baseline gap-2">
                            <p className={`${space_grotesk.className} font-medium text-xl text-primary-6`}>
                                {formatPrice(parsePrice(ticket.price) || 0, ticket.currency || 'NGN', true)}
                            </p>
                            {ticket.price && (
                                <p className="text-sm text-neutral-6 line-through">
                                    {formatPrice(parsePrice(ticket.price) || 0, ticket.currency || 'NGN', true)}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {!ticket.soldOut ? (
                    <div className="flex items-center gap-3 self-start">
                        <button
                            type="button"
                            onClick={() => decrementTicket(ticketKey)}
                            disabled={ticket.quantity === 0  || isMarketplace}
                            className="w-8 h-8 rounded-lg bg-secondary-6 text-white flex items-center justify-center hover:bg-secondary-7 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Icon icon="mynaui:minus" width="24" height="24" />
                        </button>
                        <span className="text-lg font-medium text-neutral-9 text-center">
                            {ticket.quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => incrementTicket(ticketKey)}
                            disabled={!ticket.available || ticket.soldOut || isMarketplace}
                            className="w-8 h-8 rounded-lg bg-secondary-6 text-white flex items-center justify-center hover:bg-secondary-7 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <Icon icon="mynaui:plus" width="24" height="24" />
                        </button>
                    </div>
                ) : (
                    <div className="px-5 py-2 w-fit h-fit rounded-full bg-secondary-6 text-white text-sm font-medium whitespace-nowrap">
                        Sold out
                    </div>
                )}
            </div>

            <p className="text-sm text-neutral-7 leading-relaxed">{ticket.description}</p>
        </div>
    )
}