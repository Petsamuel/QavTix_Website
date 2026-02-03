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
}

const SplitPaymentContext = createContext<SplitPaymentContextType | undefined>(undefined)

export function SplitPaymentProvider({ children }: { children: ReactNode }) {
    const { selectedTickets, total } = useCheckout()
    const { user } = useTicketUser()
    const [splitMode, setSplitMode] = useState<SplitMode>('equal')
    const [splitPaymentEnabled, setSplitPaymentEnabled] = useState(false)
    const [attendees, setAttendees] = useState<AttendeeFormData[]>([])

    const totalAmount = total
    const canAddMoreAttendees = attendees.length < selectedTickets.reduce((v,c) => v+c.quantity,0)
    const [nextAttendeeId, setNextAttendeeId] = useState(1)

    const addAttendee = useCallback(() => {
        const newAttendee: AttendeeFormData = {
            attendeeID: nextAttendeeId,
            name: '',
            email: '',
            phone: '',
            amount: 0
        }
        setAttendees(prev => [...prev, newAttendee])
        setNextAttendeeId(prev => prev + 1) // increment for next
    }, [nextAttendeeId])

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
                phone: user.phone || ''
            })
        }
    }, [user, attendees, updateAttendee])

    const calculateEqualSplit = useCallback(() => {
        if (attendees.length === 0) return
        const amountPerAttendee = totalAmount / attendees.length
        setAttendees(prev => prev.map(a => ({ ...a, amount: amountPerAttendee })))
    }, [attendees.length, totalAmount])

    const getTotalAssignedAmount = useCallback(() => {
        return attendees.reduce((sum, a) => sum + (a.amount || 0), 0)
    }, [attendees])

    const getRemainingAmount = useCallback(() => {
        return totalAmount - getTotalAssignedAmount()
    }, [totalAmount, getTotalAssignedAmount])

    useEffect(() => {
        if (splitMode === 'equal' && attendees.length > 0) {
            calculateEqualSplit()
        }
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
            getRemainingAmount
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