"use client"

import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import axios, { AxiosError } from "axios"
import ActionButton1 from "../../custom-utils/buttons/ActionButton1"
import PasswordInput1 from "../../custom-utils/inputs/PasswordInput1"
import TextInput1 from "../../custom-utils/inputs/TextInput1"
import { SignInFormValues, signInSchema } from "@/schemas/signin.schema"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { useRouter } from "next/navigation"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"

export default function SignInForm() {

    const [submitError, setSubmitError] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const router   = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormValues>({
        resolver: zodResolver(signInSchema),
    })

    const onSubmit: SubmitHandler<SignInFormValues> = async (values) => {
        setSubmitError(null)

        try {
            await axios.post("/api/auth/login", values)

            const { data }: { data: { user: AuthUser } } = await axios.get("/api/auth/profile", {
                withCredentials: true,
            })

            if (data.user.role === "host") {
                window.location.href = `host.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
                return
            }

            dispatch(setUser(data.user))
            router.push(NAV_LINKS.HOME.href)

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
            className="space-y-4"
            data-testid="signin-form"
        >
            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Email Address
                </label>
                <TextInput1
                    placeholder="Enter your email address"
                    icon="mage:email"
                    {...register("email")}
                    error={errors.email?.message}
                    data-testid="signin-email"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Password
                </label>
                <PasswordInput1
                    {...register("password")}
                    error={errors.password?.message}
                    data-testid="signin-password"
                />

                {submitError && (
                    <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                        <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                        {submitError}
                    </p>
                )}
            </div>

            <ActionButton1
                buttonText={isSubmitting ? "Signing in..." : "Sign in"}
                className="mt-6 w-full"
                isDisabled={isSubmitting}
                buttonType="submit"
                isLoading={isSubmitting}
                data-testid="signin-submit"
            />
        </form>
    )
}