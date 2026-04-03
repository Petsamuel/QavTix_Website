"use client"

import { useSignup } from "@/contexts/HostSignupProvider"
import { IndividualGeneralStep } from "./GeneralStep"
import { IndividualBusinessStep } from "./BusinessStep"
import { PasswordStep } from "../reused/PasswordStep"

export default function IndividualHostSignupSection() {

    const { currentStep } = useSignup()


    return (
        currentStep === 1 ?
        <IndividualGeneralStep /> :
        currentStep === 2 ?
        <IndividualBusinessStep />
        :
        currentStep === 3 ?
        <PasswordStep accountType="individual" />
        :
        null
    )
}