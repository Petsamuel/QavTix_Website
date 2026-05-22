"use client"

import { AUTH_ROUTES } from "@/components-data/navigation/navLinks";
import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper";
import ForgotPasswordForm from "@/components/forms/auth-pages/ForgotPasswordForm";
import { space_grotesk } from "@/lib/fonts";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {

    const router = useRouter()

    return (
        <AuthPageFlexWrapper>
            <main className="max-w-xl w-full mx-auto">
                <h1 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl font-bold mt-4 mb-2`}>Forgot Password?</h1>
                <p className="text-neutral-7 text-sm">Enter the email address you used signing up, we’ll send you reset instructions.</p>

                <ForgotPasswordForm />
                <p className="text-sm text-neutral-8 mt-4 text-center">Remember Password? <button onClick={() => router.push(AUTH_ROUTES.SIGN_IN.href)} className="font-medium text-accent-6">Sign In</button></p>
            </main>
        </AuthPageFlexWrapper>
    )
}