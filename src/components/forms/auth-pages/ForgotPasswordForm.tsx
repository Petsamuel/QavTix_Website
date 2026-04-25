"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"
import ActionButton1 from "../../custom-utils/buttons/ActionButton1"
import TextInput1 from "../../custom-utils/inputs/TextInput1"
import { AUTH_ROUTES } from "@/components-data/navigation/navLinks"
import { resetEmailStore } from "@/lib/local-store/reset-email-store"
import { requestPasswordReset } from "@/actions/auth"

const schema = z.object({
    email: z.string().min(1, "Enter your email or phone number"),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordForm() {

    const router = useRouter()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async ({ email }: FormValues) => {
        setSubmitError(null)

        const result = await requestPasswordReset(email)

        if (result.success) {
            resetEmailStore.set(email)
            router.push(AUTH_ROUTES.RESET_PASSWORD.href)
        } else {
            setSubmitError(result.message ?? "Something went wrong. Please try again.")
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 mt-8 w-full"
            data-testid="forgot-password-form"
        >
            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Email Or Phone Number
                </label>
                <TextInput1
                    placeholder="Enter Email or Phone number"
                    {...register("email")}
                    error={errors.email?.message}
                    onInput={() => setSubmitError(null)}
                    data-testid="forgot-password-email"
                />

                {submitError && (
                    <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                        <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                        {submitError}
                    </p>
                )}
            </div>
            
            <ActionButton1
                buttonText={isSubmitting ? "Sending..." : "Continue"}
                className="mt-6 w-full"
                buttonType="submit"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                data-testid="forgot-password-submit"
            />
        </form>
    )
}