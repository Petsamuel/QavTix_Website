'use client'

import { useHasTicketForEvent, useTicketUser } from "@/contexts/TicketUserProvider"
import AuthUserGettingTicketCard from "./AuthUserGettingTicketCard"
import GuestGettingTicketCard from "./GuestGettingTicketCard"
import TicketPricingSection from "../TicketPricingSection"
import { useState } from "react"
import CancelledTicketCard from "./CancelledTicketCard"
import { useAppSelector } from "@/lib/redux/hooks"

interface Props {
    eventId: string
    tickets: EventTicket[]
}

export default function TicketStatusSection({ eventId, tickets }: Props) {

    const [ticketCancelled] = useState(false)
    const { user, ticketSession } = useTicketUser()
    const { isAuthenticated } = useAppSelector(store => store.auth)
    const hasTicket = useHasTicketForEvent(eventId)

    if (isAuthenticated && user && hasTicket) {
        return ticketCancelled ? <CancelledTicketCard /> : <AuthUserGettingTicketCard />
    }

    if (!isAuthenticated && ticketSession && hasTicket) {
        return <GuestGettingTicketCard />
    }

    return <TicketPricingSection tickets={tickets} />
}