'use client'

import { hasGuestTicketForEvent, GuestTicketSession } from '@/actions/util/get-ticket-session'
import { createContext, useContext, ReactNode } from 'react'

interface TicketUserContextType {
    user: AuthUser | null
    ticketSession: GuestTicketSession | null
    isAuthenticated: boolean
    hasTicketSession: boolean
}

const TicketUserContext = createContext<TicketUserContextType | undefined>(undefined)

interface TicketUserProviderProps {
    children: ReactNode
    user: AuthUser | null
    ticketSession: GuestTicketSession | null
}

export function TicketUserProvider({ 
    children, 
    user, 
    ticketSession 
}: TicketUserProviderProps) {
    const value: TicketUserContextType = {
        user,
        ticketSession,
        isAuthenticated: !!user,
        hasTicketSession: !!ticketSession
    }

    return (
        <TicketUserContext.Provider value={value}>
            {children}
        </TicketUserContext.Provider>
    )
}

export function useTicketUser() {
    const context = useContext(TicketUserContext)
    if (context === undefined) {
        throw new Error('useTicketUser must be used within TicketUserProvider')
    }
    return context
}

export function useUser() {
    const { user, isAuthenticated } = useTicketUser()
    return { user, isAuthenticated }
}

export function useTicketSession() {
    const { ticketSession, hasTicketSession } = useTicketUser()
    return { ticketSession, hasTicketSession }
}

export function useHasTicketForEvent(eventID: string) {
    // GUEST — CHECK SESSIONSTORAGE (CLIENT ONLY)
    if (typeof window !== 'undefined') {
        return hasGuestTicketForEvent(eventID)
    }

    return false
}