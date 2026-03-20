import { z } from "zod"

export const attendeeSignUpSchema = z.object({
    full_name: z.string().min(2, "Enter your first and last name"),
    email:     z.email("Enter a valid email address"),
    password:  z.string().min(8, "Password must be at least 8 characters"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms',
    })
})

export type AttendeeSignUpFormValues = z.infer<typeof attendeeSignUpSchema>