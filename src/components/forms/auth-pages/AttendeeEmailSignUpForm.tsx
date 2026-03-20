"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import axios, { AxiosError } from "axios"
import ActionButton1 from "../../custom-utils/buttons/ActionButton1"
import PasswordInput1 from "../../custom-utils/inputs/PasswordInput1"
import TextInput1 from "../../custom-utils/inputs/TextInput1"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { LEGAL_LINKS } from "@/components-data/navigation/navLinks"
import { AttendeeSignUpFormValues, attendeeSignUpSchema } from "@/schemas/attendee-signup.schema"
import { ATTENDEE_SIGNUP_PATH, GET_PROFILE_PATH } from "@/apiPaths"
import FormCheckbox1 from "@/components/custom-utils/inputs/FormCheckbox1"
import Link from "next/link"

export default function AttendeeEmailSignUpForm({ setSuccessfulSignUp }:{ setSuccessfulSignUp: Dispatch<SetStateAction<boolean>> }) {

    const [submitError, setSubmitError] = useState<string | null>(null)

    const dispatch = useAppDispatch()

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<AttendeeSignUpFormValues>({
        resolver: zodResolver(attendeeSignUpSchema),
    })

    const onSubmit: SubmitHandler<AttendeeSignUpFormValues> = async (values) => {
        setSubmitError(null)

        try {
            await axios.post(ATTENDEE_SIGNUP_PATH, values)

            const { data }: { data: { user: AuthUser } } = await axios.get(GET_PROFILE_PATH, {
                withCredentials: true,
            })

            dispatch(setUser(data.user))
            setSuccessfulSignUp(true)
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
            data-testid="signup-form"
        >
            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Name
                </label>
                <TextInput1
                    placeholder="Enter your first and last name"
                    {...register("full_name")}
                    error={errors.full_name?.message}
                    data-testid="signup-name"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Email Address
                </label>
                <TextInput1
                    placeholder="Enter your email address"
                    icon="mage:email"
                    {...register("email")}
                    error={errors.email?.message}
                    data-testid="signup-email"
                />
            </div>

            <div>
                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                    Password
                </label>
                <PasswordInput1
                    {...register("password")}
                    error={errors.password?.message}
                    helperText="Must be at least 8 characters"
                    data-testid="signup-password"
                />

                {submitError && (
                    <p className="flex items-center gap-1.5 mt-2 text-sm text-red-500">
                        <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                        {submitError}
                    </p>
                )}
            </div>

            <Controller
                name="agreedToTerms"
                control={control}
                render={({ field }) => (
                    <FormCheckbox1
                        id="agreed-to-terms"
                        {...field}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        error={errors.agreedToTerms?.message}
                        className='mt-10'
                        label={
                            <span className='font-normal'>
                                I agree to the QavTix Attendee{' '}
                                <Link href={LEGAL_LINKS.TERMS.href} className="text-accent-6 font-medium hover:underline">
                                    Terms of Service
                                </Link>
                            </span>
                        }
                    />
                )}
            />

            <ActionButton1
                buttonText={isSubmitting ? "Creating account..." : "Sign Up"}
                className="mt-6 w-full"
                isDisabled={isSubmitting}
                buttonType="submit"
                isLoading={isSubmitting}
                data-testid="signup-submit"
            />
        </form>
    )
}