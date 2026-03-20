"use client"

import { useSignup } from "@/contexts/HostSignupProvider"
import { OrganizationGeneralStep } from "./GeneralStep"
import { OrganizationBusinessStep } from "./BusinessStep"
import { PasswordStep } from "../reused/PasswordStep"

export default function OrganizationHostSignupSection() {

    const { currentStep } = useSignup()


    return (
        currentStep === 1 ?
        <OrganizationGeneralStep /> :
        currentStep === 2 ?
        <OrganizationBusinessStep /> : 
        currentStep === 3 ?
        <PasswordStep accountType="organization" />
        :
        null
    )
}