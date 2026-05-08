import { z } from 'zod'


export const individualGeneralSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Full name cannot exceed 100 characters'),
    email: z.email('Invalid email address').max(254, 'Email cannot exceed 254 characters'),
    phone: z.string().min(1, 'Phone Number is Required').min(10, 'Invalid phone number').max(20, 'Phone number cannot exceed 20 characters'),
    country: z.string().min(1, 'Please select a country').max(100, 'Invalid country'),
    state: z.string().min(1, 'Please select a state').max(100, 'Invalid state'),
    city: z.string().min(2, 'Please enter your city').max(100, 'City cannot exceed 100 characters'),
    postalCode: z.string().max(20, 'Postal code cannot exceed 20 characters').optional().or(z.literal('')),
    profileImage: z.instanceof(File, { message: "Profile image is required" })
        .refine((file) => file.size <= 2 * 1024 * 1024, "Profile image must be less than 2MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Profile image must be JPEG, PNG, or WEBP"),
    bannerImage: z.instanceof(File, { message: "Banner image is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Banner image must be less than 5MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Banner image must be JPEG, PNG, or WEBP"),
    agreedToTerms: z.boolean({ error: "Please complete all mandatory fields" })
        .refine((val) => val === true, { message: 'Please complete all mandatory fields' }),
})

export const individualBusinessSchema = z.object({
    brandName: z.string().min(2, 'Brand name is required').max(100, 'Brand name cannot exceed 100 characters'),
    nin: z.string().min(6, 'Identification number must be at least 6 digits').max(15, 'Identification number cannot exceed 15 digits').regex(/^\d+$/, 'Identification number must be numeric'),
    description: z.string().max(220, 'Headline cannot exceed 220 characters').optional(),
    relevantLinks: z.array(z.object({ link: z.url({ message: 'Invalid URL' }).max(2048, 'URL is too long') })).max(10, 'You can add up to 10 links'),
    eventCategories: z.array(z.string()).min(1, 'Select at least one category').max(10, 'You can select up to 10 categories'),
})

export const organizationGeneralSchema = z.object({
    fullName: z.string().min(2, 'Full name is required').max(100, 'Full name cannot exceed 100 characters'),
    companyEmail: z.email('Invalid email address').max(254, 'Email cannot exceed 254 characters'),
    phone: z.string().min(1, 'Phone Number is Required').min(10, 'Invalid phone number').max(20, 'Phone number cannot exceed 20 characters'),
    country: z.string().min(1, 'Please select a country').max(100, 'Invalid country'),
    state: z.string().min(1, 'Please select a state').max(100, 'Invalid state'),
    city: z.string().min(2, 'Please enter your city').max(100, 'City cannot exceed 100 characters'),
    profileImage: z.instanceof(File, { message: "Profile image is required" })
        .refine((file) => file.size <= 2 * 1024 * 1024, "Profile image must be less than 2MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Profile image must be JPEG, PNG, or WEBP"),
    bannerImage: z.instanceof(File, { message: "Banner image is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Banner image must be less than 5MB")
        .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), "Banner image must be JPEG, PNG, or WEBP"),
    agreedToTerms: z.boolean({ error: "Please complete all mandatory fields" })
        .refine((val) => val === true, { message: 'Please complete all mandatory fields' }),
})

export const organizationBusinessSchema = z.object({
    businessName: z.string().min(2, 'Business name is required').max(200, 'Business name cannot exceed 200 characters'),
    businessType: z.string().min(1, 'Please select business type').max(100, 'Invalid business type'),
    nin: z.string().min(6, 'Identification number must be at least 6 digits').max(15, 'Identification number cannot exceed 15 digits').regex(/^\d+$/, 'Identification number must be numeric'),
    registrationNumber: z.string().min(1, 'Registration number is required').max(50, 'Registration number cannot exceed 50 characters'),
    taxId: z.string().min(1, 'Tax ID is required').max(50, 'Tax ID cannot exceed 50 characters'),
    postalCode: z.string().max(20, 'Postal code cannot exceed 20 characters').optional().or(z.literal('')),
    description: z.string().max(220, 'Headline cannot exceed 220 characters').optional(),
    relevantLinks: z.array(z.object({ link: z.url({ message: 'Invalid URL' }).max(2048, 'URL is too long') })).max(10, 'You can add up to 10 links'),
    eventCategories: z.array(z.string()).min(1, 'Select at least one category').max(10, 'You can select up to 10 categories'),
})

export const passwordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password cannot exceed 128 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Both passwords must match",
    path: ['confirmPassword'],
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