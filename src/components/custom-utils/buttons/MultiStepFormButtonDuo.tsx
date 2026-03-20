"use client"

import { useSignup } from "@/contexts/HostSignupProvider"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"
import ActionButton1 from "./ActionButton1"

interface Props {
    isSubmitting?: boolean
}

export default function MultiStepFormButtonDuo({ isSubmitting }: Props) {

    const router = useRouter()
    const { currentStep, prevStep } = useSignup()

    const handleBack = () => {
        if (currentStep > 1) {
            prevStep()
        } else {
            router.back()
        }
    }

    return (
        <div className="flex gap-4 pt-4">
            <button
                type="button"
                onClick={handleBack}
                className="flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
            >
                {currentStep > 1 && <Icon icon="lets-icons:arrow-left" width="24" height="24" />}
                <span>{currentStep > 1 ? "Back" : "Cancel"}</span>
                {currentStep === 1 && <Icon icon="iconoir:cancel" width="24" height="24" />}
            </button>

            <ActionButton1 
                buttonText={currentStep !== 3 ? "Next" : "Complete"}
                buttonType="submit"
                isDisabled={!!isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
                iconPosition={currentStep !== 3 ? "right" : undefined}
                icon={currentStep !== 3 ? "lets-icons:arrow-right" : undefined}
            />
        </div>
    )
}