'use client'

import { TicketSession } from '@/actions/util/get-ticket-session'
import { createContext, useContext, ReactNode } from 'react'

interface TicketUserContextType {
    user: AuthUser | null
    ticketSession: TicketSession | null
    isAuthenticated: boolean
    hasTicketSession: boolean
}

const TicketUserContext = createContext<TicketUserContextType | undefined>(undefined)

interface TicketUserProviderProps {
    children: ReactNode
    user: AuthUser | null
    ticketSession: TicketSession | null
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

export function useHasTicketForEvent(eventId: string) {
    const { ticketSession } = useTicketUser()
    return ticketSession?.eventId === eventId
}