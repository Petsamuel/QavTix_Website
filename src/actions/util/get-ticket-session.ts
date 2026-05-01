export type GuestTicketSession = {
    eventId:       string
    attendeeName:  string
    attendeeEmail: string
    purchaseDate:  string
}

const SESSION_KEY = 'guest_ticket_session'

export function setGuestTicketSession(data: GuestTicketSession) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('guest-ticket-session-updated'))
    }
}

export function getGuestTicketSession(): GuestTicketSession | null {
    try {
        const raw = sessionStorage.getItem(SESSION_KEY)
        if (!raw) return null
        return JSON.parse(raw) as GuestTicketSession
    } catch {
        return null
    }
}

export function clearGuestTicketSession() {
    sessionStorage.removeItem(SESSION_KEY)
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('guest-ticket-session-updated'))
    }
}

export function hasGuestTicketForEvent(eventId: string): boolean {
    return getGuestTicketSession()?.eventId === eventId
}