"use client"

import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper";
import ResetPasswordSuccessMessage from "@/components/auth-pages/ResetPasswordSuccessMessage";
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1";
import CountdownTimer from "@/components/auth-pages/CountDownTimer";
import OTPInput from "@/components/custom-utils/inputs/OTPInput";
import PasswordInput1 from "@/components/custom-utils/inputs/PasswordInput1";
import { maskEmail } from "@/helper-fns/maskEmail";
import { space_grotesk } from "@/lib/fonts";
import { useState } from "react";

export default function ForgotPasswordPage(){

    const [hasValidToken, setHasValidToken] = useState(true)
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
    const [expiresIn, setExpiresIn] = useState(298) // 4 minutes 58 seconds
    const [resetSuccessful, setResetSuccessful] = useState(false)

    return (
        <AuthPageFlexWrapper>
            <main>
                {
                    resetSuccessful ?
                    <ResetPasswordSuccessMessage />
                    :
                    <>
                        <h1 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl font-bold mt-4 mb-2`}>
                            {
                                hasValidToken ? 'Create new password' : 'Password reset'
                            }
                        </h1>
                        <p className="text-secondary-9 text-sm">
                            {
                                hasValidToken ? 
                                'Set your password so you can login and access QavTix' : 
                                `We sent a code to ${maskEmail("johnpork@gmail.com")}. Didn’t receive the email?`
                            }
                            {!hasValidToken &&
                                <button onClick={() => {}} className="font-medium text-primary-6 lg:text-accent-6 mx-1">Resend</button>
                            }
                        </p>

                        <form className="mt-8 space-y-10 lg:space-y-12">
                            {
                                !hasValidToken ?
                                <>
                                    <OTPInput otp={otp} setOtp={setOtp} />
                
                                    <CountdownTimer initialSeconds={expiresIn} />
                
                                    <ActionButton1 buttonText="Continue" />
                                </>
                                :
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-neutral-10 mb-2 block">Password</label>
                                        <PasswordInput1 />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-neutral-10 mb-2 block">Confirm Password</label>
                                        <PasswordInput1 />
                                    </div>
                                    <ActionButton1 buttonText="Create Password" className="mt-6 lg:mt-4 w-full" />
                                </>
                            }
                        </form>                
                    </>
                }
            </main>
        </AuthPageFlexWrapper>
    )
}