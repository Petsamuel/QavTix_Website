'use client'

import { hasGuestTicketForEvent, GuestTicketSession, getGuestTicketSession } from '@/actions/util/get-ticket-session'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

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
    ticketSession: initialTicketSession 
}: TicketUserProviderProps) {
    const [ticketSession, setTicketSession] = useState<GuestTicketSession | null>(initialTicketSession)

    useEffect(() => {
        // Hydrate from sessionStorage on the client since it's not available on the server
        const loadSession = () => {
            const session = getGuestTicketSession()
            setTicketSession(session)
        }

        if (!initialTicketSession) {
            loadSession()
        }

        // Listen for updates from same tab (e.g. after checkout completion)
        window.addEventListener('guest-ticket-session-updated', loadSession)
        
        // Listen for updates from other tabs
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'guest_ticket_session') loadSession()
        }
        window.addEventListener('storage', handleStorage)

        return () => {
            window.removeEventListener('guest-ticket-session-updated', loadSession)
            window.removeEventListener('storage', handleStorage)
        }
    }, [initialTicketSession])

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
    const { ticketSession } = useTicketUser()
    
    // Check if the current user/guest session has a ticket for this event
    return ticketSession?.eventId === eventID
}