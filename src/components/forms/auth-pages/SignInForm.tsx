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
import { useRouter, useSearchParams } from "next/navigation"
import { GET_PROFILE_PATH, LOGIN_PATH } from "@/apiPaths"
import { validateReturnTo } from "@/helper-fns/validateReturnTo"

export default function SignInForm() {

    const [submitError, setSubmitError] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnTo = searchParams.get('returnTo')

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
            const { data: loginData } = await axios.post(LOGIN_PATH, values)
            const role = loginData?.user?.role ?? loginData?.role ?? ""
            const safeReturn = validateReturnTo(returnTo)

            const hostSite = process.env.NEXT_PUBLIC_HOST_SITE ?? ''
            const attendeeSite = process.env.NEXT_PUBLIC_ATTENDEE_SITE ?? ''
            const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN ?? ''

            // Prioritize public returnTo (App Domain) — Role doesn't matter
            if (safeReturn && safeReturn.startsWith(appDomain)) {
                window.location.href = safeReturn
                return
            }

            // Handle Host redirection
            if (role === "host") {
                const destination = (safeReturn && safeReturn.startsWith(hostSite)) ? safeReturn : hostSite
                window.location.href = destination
                return
            }

            // Handle Attendee redirection (requires profile fetch for Redux state)
            const { data }: { data: { user: AuthUser } } = await axios.get(GET_PROFILE_PATH, {
                params: { role },
                withCredentials: true,
            })

            dispatch(setUser(data.user))

            const destination = (safeReturn && safeReturn.startsWith(attendeeSite)) ? safeReturn : appDomain
            window.location.href = destination

        } catch (error) {
            console.log(error)
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
                    onInput={() => setSubmitError(null)}
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
                    onInput={() => setSubmitError(null)}
                    data-testid="signin-password"
                    autoComplete="current-password"
                />

                {submitError && (
                    <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                        <Icon icon="bx:error-alt" className="size-4 shrink-0" />
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