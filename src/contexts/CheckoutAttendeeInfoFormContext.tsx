'use client'

// We are using this due to the layout shift on the sign, where by 
// Accept Terms and Condition Input appears on the summary component


import { createContext, useContext, ReactNode } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AttendeeInformationData, attendeeInformationSchema } from '@/schemas/checkout-flow.schema'

interface CheckoutAttendeeInfoFormContextType {
    form: UseFormReturn<AttendeeInformationData>
}

const CheckoutAttendeeInfoFormContext = createContext<CheckoutAttendeeInfoFormContextType | undefined>(undefined)

export function CheckoutAttendeeInfoFormProvider({ children }: { children: ReactNode }) {

    const form = useForm<AttendeeInformationData>({
        resolver: zodResolver(attendeeInformationSchema),
        reValidateMode: "onChange",
        mode: "onChange",
        defaultValues: {
            name: '',
            email: '',
            phone: '',

            // If event is age restricted Set to undefined so form handles validation
            // Else set a default date (wont be sent during request), to avoid validation errors
            dateOfBirth: "",
            sendUpdates: false,
            shareWithGroup: false,
            keepInLoop: false,
            splitPayment: false,
            agreeToTerms: false
        }
    })

    return (
        <CheckoutAttendeeInfoFormContext.Provider value={{ form }}>
            {children}
        </CheckoutAttendeeInfoFormContext.Provider>
    )
}

export function useCheckoutAttendeeInfoForm() {
    const context = useContext(CheckoutAttendeeInfoFormContext)
    if (!context) {
        throw new Error('useCheckoutAttendeeInfoForm must be used within CheckoutAttendeeInfoFormProvider')
    }
    return context
}