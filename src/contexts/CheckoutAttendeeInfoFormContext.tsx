'use client'

// Separated from CheckoutFlowProvider intentionally —
// form state is kept isolated so the summary component can
// access agreeToTerms without re-rendering the whole checkout tree.

import { createContext, useContext, ReactNode } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AttendeeInformationData, attendeeInformationSchema } from '@/schemas/checkout-flow.schema'

interface CheckoutAttendeeInfoFormContextType {
    form: UseFormReturn<AttendeeInformationData>
}

const CheckoutAttendeeInfoFormContext = createContext<CheckoutAttendeeInfoFormContextType | undefined>(undefined)

interface Props {
    children:      ReactNode
    /** Passed from the server — drives whether dateOfBirth validation is active */
    ageRestricted: boolean
}

export function CheckoutAttendeeInfoFormProvider({ children, ageRestricted }: Props) {
    const form = useForm<AttendeeInformationData>({
        resolver:       zodResolver(attendeeInformationSchema),
        reValidateMode: 'onChange',
        mode:           'onChange',
        defaultValues: {
            name:           '',
            email:          '',
            phone:          '',
            // If age-restricted, leave empty so Zod enforces it.
            // Otherwise default to a placeholder so the field passes validation silently.
            dateOfBirth:    ageRestricted ? '' : '2000-01-01',
            sendUpdates:    false,
            shareWithGroup: false,
            keepInLoop:     false,
            splitPayment:   false,
            agreeToTerms:   false,
        },
    })

    return (
        <CheckoutAttendeeInfoFormContext.Provider value={{ form }}>
            {children}
        </CheckoutAttendeeInfoFormContext.Provider>
    )
}

export function useCheckoutAttendeeInfoForm() {
    const context = useContext(CheckoutAttendeeInfoFormContext)
    if (!context) throw new Error('useCheckoutAttendeeInfoForm must be used within CheckoutAttendeeInfoFormProvider')
    return context
}