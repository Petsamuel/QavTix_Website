'use client'

import { initializePayment, validatePromoCode, verifyPayment } from '@/actions/checkout'
import { getUserLocation } from '@/actions/getters'
import { setGuestTicketSession } from '@/actions/util/get-ticket-session'
import { extractAccessCode } from '@/helper-fns/extractAccessCode'
import { buildEqualSplitMembers, buildManualSplitMembers, SplitMember, validateSplitMembers } from '@/helper-fns/splitpaymentValidator'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { AttendeeInformationData, SplitMode } from '@/schemas/checkout-flow.schema'
import { usePathname } from 'next/navigation'
import { createContext, useState, ReactNode, useEffect, useContext, useMemo, useCallback, Dispatch, SetStateAction } from 'react'


// SHAPE OF A SINGLE TICKET IN THE CHECKOUT FLOW — NORMALISED FROM THE RAW EVENT TICKET
export interface CheckoutTicket {
    _key:          string
    ticket_type:   string
    description:   string
    id:            number
    price:         number 
    quantity:      number  // CURRENT QUANTITY SELECTED BY THE USER
    maxQuantity:   number  // PER-PERSON LIMIT ENFORCED BY THE EVENT
    totalStock:    number
    available:     boolean
    soldOut:       boolean
    sales_start:   string
    sales_end:     string
    currency:      string
    promo_codes:   EventTicketPromoCode[]
}

// DISCOUNT APPLIED VIA PROMO CODE — SUPPORTS BOTH PERCENTAGE AND FLAT AMOUNT
interface Discount {
    type:         string
    code?:        string
    percentage?:  number
    amount?:      number
    description:  string
}

// ALL READABLE STATE EXPOSED BY THE CHECKOUT CONTEXT
interface CheckoutState {
    event:                EventDetails
    groups:               Group[]
    currentStep:          number
    tickets:              CheckoutTicket[]
    attendeeInfo:         Partial<AttendeeInformationData>
    paymentMethod:        string | null
    isProcessing:         boolean
    checkoutComplete:     boolean  // FLIPS TO TRUE AFTER SUCCESSFUL PAYMENT VERIFICATION
    isSplitPayment:       boolean  // TRACKS IF THE SUCCESSFUL PAYMENT WAS A SPLIT PAYMENT
    discount:             Discount | null
    subtotal:             number
    total:                number   // SUBTOTAL MINUS ANY DISCOUNT
    discountAmount:       number
    totalTickets:         number   // SUM OF ALL SELECTED TICKET QUANTITIES
    selectedTickets:      CheckoutTicket[]  // ONLY TICKETS WITH QUANTITY > 0
}

// ALL ACTIONS EXPOSED BY THE CHECKOUT CONTEXT
interface CheckoutActions {
    setCurrentStep:       (step: number) => void
    canProceedToCheckout: () => boolean
    nextStep:             () => void
    prevStep:             () => void
    isMarketplace:        boolean
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

// CONTEXT IS UNDEFINED BY DEFAULT — useCheckout ENFORCES PROVIDER WRAPPING
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

interface Props {
    children: ReactNode
    event:    EventDetails
    groups:   Group[]
}


// MAPS A RAW API TICKET TO THE NORMALISED CHECKOUT TICKET SHAPE
// INDEX IS USED TO GENERATE A STABLE UNIQUE KEY FOR REACT RENDERING
function normaliseTicket(t: EventTicket, index: number, quantity: number = 0): CheckoutTicket {
    const totalStock = t.quantity ?? 0
    return {
        _key:        `${t.ticket_type}-${index}`,
        ticket_type: t.ticket_type,
        id:          t.id,
        description: t.description,
        price:       Number(t.price) || 0,
        quantity,  // ALWAYS STARTS AT 0 — USER SELECTS QUANTITY IN STEP 1 UNLESS FOR MARKETPLACE TICKET
        maxQuantity: t.per_person_max ?? 10,
        totalStock,
        available:   totalStock > 0,
        soldOut:     totalStock === 0,
        currency:    t.currency,
        sales_start: t.sales_start,
        sales_end:   t.sales_end,
        promo_codes: t.promo_codes ?? [],
    }
}

export function CheckoutFlowProvider({ children, event, groups }: Props) {

    const { user } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const pathName = usePathname()
    const isMarketplace = pathName.includes("marketplace")
    const [isSplitPayment, setIsSplitPayment] = useState(false)

    const [currentStep,setCurrentStep] = useState(1)

    // Initialize tickets for checkout
    // Marketplace uses single .ticket, regular events use .tickets array
    // All quantities start at 0
    const [tickets, setTickets] = useState<CheckoutTicket[]>(
        () => {
            if (isMarketplace) {
                return [(event as MarketplaceEventDetails).ticket]
                    .filter(Boolean)
                    .map((e, i) => normaliseTicket({...e, id: Number((event as MarketplaceEventDetails).listing_id)}, i, 1))  // MARKETPLACE TICKETS START WITH QUANTITY 1
            }
            return (event.tickets ?? []).map((e, i) => normaliseTicket(e, i))
        }
    )

    // ATTENDEE INFO IS SYNCED IN FROM THE FORM BEFORE STEP 3 TRIGGERS PAYMENT
    const [attendeeInfo,     setAttendeeInfo]      = useState<Partial<AttendeeInformationData>>({})
    const [paymentMethod,    setPaymentMethod]     = useState<string | null>(null)
    const [isProcessing,     setIsProcessing]      = useState(false)
    const [checkoutComplete, setCheckoutComplete]  = useState(false)
    const [discount,         setDiscount]          = useState<Discount | null>(null)

    // DERIVED TOTALS — RECOMPUTED ONLY WHEN TICKETS OR DISCOUNT CHANGES
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

    // CONVENIENCE SLICE — ONLY TICKETS THE USER HAS ACTUALLY SELECTED
    const selectedTickets = useMemo(
        () => tickets.filter(t => t.quantity > 0),
        [tickets]
    )

    // RETURNS AN ERROR STRING IF THE USER CANNOT PROCEED — NULL IF VALID
    const getTicketSelectionError = useCallback(() => {
        if (tickets.length === 0) return 'No tickets available for this event'
        if (totalTickets === 0)   return 'Please select at least one ticket to continue'
        return null
    }, [tickets.length, totalTickets])

    // SCROLL TO TOP WHENEVER THE USER MOVES BETWEEN STEPS
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
                // ONLY INCREMENT IF THE TICKET IS AVAILABLE AND UNDER THE PER-PERSON LIMIT
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

    // RESETS ALL QUANTITIES TO 0 AND CLEARS ANY ACTIVE DISCOUNT
    const clearTickets = useCallback(() => {
        setTickets(prev => prev.map(t => ({ ...t, quantity: 0 })))
        setDiscount(null)
    }, [])

    const nextStep = useCallback(() => {

        // STEP 3 IS THE PAYMENT TRIGGER — VALIDATE ATTENDEE INFO BEFORE FIRING
        if (currentStep === 3) {
            if (!attendeeInfo.name || !attendeeInfo.email || !attendeeInfo.phone || !attendeeInfo.dateOfBirth) {
                dispatch(showAlert({
                    title:       'Incomplete Information',
                    description: 'Please fill in all required fields before proceeding to checkout.',
                    variant:     'destructive',
                }))
                return
            }

            processPayment()
            return;
        }

        // STEP 1 GATE — MUST HAVE AT LEAST ONE TICKET SELECTED TO CONTINUE
        if (currentStep === 1) {
            const error = getTicketSelectionError()
            if (error) {
                dispatch(showAlert({ title: '', description: error, variant: 'destructive' }))
                return
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, 3))
    }, [currentStep, getTicketSelectionError, dispatch])

    const prevStep = useCallback(() => setCurrentStep(prev => Math.max(prev - 1, 1)), [])

    // CALLS THE SERVER ACTION TO VALIDATE A PROMO CODE AGAINST THE EVENT
    // RETURNS A DISCOUNT OBJECT ON SUCCESS OR NULL IF INVALID
    const validateCoupon = useCallback(async (code: string): Promise<Discount | null> => {
        const result = await validatePromoCode({ code, event_id: event.id })

        if (!result.success || !result.data) {
            dispatch(showAlert({
                title:       'Invalid Promo Code',
                description: 'The promo code you entered is invalid. Please try again.',
            }))

            return null;
        }

        return {
            type:        result.data.type,
            code:        result.data.code,
            percentage:  result.data.percentage,
            amount:      result.data.amount,
            description: result.data.description,
        }
    }, [event.id])

    // MERGES PARTIAL FORM DATA INTO ATTENDEE INFO STATE
    // CALLED FROM CheckoutFlowActionBtns AFTER STEP 2 FORM VALIDATES SUCCESSFULLY
    const updateAttendeeInfo = useCallback((data: Partial<AttendeeInformationData>) => {
        setAttendeeInfo(prev => ({ ...prev, ...data }))
    }, [])




    // PROCESSES THE PAYMENT BY CALLING THE INITIALIZE PAYMENT ACTION, THEN LAUNCHES THE PAYSTACK INLINE CHECKOUT
    const processPayment = useCallback(async () => {
        const ticketError = getTicketSelectionError()
        if (ticketError) throw new Error(ticketError)

        setIsProcessing(true)

        try {
            const { country } = await getUserLocation()

            const isSplit = !!attendeeInfo?.shareWithGroup && (attendeeInfo.attendees?.length ?? 0) > 0;
            const splitMode = (attendeeInfo as any).splitMode as SplitMode ?? 'equal'
            
            // Track if this is split payment for success message
            setIsSplitPayment(isSplit)

            // Validate split members before touching the API 
            if (isSplit) {
                const splitError = validateSplitMembers(
                    attendeeInfo.attendees ?? [],
                    splitMode,
                    total,
                    event.age_restriction,
                )
                if (splitError) {
                    dispatch(showAlert({ title: 'Split Payment Error', description: splitError, variant: 'destructive' }))
                    return
                }
            }

            const splitMembers: SplitMember[] = isSplit
                ? splitMode === 'equal'
                    ? buildEqualSplitMembers(
                        (attendeeInfo.attendees ?? []).map(a => ({
                            email:         a.email,
                            dateOfBirth:   a.dateOfBirth,
                        }))
                      )
                    : buildManualSplitMembers(
                        (attendeeInfo.attendees ?? []).map(a => ({
                            email:         a.email,
                            dateOfBirth:   a.dateOfBirth,
                            amount:        a.amount ?? 0,
                        })),
                        total,
                      )
                : []

            const paymentPayload: InitializePaymentPayload = isMarketplace
                ? {
                    full_name:              attendeeInfo.name!,
                    phone_number:           attendeeInfo.phone!,
                    is_split:               isSplit,
                    marketplace_listing_id: (event as MarketplaceEventDetails).listing_id,
                    promo_code:             discount?.code ?? '',
                    save_card:              false,
                    date_of_birth:          attendeeInfo.dateOfBirth || '',
                    tickets:                [],
                    ...(isSplit && { split_members: splitMembers }),
                }
                : {
                    full_name:     attendeeInfo.name!,
                    event_id:      event.id,
                    phone_number:  attendeeInfo.phone!,
                    is_split:      isSplit,
                    tickets:       selectedTickets.map(t => ({
                        ticket_id: t.id,
                        quantity:  t.quantity,
                    })),
                    promo_code:    discount?.code ?? '',
                    save_card:     false,
                    date_of_birth: attendeeInfo.dateOfBirth || '',
                    ...(isSplit && { split_members: splitMembers }),
                }

            const init = await initializePayment(paymentPayload)

            if (!init.success || !init.checkout_url) {
                dispatch(showAlert({
                    title:       'Payment Error',
                    description: init.message ?? 'Could not initialize payment.',
                    variant:     'destructive',
                }))
                return
            }

            const PaystackPop  = (await import('@paystack/inline-js')).default
            const handler      = new PaystackPop()
            const accessCode   = extractAccessCode(init.checkout_url)

            handler.resumeTransaction(accessCode, {
                onSuccess: async (transaction: { reference: string }) => {
                    const verify = await verifyPayment({
                        reference: transaction.reference,
                        save_card: false,
                        country:   user?.country || country,
                    })

                    if (!verify.success) {
                        dispatch(showAlert({
                            title:       'Verification Failed',
                            description: verify.message ?? 'Payment could not be verified.',
                            variant:     'destructive',
                        }))
                        return
                    }

                    if (!user) {
                        setGuestTicketSession({
                            eventId:       event.id,
                            attendeeName:  attendeeInfo.name!,
                            attendeeEmail: attendeeInfo.email!,
                            purchaseDate:  new Date().toISOString(),
                        })
                    }

                    dispatch(showAlert({
                        title: isSplit ? 'Split Payment Successful!' : 'Payment Successful!',
                        description: isSplit 
                            ? 'Your tickets have been secured. All group members will receive their tickets once they complete payment.'
                            : 'Your tickets have been secured. Check your email for confirmation.',
                        variant: 'default',
                        duration: 6000
                    }))
                    setCheckoutComplete(true)
                },

                onCancel: () => {
                    dispatch(showAlert({
                        title:       'Payment Cancelled',
                        description: 'You cancelled the payment. Your tickets were not issued.',
                        variant:     'destructive',
                    }))
                },
            })

        } finally {
            setIsProcessing(false)
        }
    }, [
        getTicketSelectionError,
        attendeeInfo,
        event,
        selectedTickets,
        discount,
        dispatch,
        isMarketplace,
        user,
        total,
    ])

    // FULL RESET — BRINGS THE CHECKOUT BACK TO ITS INITIAL STATE
    const resetCheckout = useCallback(() => {
        setCurrentStep(1)
        setTickets((event.tickets ?? []).map((e, i) => normaliseTicket(e,i)))
        setAttendeeInfo({})
        setPaymentMethod(null)
        setCheckoutComplete(false)
        setIsSplitPayment(false)
        setDiscount(null)
    }, [event.tickets])

    // TRUE IF THE USER HAS SELECTED AT LEAST ONE TICKET — USED TO GATE NAVIGATION PROMPTS
    const canProceedToCheckout = useCallback(
        () => tickets.some(t => t.quantity > 0),
        [tickets]
    )

    // SECONDARY GUARD — WATCHES FOR STEP 3 AND RE-VALIDATES ATTENDEE INFO BEFORE PAYMENT
    // THIS CATCHES CASES WHERE processPayment IS CALLED OUTSIDE OF nextStep
    useEffect(() => {
        if (currentStep === 3) {
            if (!attendeeInfo.name || !attendeeInfo.email || !attendeeInfo.phone || !attendeeInfo.dateOfBirth) {
                dispatch(showAlert({
                    title:       'Incomplete Information',
                    description: 'Please fill in all required fields before proceeding to checkout.',
                    variant:     'destructive',
                }))
                return
            }
            
            processPayment()
        }
    }, [currentStep, attendeeInfo, processPayment, dispatch])

    const value = useMemo<CheckoutContextType>(() => ({
        event,
        groups,
        currentStep,
        tickets,
        isMarketplace,
        attendeeInfo,
        paymentMethod,
        isProcessing,
        checkoutComplete,
        isSplitPayment,
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
        discountAmount, totalTickets, selectedTickets, isSplitPayment,
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