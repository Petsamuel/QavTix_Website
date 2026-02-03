'use client'

import { useAppDispatch } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { AttendeeInformationData } from '@/schemas/checkout-flow.schema'
import { createContext, useState, ReactNode, useEffect, useContext, useMemo, useCallback } from 'react'

interface CheckoutTicket extends TicketTier {
    quantity: number
}

interface Discount {
    type: string
    code?: string
    percentage?: number
    amount?: number
    description: string
}

interface CheckoutState {
    currentStep: number
    tickets: CheckoutTicket[]
    attendeeInfo: Partial<AttendeeInformationData>
    paymentMethod: string | null
    isProcessing: boolean
    checkoutComplete: boolean
    discount: Discount | null
    subtotal: number
    eventIsAgeRestricted: boolean,
    total: number
    discountAmount: number
    totalTickets: number
    selectedTickets: CheckoutTicket[]
}

interface CheckoutActions {
    setCurrentStep: (step: number) => void
    canProceedToCheckout: () => boolean
    nextStep: () => void
    prevStep: () => void
    initializeTickets: (tickets: TicketTier[]) => void
    updateTicketQuantity: (ticketId: string, quantity: number) => void
    incrementTicket: (ticketId: string) => void
    decrementTicket: (ticketId: string) => void
    clearTickets: () => void
    updateAttendeeInfo: (data: Partial<AttendeeInformationData>) => void
    applyDiscount: (discount: Discount) => void
    removeDiscount: () => void
    validateCoupon: (code: string) => Promise<Discount | null>
    processPayment: () => Promise<void>
    resetCheckout: () => void
}

type CheckoutContextType = CheckoutState & CheckoutActions

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutFlowProvider({ children }: { children: ReactNode }) {

    const dispatch = useAppDispatch()
    const eventIsAgeRestricted = true;
    const [currentStep, setCurrentStep] = useState(1)
    const [tickets, setTickets] = useState<CheckoutTicket[]>([])
    const [attendeeInfo, setAttendeeInfo] = useState<Partial<AttendeeInformationData>>({})
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [checkoutComplete, setCheckoutComplete] = useState(false)
    const [discount, setDiscount] = useState<Discount | null>(null)

    const subtotal = useMemo(() => 
        tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0)
    , [tickets])

    const discountAmount = useMemo(() => {
        if (!discount) return 0
        return discount.percentage 
            ? subtotal * (discount.percentage / 100) 
            : Math.min(subtotal, discount.amount || 0)
    }, [discount, subtotal])

    const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount])

    const totalTickets = useMemo(() => 
        tickets.reduce((sum, t) => sum + t.quantity, 0)
    , [tickets])

    const selectedTickets = useMemo(() => 
        tickets.filter(t => t.quantity > 0)
    , [tickets])

    const getTicketSelectionError = useCallback(() => {
        if (tickets.length === 0) return 'No tickets available'
        if (totalTickets === 0) return 'Please select at least one ticket to continue'
        return null
    }, [tickets.length, totalTickets])

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentStep])

    const initializeTickets = useCallback((ticketTiers: TicketTier[]) => {
        setTickets(ticketTiers.map(t => ({ ...t, quantity: 0 })))
        setDiscount(null)
    }, [])

    const updateTicketQuantity = useCallback((ticketId: string, quantity: number) => {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, quantity: Math.max(0, quantity) } : t))
    }, [])

    const incrementTicket = useCallback((ticketId: string) => {
        setTickets(prev => prev.map(t => 
            t.id === ticketId && t.available && !t.soldOut ? { ...t, quantity: t.quantity + 1 } : t
        ))
    }, [])

    const decrementTicket = useCallback((ticketId: string) => {
        setTickets(prev => prev.map(t => t.id === ticketId && t.quantity > 0 ? { ...t, quantity: t.quantity - 1 } : t))
    }, [])

    const clearTickets = useCallback(() => {
        setTickets(prev => prev.map(t => ({ ...t, quantity: 0 })))
        setDiscount(null)
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep === 1) {
            const error = getTicketSelectionError()
            if (error) {
                dispatch(showAlert({ title: "", description: error, variant: "destructive" }))
                return
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }, [currentStep, getTicketSelectionError, dispatch])

    const prevStep = useCallback(() => setCurrentStep(prev => Math.max(prev - 1, 1)), [])

    const validateCoupon = useCallback(async (code: string) => {
        await new Promise(r => setTimeout(r, 800))
        if (code.toUpperCase() === 'WELCOME10') {
            return { type: 'coupon', code: 'WELCOME10', percentage: 10, description: '10% off' }
        }
        return null
    }, [])

    const updateAttendeeInfo = useCallback((data: Partial<AttendeeInformationData>) => {
        setAttendeeInfo(prev => ({ ...prev, ...data }))
    }, [])

    const processPayment = useCallback(async () => {
        const error = getTicketSelectionError()
        if (error) throw new Error(error)

        setIsProcessing(true)
        try {
            await new Promise(r => setTimeout(r, 1500))
            setCheckoutComplete(true)
        } finally {
            setIsProcessing(false)
        }
    }, [getTicketSelectionError])

    const resetCheckout = useCallback(() => {
        setCurrentStep(1)
        setTickets([])
        setAttendeeInfo({})
        setPaymentMethod(null)
        setCheckoutComplete(false)
        setDiscount(null)
    }, [])

    const canProceedToCheckout = useCallback(() => {
        const hasTickets = tickets.some(ticket => ticket.quantity > 0)
        return hasTickets
    }, [tickets])

    const value = useMemo(() => ({
        currentStep, tickets, eventIsAgeRestricted, attendeeInfo, paymentMethod,
        isProcessing, checkoutComplete, discount, subtotal, total,
        discountAmount, totalTickets, selectedTickets,
        setCurrentStep, nextStep, prevStep, initializeTickets,
        updateTicketQuantity, canProceedToCheckout, incrementTicket, decrementTicket, clearTickets,
        updateAttendeeInfo, applyDiscount: setDiscount,
        removeDiscount: () => setDiscount(null), validateCoupon,
        processPayment, resetCheckout
    }), [
        currentStep, tickets, attendeeInfo, paymentMethod,
        isProcessing, checkoutComplete, discount, subtotal, total,
        discountAmount, totalTickets, selectedTickets,
        nextStep, initializeTickets, updateTicketQuantity, incrementTicket,
        decrementTicket, clearTickets, validateCoupon, canProceedToCheckout,
        processPayment, resetCheckout
    ])

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    )
}

export function useCheckout() {
    const context = useContext(CheckoutContext)
    if (!context) throw new Error('useCheckout must be used within CheckoutFlowProvider')
    return context
}