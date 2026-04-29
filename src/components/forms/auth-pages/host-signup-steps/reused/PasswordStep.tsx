'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import axios, { AxiosError } from 'axios'
import { useSignup } from '@/contexts/HostSignupProvider'
import { passwordSchema, type PasswordData, type HostAccountType } from '@/schemas/host-signup.schema'
import { handleApiError } from '@/helper-fns/handleApiErrors'
import {
    buildIndividualPayload,
    buildOrganizationPayload,
    IndividualSubmitData,
    OrganizationSubmitData,
} from '@/helper-fns/host-signup-payload'
import PasswordInput2 from '@/components/custom-utils/inputs/PasswordInput2'
import MultiStepFormButtonDuo from '@/components/custom-utils/buttons/MultiStepFormButtonDuo'
import PasswordStrengthIndicator from '@/components/custom-utils/PasswordStrengthIndicator'
import { HOST_SIGNUP_PATH } from '@/apiPaths'
import { useAppDispatch } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

interface Props {
    accountType: HostAccountType
}

export function PasswordStep({ accountType }: Props) {
    const { formData, categories, signUpSuccessful } = useSignup()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PasswordData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: formData as Partial<PasswordData>,
    })

    const password = watch("password")

    const dispatch = useAppDispatch()

    const onSubmit = async (data: PasswordData) => {
        setSubmitError(null)

        const merged = { ...formData, ...data }

        try {
            // Upload images to Cloudinary first
            let profileImageUrl = ''
            let bannerImageUrl = ''

            const mergedWithImages = merged as any // Type assertion for image properties

            if (mergedWithImages.profileImage instanceof File) {
                const profileUpload = await uploadToCloudinary(mergedWithImages.profileImage, 'qavtix-hosts/profiles')
                profileImageUrl = profileUpload.secure_url
            }

            if (mergedWithImages.bannerImage instanceof File) {
                const bannerUpload = await uploadToCloudinary(mergedWithImages.bannerImage, 'qavtix-hosts/banners')
                bannerImageUrl = bannerUpload.secure_url
            }

            // Prepare payload with uploaded image URLs
            const payloadData = {
                ...merged,
                profileImage: profileImageUrl,
                bannerImage: bannerImageUrl,
            }

            const payload = accountType === "individual"
                ? buildIndividualPayload(payloadData as unknown as IndividualSubmitData, categories)
                : buildOrganizationPayload(payloadData as unknown as OrganizationSubmitData, categories)

            await axios.post(HOST_SIGNUP_PATH, payload)
            reset()
            window.open(
                process.env.NEXT_PUBLIC_HOST_SITE || "https://host.qavtix.com",
                "_blank",
                "noopener,noreferrer"
            )
        } catch (error) {
            let message = "An unexpected error occurred. Please try again.";
            if (error instanceof AxiosError) {
                message = handleApiError(error.response?.data)
            } else if (error instanceof Error) {
                message = error.message
            }
            setSubmitError(message)

            dispatch(showAlert({
                title: "Sign Up Failed",
                description: message,
                variant: "default"
            }))
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            data-testid="password-step-form"
        >
            <PasswordInput2
                label="Password"
                placeholder="Enter your password"
                required
                {...register('password')}
                error={errors.password?.message}
                data-testid="signup-password"
                autoComplete="new-password"
                className={cn(signUpSuccessful && "blur-3xl")}
            />

            <PasswordInput2
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                {...register('confirmPassword')}
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                data-testid="signup-confirm-password"
                className={cn(signUpSuccessful && "blur-3xl")}
            />

            <PasswordStrengthIndicator password={password} />

            {submitError && (
                <p className="flex items-center gap-1.5 text-sm text-red-500">
                    <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                    {submitError}
                </p>
            )}

            <MultiStepFormButtonDuo isSubmitting={isSubmitting} />
        </form>
    )
}