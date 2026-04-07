"use client"

import { useSignup } from "@/contexts/HostSignupProvider"
import HostSignUpSuccessMessage from "../forms/auth-pages/host-signup-steps/reused/HostSignupSuccessMessage"
import { space_grotesk } from "@/lib/fonts"
import { HostAccountTypeSelector } from "../custom-utils/HostAccountTypeSelector"
import IndividualHostSignupSection from "../forms/auth-pages/host-signup-steps/individual"
import OrganizationHostSignupSection from "../forms/auth-pages/host-signup-steps/organization"
import AuthPageFlexWrapper from "./AuthPageFlexWrapper"
import SignUpStepIndicator from "../custom-utils/SignUpFormStepIndicator"

export default function HostSignUpContent() {
    
    const { signUpSuccessful, accountType } = useSignup()

    return (
        <>
            {signUpSuccessful && <HostSignUpSuccessMessage />}
            <AuthPageFlexWrapper contentSectionMaxWidth="md:max-w-2xl">
                <div className="pb-12">
                    <div className="mb-8">
                        <h1 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl lg:text-[2rem] font-bold mb-2`}>
                            Create An Account
                        </h1>
                        <p className="text-neutral-7 text-sm">Get started with QavTix for free!</p>
                    </div>

                    <HostAccountTypeSelector />
                    <SignUpStepIndicator />

                    {accountType === "individual"
                        ? <IndividualHostSignupSection />
                        : <OrganizationHostSignupSection />
                    }
                </div>
            </AuthPageFlexWrapper>
        </>
    )
}