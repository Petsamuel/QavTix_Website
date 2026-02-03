import { z } from 'zod'

export type AttendeeFormData = {
    readonly attendeeID: number
    name: string
    email: string
    phone: string
    amount: number
}

export type SplitMode = 'equal' | 'manual'

export const dobSchema = z
  .string({ error: "Date of birth is required" })
  .min(1, "Date of birth is required")
  .refine((value) => {
    // Check format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(value);
    const isValid = !isNaN(date.getTime())
    const isPast = date < new Date() // Ensure they aren't born in the future (time travellers lol ) 
    
    return isValid && isPast;
  }, {
    message: "Please enter a valid past date"
  })


export const ticketSelectionSchema = z.object({
    tickets: z.array(z.object({
        ticketTypeId: z.string(),
        ticketTypeName: z.string(),
        quantity: z.number().min(0),
        price: z.number(),
    })).refine((tickets) => tickets.some(t => t.quantity > 0), {
        message: 'Please select at least one ticket'
    })
})

export const attendeeInformationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    
    // Based On Event Requirements
    dateOfBirth: dobSchema,

    
    // Optional preferences
    attendees: z.array(z.object({
        name: z.string().min(2, "Attendee name is required"),
        attendeeID: z.number(),
        email: z.email("Invalid email"),
        dateOfBirth: dobSchema,
        phone: z.string().min(10, "Invalid phone number"),
        amount: z.number().optional()
    })).optional(),
    sendUpdates: z.boolean().optional(),
    keepInLoop: z.boolean().optional(),
    shareWithGroup: z.boolean().optional(),
    splitPayment: z.boolean().optional(),
    agreeToTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions'
    })
})

export const paymentMethodSchema = z.object({
    method: z.enum([
        'card',
        'bank_transfer',
        'google_pay',
        'apple_pay',
        'paypal',
        'opay',
        'kuda'
    ], {
        error: 'Please select a payment method'
    })
})

// Types
export type TicketSelectionData = z.infer<typeof ticketSelectionSchema>
export type AttendeeInformationData = z.infer<typeof attendeeInformationSchema>
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>

export type CheckoutFormData = 
    | TicketSelectionData
    | AttendeeInformationData
    | PaymentMethodData
    | Record<string, never>

    