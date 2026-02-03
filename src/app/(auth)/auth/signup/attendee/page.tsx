"use client"

import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper";
import SignUpSuccessMessage from "@/components/auth-pages/SignUpSuccessMessage";
import SocialAuthButtons from "@/components/auth-pages/SocialAuthButtons";
import AttendeeEmailSignUpForm from "@/components/forms/auth-pages/AttendeeEmailSignUpForm";
import { space_grotesk } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AttendeeSignUpPage(){

    const router = useRouter()
    const [successfulSignUp, setSuccessfulSignUp] = useState(false)

    return (
        // Success Message Section Dont contain the slide carousel, so the AuthPageFlexWrapper wont be wrapping it 
        successfulSignUp ? 
        <SignUpSuccessMessage />
        :
        <AuthPageFlexWrapper>
            <main className="">
                <h1 className="sr-only">Sign Up</h1>
                <h2 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl lg:text-[2rem] font-bold mb-2`}>Sign up with your email</h2>
                <p className="text-neutral-7 text-sm">You are one step away! Let’s get you started.</p>

                <div className="mt-10 flex gap-4 flex-wrap justify-between">
                    <SocialAuthButtons />
                </div>

                <div className="flex gap-2 items-center my-6">
                    <hr className="h-1 border-neutral-5 flex-1" />
                    <span className="text-neutral-7 text-sm uppercase">Or</span>
                    <hr className="h-1 border-neutral-5 flex-1" />
                </div>

                <AttendeeEmailSignUpForm />

                <p className="text-sm text-neutral-7 mt-6 mb-8 text-center">Already have an account?<button onClick={() => router.push("/auth/forgot-password")} className="font-medium text-accent-6 ms-1">Sign In</button></p>
            </main>
        </AuthPageFlexWrapper>
    )
}