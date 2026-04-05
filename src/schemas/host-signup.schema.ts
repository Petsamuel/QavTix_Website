import { z } from 'zod'


export const individualGeneralSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    country: z.string().min(1, 'Please select a country'),
    state: z.string().min(1, 'Please select a state'),
    city: z.string().min(2, 'Please enter your city'),
    profileImage: z.instanceof(File, { message: "Profile image is required" })
        .refine((file) => file.size <= 2 * 1024 * 1024, "Profile image must be less than 2MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
                "Profile image must be JPEG, PNG, or WEBP"),
    bannerImage: z.instanceof(File, { message: "Banner image is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Banner image must be less than 5MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
                "Banner image must be JPEG, PNG, or WEBP"),
    agreedToTerms: z.boolean({
    error: "You must agree to the terms",   // This shows when value is undefined/missing
    }).refine((val) => val === true, {
    message: 'You must agree to the terms',
    }),
})

export const individualBusinessSchema = z.object({
    brandName: z.string().min(2, 'Brand name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    relevantLinks: z.array(
        z.object({
            link: z.url({ message: 'Invalid URL' })
        })
    ),
    eventCategories: z.array(z.string()).min(1, 'Select at least one category'),
})

export const organizationGeneralSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    companyEmail: z.email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number'),
    country: z.string().min(1, 'Please select a country'),
    state: z.string().min(1, 'Please select a state'),
    city: z.string().min(2, 'Please enter your city'),
    profileImage: z.instanceof(File, { message: "Profile image is required" })
        .refine((file) => file.size <= 2 * 1024 * 1024, "Profile image must be less than 2MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
                "Profile image must be JPEG, PNG, or WEBP"),
    bannerImage: z.instanceof(File, { message: "Banner image is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Banner image must be less than 5MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
                "Banner image must be JPEG, PNG, or WEBP"),
    agreedToTerms: z.boolean({
    error: "You must agree to the terms",   // This shows when value is undefined/missing
    }).refine((val) => val === true, {
    message: 'You must agree to the terms',
    }),
})

export const organizationBusinessSchema = z.object({
    businessName: z.string().min(2, 'Business name is required'),
    businessType: z.string().min(1, 'Please select business type'),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    taxId: z.string().min(1, 'Tax ID is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    relevantLinks: z.array(
        z.object({
            link: z.string().trim().url({ message: 'Invalid URL' })
        })
    ),
    eventCategories: z.array(z.string()).min(1, 'Select at least one category'),
})


export const passwordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Both password must match",
    path: ['confirmPassword']
})


// Types
export type IndividualGeneralData = z.infer<typeof individualGeneralSchema>
export type IndividualBusinessData = z.infer<typeof individualBusinessSchema>
export type OrganizationGeneralData = z.infer<typeof organizationGeneralSchema>
export type OrganizationBusinessData = z.infer<typeof organizationBusinessSchema>
export type PasswordData = z.infer<typeof passwordSchema>

export type HostSignUpFormData =
    | IndividualGeneralData
    | OrganizationGeneralData
    | IndividualBusinessData
    | OrganizationBusinessData
    | PasswordData

export type HostAccountType = 'individual' | 'organization'