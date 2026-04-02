'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { useTicketUser } from '@/contexts/TicketUserProvider'
import { AttendeeFormData, SplitMode } from '@/schemas/checkout-flow.schema'

interface SplitPaymentContextType {
    splitMode: SplitMode
    nextAttendeeId: number,
    setSplitMode: (mode: SplitMode) => void
    attendees: AttendeeFormData[]
    addAttendee: () => void
    removeAttendee: (attendeeID: number) => void
    splitPaymentEnabled: boolean,
    setSplitPaymentEnabled: (splitPaymentEnabled: boolean) => void
    updateAttendee: (attendeeID: number, data: Partial<AttendeeFormData>) => void
    copyFromSource: (attendeeID: number, source: 'myself' | string) => void
    canAddMoreAttendees: boolean
    calculateEqualSplit: () => void
    getTotalAssignedAmount: () => number
    getRemainingAmount: () => number
    splitError: string | null
    isSplitValid: boolean
}

const SplitPaymentContext = createContext<SplitPaymentContextType | undefined>(undefined)

export function SplitPaymentProvider({ children }: { children: ReactNode }) {
    const { selectedTickets, total, event } = useCheckout()
    const { user } = useTicketUser()
    const [splitMode, setSplitMode] = useState<SplitMode>('equal')
    const [splitPaymentEnabled, setSplitPaymentEnabled] = useState(false)
    const [attendees, setAttendees] = useState<AttendeeFormData[]>([])

    const totalAmount = total
    const totalTicketsSelected = selectedTickets.reduce((sum, ticket) => sum + ticket.quantity, 0)
    const canAddMoreAttendees = attendees.length < (totalTicketsSelected - 1) // initiator takes 1 slot
    const [nextAttendeeId, setNextAttendeeId] = useState(1)

    const isAgeRestricted = event.age_restriction

    const addAttendee = useCallback(() => {
        const newAttendee: AttendeeFormData = {
            attendeeID: nextAttendeeId,
            name: '',
            email: '',
            phone: '',
            amount: splitMode === 'equal' ? totalAmount / (attendees.length + 2) : 0,
            dateOfBirth: isAgeRestricted ? '' : '2000-01-01'
        }
        setAttendees(prev => [...prev, newAttendee])
        setNextAttendeeId(prev => prev + 1) // increment for next
    }, [nextAttendeeId, splitMode, totalAmount, attendees.length, isAgeRestricted])

    const removeAttendee = useCallback((id: number) => {
        setAttendees(prev => prev.filter(a => a.attendeeID !== id))
    }, [])

    const updateAttendee = useCallback((id: number, data: Partial<AttendeeFormData>) => {
        setAttendees(prev => prev.map(a => 
            a.attendeeID === id ? { ...a, ...data } : a
        ))
    }, [])

    const copyFromSource = useCallback((attendeeID: number, source: string) => {
        if (source === 'myself' && user) {
            updateAttendee(attendeeID, {
                name: user.full_name,
                email: user.email,
                phone: user.phone_number || ''
            })
        }
    }, [user, attendees, updateAttendee])

    const calculateEqualSplit = useCallback(() => {
        if (attendees.length === 0) return
        const amountPerAttendee = totalAmount / (attendees.length + 1) // +1 for initiator
        setAttendees(prev => prev.map(a => ({ ...a, amount: amountPerAttendee })))
    }, [attendees.length, totalAmount])

    const getTotalAssignedAmount = useCallback(() => {
        return attendees.reduce((sum, a) => sum + (a.amount || 0), 0)
    }, [attendees])

    const [splitError, setSplitError] = useState<string | null>(null)

    const getRemainingAmount = useCallback(() => {
        return totalAmount - getTotalAssignedAmount()
    }, [totalAmount, getTotalAssignedAmount])

    useEffect(() => {
        if (!splitPaymentEnabled || attendees.length === 0) {
            setSplitError(null)
            return
        }

        if (splitMode === 'manual') {
            const assigned = getTotalAssignedAmount()

            if (assigned <= 0) {
                setSplitError('At least one group member must have a positive assigned amount.')
            } else if (assigned >= totalAmount) {
                setSplitError('Initiator must retain a positive remaining balance to pay.')
            } else {
                setSplitError(null)
            }
        } else {
            setSplitError(null)
        }
    }, [splitPaymentEnabled, splitMode, attendees, totalAmount, getTotalAssignedAmount])

    useEffect(() => {
        if (splitMode === 'equal' && attendees.length > 0) {
            calculateEqualSplit()
        }
        // When switching to manual, the equal split values persist automatically
        // allowing users to adjust individual amounts while keeping the equal calculation
    }, [splitMode, attendees.length, calculateEqualSplit])

    return (
        <SplitPaymentContext.Provider value={{
            splitMode,
            setSplitMode,
            attendees,
            setSplitPaymentEnabled,
            splitPaymentEnabled,
            addAttendee,
            removeAttendee,
            nextAttendeeId,
            updateAttendee,
            copyFromSource,
            canAddMoreAttendees,
            calculateEqualSplit,
            getTotalAssignedAmount,
            getRemainingAmount,
            splitError,
            isSplitValid: !splitError
        }}>
            {children}
        </SplitPaymentContext.Provider>
    )
}

export function useSplitPayment() {
    const context = useContext(SplitPaymentContext)
    if (!context) {
        throw new Error('useSplitPayment must be used within SplitPaymentProvider')
    }
    return context
}