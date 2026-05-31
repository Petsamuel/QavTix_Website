import { z } from "zod"

export const signInSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(1, "Please enter a valid password"),
})

export type SignInFormValues = z.infer<typeof signInSchema>