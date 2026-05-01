import { z } from "zod"

export const attendeeSignUpSchema = z.object({
    full_name: z.string().min(2, "Enter your first and last name").max(100, 'Full name cannot exceed 100 characters'),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
        message: 'Please complete all mandatory fields',
    })
})

export type AttendeeSignUpFormValues = z.infer<typeof attendeeSignUpSchema>