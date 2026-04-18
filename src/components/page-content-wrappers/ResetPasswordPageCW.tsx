"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Icon } from "@iconify/react"
import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper"
import ResetPasswordSuccessMessage from "@/components/auth-pages/ResetPasswordSuccessMessage"
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1"
import CountdownTimer from "@/components/auth-pages/CountDownTimer"
import OTPInput from "@/components/custom-utils/inputs/OTPInput"
import PasswordInput1 from "@/components/custom-utils/inputs/PasswordInput1"
import { maskEmail } from "@/helper-fns/maskEmail"
import { space_grotesk } from "@/lib/fonts"
import { verifyOtp, resetPassword, requestPasswordReset } from "@/actions/auth"
import { resetEmailStore } from "@/lib/local-store/reset-email-store"
import PasswordStrengthIndicator from "@/components/custom-utils/PasswordStrengthIndicator"


const OTP_EXPIRY_SECONDS = 180

const resetPasswordSchema = z.object({
    password:        z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path:    ["confirmPassword"],
})

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
type Step = "otp" | "new-password"


export default function ResetPasswordPageCW() {

    const [email,           setEmail]           = useState<string | null>(null)
    const [resetToken,      setResetToken]      = useState<string | null>(null)
    const [step,            setStep]            = useState<Step>("otp")
    const [otp,             setOtp]             = useState<string[]>(Array(6).fill(""))
    const [otpError,        setOtpError]        = useState<string | null>(null)
    const [otpSubmitting,   setOtpSubmitting]   = useState(false)
    const [resetSuccessful, setResetSuccessful] = useState(false)
    const [resending,       setResending]       = useState(false)
    const [timerKey,        setTimerKey]        = useState(0)
    const [timerExpired,    setTimerExpired]    = useState(false)

    useEffect(() => {
        const stored = resetEmailStore.get()
        if (stored) setEmail(stored)
    }, [])

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const password = watch("password")

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otpSubmitting) return
        setOtpError(null)

        const code = otp.join("")

        if (code.length < 6) {
            setOtpError("Enter the full 6-digit code.")
            return
        }

        if (!email) {
            setOtpError("Session expired. Please restart the reset process.")
            return
        }

        setOtpSubmitting(true)
        const result = await verifyOtp(email, code)
        setOtpSubmitting(false)

        if (result.success && result.token) {
            setResetToken(result.token)
            setStep("new-password")
        } else {
            setOtpError(result.message ?? "Invalid or expired code.")
        }
    }

    const handleResend = async () => {
        if (!email || resending || !timerExpired) return
        setResending(true)
        await requestPasswordReset(email)
        setResending(false)
        setOtp(Array(6).fill(""))
        setOtpError(null)
        setTimerExpired(false)
        setTimerKey(prev => prev + 1)
    }

    const onResetSubmit = async (values: ResetPasswordValues) => {
        if (!resetToken) return
        const result = await resetPassword(resetToken, values.password)
        if (result.success) {
            resetEmailStore.clear()
            setResetSuccessful(true)
        }
    } 


    return (
        <>
            {resetSuccessful && <ResetPasswordSuccessMessage />}
            <AuthPageFlexWrapper>
                <main className="max-w-xl mx-auto w-full">
                    <h1 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl font-bold mt-4 mb-2`}>
                        {step === "new-password" ? "Create new password" : "Password reset"}
                    </h1>

                    <p className="text-secondary-9 text-sm">
                        {step === "new-password"
                            ? "Set your password so you can login and access QavTix"
                            : <>
                                We sent a code to {email ? maskEmail(email) : "your email"}.{" "}
                                {timerExpired ? (
                                    <>
                                        Didn&apos;t receive it?{" "}
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            disabled={resending}
                                            className="font-medium text-primary-6 lg:text-accent-6 mx-1 disabled:opacity-50 transition-opacity"
                                        >
                                            {resending ? "Resending..." : "Resend code"}
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-neutral-5 text-xs ml-1">
                                        Resend available once the timer expires.
                                    </span>
                                )}
                            </>
                        }
                    </p>

                    {step === "otp" && (
                        <form
                            onSubmit={handleOtpSubmit}
                            className="mt-8 space-y-10 lg:space-y-12 flex justify-center items-center flex-col"
                            data-testid="otp-form"
                        >
                            <OTPInput otp={otp} setOtp={(v) => {
                                setOtp(v)
                                setOtpError(null)
                            }} />

                            {otpError && (
                                <p className="flex items-center gap-1.5 text-sm text-red-500 -mt-6">
                                    <Icon icon="mage:exclamation-circle" className="size-4 shrink-0" />
                                    {otpError}
                                </p>
                            )}

                            <CountdownTimer
                                key={timerKey}
                                initialSeconds={OTP_EXPIRY_SECONDS}
                                onExpire={() => setTimerExpired(true)}
                            />

                            <ActionButton1
                                buttonText={otpSubmitting ? "Verifying..." : "Continue"}
                                buttonType="submit"
                                className="w-full"
                                isDisabled={otpSubmitting}
                                isLoading={otpSubmitting}
                                data-testid="otp-submit"
                            />
                        </form>
                    )}

                    {step === "new-password" && (
                        <form
                            onSubmit={handleSubmit(onResetSubmit)}
                            className="mt-8 space-y-6"
                            data-testid="reset-password-form"
                        >
                            <div>
                                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                                    Password
                                </label>
                                <PasswordInput1
                                    {...register("password")}
                                    error={errors.password?.message}
                                    autoComplete="new-password"
                                    data-testid="new-password"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-neutral-10 mb-2 block">
                                    Confirm Password
                                </label>
                                <PasswordInput1
                                    {...register("confirmPassword")}
                                    error={errors.confirmPassword?.message}
                                    autoComplete="new-password"
                                    data-testid="confirm-password"
                                />
                            </div>

                            <PasswordStrengthIndicator password={password} />

                            <ActionButton1
                                buttonText={isSubmitting ? "Saving..." : "Create Password"}
                                className="mt-6 lg:mt-4 w-full"
                                buttonType="submit"
                                isDisabled={isSubmitting}
                                isLoading={isSubmitting}
                                data-testid="reset-password-submit"
                            />
                        </form>
                    )}
                </main>
            </AuthPageFlexWrapper>
        </>
    )
}