'use client'

import { useAppDispatch } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { AttendeeInformationData } from '@/schemas/checkout-flow.schema'
import { createContext, useState, ReactNode, useEffect, useContext, useMemo, useCallback } from 'react'
import { Group } from '@/actions/groups'

// ─── Adapted ticket type ───────────────────────────────────────────────────────
export interface CheckoutTicket {
    _key:          string
    ticket_type:   string
    description:   string
    price:         number 
    quantity:      number
    maxQuantity:   number 
    totalStock:    number
    available:     boolean
    soldOut:       boolean
    sales_start:   string
    sales_end:     string
    promo_codes:   EventTicketPromoCode[]
}

interface Discount {
    type:         string
    code?:        string
    percentage?:  number
    amount?:      number
    description:  string
}

interface CheckoutState {
    event:                EventDetails
    groups:               Group[]
    currentStep:          number
    tickets:              CheckoutTicket[]
    attendeeInfo:         Partial<AttendeeInformationData>
    paymentMethod:        string | null
    isProcessing:         boolean
    checkoutComplete:     boolean
    discount:             Discount | null
    subtotal:             number
    total:                number
    discountAmount:       number
    totalTickets:         number
    selectedTickets:      CheckoutTicket[]
}

interface CheckoutActions {
    setCurrentStep:       (step: number) => void
    canProceedToCheckout: () => boolean
    nextStep:             () => void
    prevStep:             () => void
    updateTicketQuantity: (key: string, quantity: number) => void
    incrementTicket:      (key: string) => void
    decrementTicket:      (key: string) => void
    clearTickets:         () => void
    updateAttendeeInfo:   (data: Partial<AttendeeInformationData>) => void
    applyDiscount:        (discount: Discount) => void
    removeDiscount:       () => void
    validateCoupon:       (code: string) => Promise<Discount | null>
    processPayment:       () => Promise<void>
    resetCheckout:        () => void
}

type CheckoutContextType = CheckoutState & CheckoutActions

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface Props {
    children: ReactNode
    event:    EventDetails
    groups:   Group[]
}



function normaliseTicket(t: EventTicket, index: number): CheckoutTicket {
    const totalStock = t.quantity ?? 0
    return {
        _key:        `${t.ticket_type}-${index}`,
        ticket_type: t.ticket_type,
        description: t.description,
        price:       Number(t.price) || 0,
        quantity:    0,
        maxQuantity: t.per_person_max ?? 10,
        totalStock,
        available:   totalStock > 0,
        soldOut:     totalStock === 0,
        sales_start: t.sales_start,
        sales_end:   t.sales_end,
        promo_codes: t.promo_codes ?? [],
    }
}

export function CheckoutFlowProvider({ children, event, groups }: Props) {
    const dispatch = useAppDispatch()

    const [currentStep,      setCurrentStep]      = useState(1)
    const [tickets,          setTickets]           = useState<CheckoutTicket[]>(
        () => (event.tickets ?? []).map(normaliseTicket)
    )
    const [attendeeInfo,     setAttendeeInfo]      = useState<Partial<AttendeeInformationData>>({})
    const [paymentMethod,    setPaymentMethod]     = useState<string | null>(null)
    const [isProcessing,     setIsProcessing]      = useState(false)
    const [checkoutComplete, setCheckoutComplete]  = useState(false)
    const [discount,         setDiscount]          = useState<Discount | null>(null)

    const subtotal = useMemo(
        () => tickets.reduce((sum, t) => sum + t.price * t.quantity, 0),
        [tickets]
    )

    const discountAmount = useMemo(() => {
        if (!discount) return 0
        return discount.percentage
            ? subtotal * (discount.percentage / 100)
            : Math.min(subtotal, discount.amount ?? 0)
    }, [discount, subtotal])

    const total = useMemo(() => Math.max(0, subtotal - discountAmount), [subtotal, discountAmount])

    const totalTickets = useMemo(
        () => tickets.reduce((sum, t) => sum + t.quantity, 0),
        [tickets]
    )

    const selectedTickets = useMemo(
        () => tickets.filter(t => t.quantity > 0),
        [tickets]
    )

    const getTicketSelectionError = useCallback(() => {
        if (tickets.length === 0) return 'No tickets available for this event'
        if (totalTickets === 0)   return 'Please select at least one ticket to continue'
        return null
    }, [tickets.length, totalTickets])

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentStep])

    const updateTicketQuantity = useCallback((key: string, quantity: number) => {
        setTickets(prev =>
            prev.map(t =>
                t._key === key
                    ? { ...t, quantity: Math.min(Math.max(0, quantity), t.maxQuantity) }
                    : t
            )
        )
    }, [])

    const incrementTicket = useCallback((key: string) => {
        setTickets(prev =>
            prev.map(t =>
                t._key === key && t.available && !t.soldOut && t.quantity < t.maxQuantity
                    ? { ...t, quantity: t.quantity + 1 }
                    : t
            )
        )
    }, [])

    const decrementTicket = useCallback((key: string) => {
        setTickets(prev =>
            prev.map(t =>
                t._key === key && t.quantity > 0
                    ? { ...t, quantity: t.quantity - 1 }
                    : t
            )
        )
    }, [])

    const clearTickets = useCallback(() => {
        setTickets(prev => prev.map(t => ({ ...t, quantity: 0 })))
        setDiscount(null)
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep === 1) {
            const error = getTicketSelectionError()
            if (error) {
                dispatch(showAlert({ title: '', description: error, variant: 'destructive' }))
                return
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }, [currentStep, getTicketSelectionError, dispatch])

    const prevStep = useCallback(() => setCurrentStep(prev => Math.max(prev - 1, 1)), [])

    const validateCoupon = useCallback(async (code: string): Promise<Discount | null> => {
        // TODO: replace with real API call
        await new Promise(r => setTimeout(r, 800))
        if (code.toUpperCase() === 'WELCOME10') {
            return { type: 'coupon', code: 'WELCOME10', percentage: 10, description: '10% off' }
        }
        // Check against event promo codes
        for (const ticket of tickets) {
            const match = ticket.promo_codes.find(
                p => p.code.toUpperCase() === code.toUpperCase()
            )
            if (match) {
                return {
                    type:        'promo',
                    code:        match.code,
                    percentage:  match.discount_percentage,
                    description: `${match.discount_percentage}% off`,
                }
            }
        }
        return null
    }, [tickets])

    const updateAttendeeInfo = useCallback((data: Partial<AttendeeInformationData>) => {
        setAttendeeInfo(prev => ({ ...prev, ...data }))
    }, [])

    const processPayment = useCallback(async () => {
        const error = getTicketSelectionError()
        if (error) throw new Error(error)
        setIsProcessing(true)
        try {
            // TODO: replace with real payment action
            await new Promise(r => setTimeout(r, 1500))
            setCheckoutComplete(true)
        } finally {
            setIsProcessing(false)
        }
    }, [getTicketSelectionError])

    const resetCheckout = useCallback(() => {
        setCurrentStep(1)
        setTickets((event.tickets ?? []).map(normaliseTicket))
        setAttendeeInfo({})
        setPaymentMethod(null)
        setCheckoutComplete(false)
        setDiscount(null)
    }, [event.tickets])

    const canProceedToCheckout = useCallback(
        () => tickets.some(t => t.quantity > 0),
        [tickets]
    )

    const value = useMemo<CheckoutContextType>(() => ({
        event,
        groups,
        currentStep,
        tickets,
        attendeeInfo,
        paymentMethod,
        isProcessing,
        checkoutComplete,
        discount,
        subtotal,
        total,
        discountAmount,
        totalTickets,
        selectedTickets,
        setCurrentStep,
        nextStep,
        prevStep,
        updateTicketQuantity,
        incrementTicket,
        decrementTicket,
        clearTickets,
        canProceedToCheckout,
        updateAttendeeInfo,
        applyDiscount:  setDiscount,
        removeDiscount: () => setDiscount(null),
        validateCoupon,
        processPayment,
        resetCheckout,
    }), [
        event, groups, currentStep, tickets, attendeeInfo, paymentMethod,
        isProcessing, checkoutComplete, discount, subtotal, total,
        discountAmount, totalTickets, selectedTickets,
        nextStep, prevStep, updateTicketQuantity, incrementTicket,
        decrementTicket, clearTickets, canProceedToCheckout,
        updateAttendeeInfo, validateCoupon, processPayment, resetCheckout,
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