'use client'

import { useHasTicketForEvent, useTicketUser } from "@/contexts/TicketUserProvider"
import AuthUserGettingTicketCard from "./AuthUserGettingTicketCard"
import GuestGettingTicketCard from "./GuestGettingTicketCard"
import TicketPricingSection from "../TicketPricingSection"
import CancelledTicketCard from "./CancelledTicketCard"
import { useAppSelector } from "@/lib/redux/hooks"
import { useState, useEffect } from "react"

interface Props {
    event: EventDetails
}

export default function TicketStatusSection({ event }: Props) {
    const [isMounted, setIsMounted] = useState(false)

    const { user, ticketSession } = useTicketUser()
    const { isAuthenticated } = useAppSelector(store => store.auth)
    const hasTicket = useHasTicketForEvent(event.id)

    // Check if user has at least ONE active ticket
    const hasActiveTicket = event.user_ticket_summary?.tickets?.some(
        (t) => t.status === "active"
    ) ?? false


    const hasReservedTicket = event.user_ticket_summary?.tickets?.some(
        (t) => t.status === "reserved" as EventStatus
    ) ?? false


    // Only show cancelled state when there are tickets BUT NONE are active
    const allTicketsCancelled =
        event.user_ticket_summary?.tickets && event.user_ticket_summary.tickets.length > 0 && !hasActiveTicket

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    // Authenticated user with active ticket(s)
    if (isAuthenticated && user && hasActiveTicket) {
        return <AuthUserGettingTicketCard event={event} />
    }

    // All tickets are cancelled
    if (isAuthenticated && user && allTicketsCancelled && !hasReservedTicket) {
        return <CancelledTicketCard event={event} />
    }

    // Guest with ticket
    if (!isAuthenticated && ticketSession && hasTicket) {
        return <GuestGettingTicketCard event={event} />
    }

    // Default: show pricing / buy tickets
    return <TicketPricingSection event={event} />
}