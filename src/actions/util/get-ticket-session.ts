'use server'

import { cookies } from 'next/headers'

export type TicketSession = {
    orderId: string
    eventId: string
    tickets: {
        ticketId: string
        quantity: number
        attendeeName: string
        attendeeEmail: string
    }[]
    purchaseDate: string
    expiresAt: string
}

const SESSION_DURATION = 30 * 24 * 60 * 60

export async function createTicketSession(data: Omit<TicketSession, 'expiresAt'>) {
    const cookieStore = await cookies()
    
    const session: TicketSession = {
        ...data,
        expiresAt: new Date(Date.now() + SESSION_DURATION * 1000).toISOString()
    }
    
    cookieStore.set('ticket_session', JSON.stringify(session), {
        maxAge: SESSION_DURATION,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    })
}

export async function getTicketSession(): Promise<TicketSession | null> {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('ticket_session')?.value
    
    if (!sessionCookie) return null
    
    try {
        const session = JSON.parse(sessionCookie) as TicketSession
        
        if (new Date(session.expiresAt) < new Date()) {
            await clearTicketSession()
            return null
        }
        
        return session
    } catch {
        return null
    }
}

export async function clearTicketSession() {
    const cookieStore = await cookies()
    cookieStore.delete('ticket_session')
}

export async function hasTicketForEvent(eventId: string): Promise<boolean> {
    const session = await getTicketSession()
    return session?.eventId === eventId
}