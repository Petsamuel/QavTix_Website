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

interface Props {
    accountType: HostAccountType
}

export function PasswordStep({ accountType }: Props) {
    const { formData, categories, setSignUpSuccessful } = useSignup()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<PasswordData>({
        resolver:      zodResolver(passwordSchema),
        defaultValues: formData as Partial<PasswordData>,
    })

    const password = watch("password")

    const onSubmit = async (data: PasswordData) => {
        setSubmitError(null)

        const merged = { ...formData, ...data }

        const payload = accountType === "individual"
            ? buildIndividualPayload(merged as IndividualSubmitData, categories)
            : buildOrganizationPayload(merged as OrganizationSubmitData, categories)

        try {
            await axios.post("/api/auth/host-register", payload)
            setSignUpSuccessful(true)
        } catch (error) {
            if (error instanceof AxiosError) {
                setSubmitError(handleApiError(error.response?.data))
            } else {
                setSubmitError("An unexpected error occurred. Please try again.")
            }
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
            />

            <PasswordInput2
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
                data-testid="signup-confirm-password"
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