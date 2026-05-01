"use client"

import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper";
import Link from "next/link";
import SignInForm from "@/components/forms/auth-pages/SignInForm";
import { space_grotesk } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import SocialAuthButtons from "@/components/auth-pages/SocialAuthButtons";
import { AUTH_ROUTES } from "@/components-data/navigation/navLinks";

export default function SignInCWPage() {

    const router = useRouter()

    return (
        <AuthPageFlexWrapper>
            <main className="max-w-xl w-full mx-auto">
                <h1 className="sr-only">Sign In</h1>
                <h2 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl lg:text-[2rem] font-bold mb-2`}>Welcome back!</h2>
                <p className="text-neutral-7 text-sm">Don’t have an account? <Link href="/auth/signup" className="font-medium text-primary-6">Sign Up</Link></p>

                <div className="mt-10 flex gap-4 flex-wrap">
                    <SocialAuthButtons />
                </div>

                <div className="flex gap-2 items-center my-6">
                    <hr className="h-1 border-neutral-5 flex-1" />
                    <span className="text-neutral-7 text-sm uppercase">Or</span>
                    <hr className="h-1 border-neutral-5 flex-1" />
                </div>

                <SignInForm />

                <p className="text-sm text-neutral-8 mt-4 text-center">Forgot Password? <button onClick={() => router.push(AUTH_ROUTES.FORGOT_PASSWORD.href)} className="font-medium text-accent-6">Recover</button></p>
            </main>
        </AuthPageFlexWrapper>
    )
}