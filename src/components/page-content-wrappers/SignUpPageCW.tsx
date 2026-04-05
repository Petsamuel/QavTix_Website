"use client"

import { AccountTypes } from "@/components-data/auth-pages/enums";
import { NAV_LINKS } from "@/components-data/navigation/navLinks";
import AccountTypeBox from "@/components/auth-pages/AccountTypeBox";
import AuthPageFlexWrapper from "@/components/auth-pages/AuthPageFlexWrapper";
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1";
import ActionButton2 from "@/components/custom-utils/buttons/ActionButton2";
import { RadioGroup } from "@/components/ui/radio-group";
import { space_grotesk } from "@/lib/fonts";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPageCW(){

    const [accountType,setAccountType] = useState<AccountType>(AccountTypes.ATTENDEE)
    const router = useRouter()

    return (
        <AuthPageFlexWrapper>
            <main className="max-w-xl w-full mx-auto">
                <h1 className="sr-only">Sign Up</h1>
                <h2 className={`${space_grotesk.className} text-secondary-9 text-2xl md:text-3xl lg:text-[2rem] font-bold mb-2`}>Welcome to Qavtix!</h2>
                <p className="text-neutral-7 text-sm">Choose your account type. Would you like to sign up as a attendee or host?</p> 
           
                <RadioGroup defaultValue={AccountTypes.ATTENDEE} onValueChange={v => setAccountType(v as AccountType)} className="grid grid-cols-2 gap-4 mt-10">
                    <AccountTypeBox value={AccountTypes.ATTENDEE} />
                    <AccountTypeBox value={AccountTypes.HOST} />
                </RadioGroup>

                <div className="flex flex-col md:flex-row gap-4 mt-12">
                    <ActionButton2 buttonText="Cancel" action={() => router.push("/")} className="w-full"   />
                    <ActionButton1 buttonText="Continue" action={() => router.push(`${NAV_LINKS.SIGN_UP.href}/${accountType}${accountType === "host" ? "?type=individual" : ""}`)} className="w-full" />
                </div>

                <p className="text-sm text-neutral-7 mt-6 mb-8 text-center">Already have an account?<button onClick={() => router.push(NAV_LINKS.SIGN_IN.href)} className="font-medium text-accent-6 ms-1">Sign In</button></p>
            </main>
        </AuthPageFlexWrapper>
    )
}