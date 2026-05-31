"use client"

import { useCheckoutAttendeeInfoForm } from "@/contexts/CheckoutAttendeeInfoFormContext"
import { useCheckout } from "@/contexts/CheckoutFlowProvider"
import { useSplitPayment } from "@/contexts/SplitPaymentContextProvider"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import ActionButton1 from "./ActionButton1"

interface IMultiStepFormButtonDuo {
    isSubmitting?: boolean
}

export default function CheckoutFlowActionBtns({ isSubmitting }: IMultiStepFormButtonDuo) {
    const router = useRouter()
    const { currentStep, nextStep, updateAttendeeInfo, setSplitPaymentMode, isProcessing, prevStep, canProceedToCheckout, clearTickets } = useCheckout()
    const { splitError, setShowSplitError, splitMode } = useSplitPayment()
    const { form } = useCheckoutAttendeeInfoForm()

    const buttonIsDisabled = !!isSubmitting || isProcessing || !!splitError
    const buttonsRef = useRef<HTMLDivElement>(null)

    const handleContinue = async () => {
        if (currentStep === 2) {
            const isValid = await form.trigger()
            const values = form.getValues()

            if (values.shareWithGroup && splitError) {
                setShowSplitError(true)
                return
            }

            if (!isValid) {
                const firstError = Object.keys(form.formState.errors)[0]
                const errorElement = document.getElementById(firstError)
                console.log("Form validation failed, cannot proceed to checkout", form.formState.errors[firstError as keyof object])
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
                return
            }

            // Commit the split mode into the checkout context BEFORE advancing
            // so processPayment reads the correct equal/manual value.
            setSplitPaymentMode(splitMode)

            // Sync form values into checkout context before proceeding
            updateAttendeeInfo({
                name: values.name,
                email: values.email,
                phone: values.phone,
                dateOfBirth: values.dateOfBirth,
                sendUpdates: values.sendUpdates,
                shareWithGroup: values.shareWithGroup,
                keepInLoop: values.keepInLoop,
                splitPayment: values.splitPayment,
                attendees: values.attendees,
            })
        }
        nextStep()

        // When advancing to step 3 (payment), scroll the action buttons into view
        if (currentStep === 2) {
            setTimeout(() => scrollToButtons(), 200)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const scrollToButtons = () => {
        buttonsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

    const handleCancel = () => {
        if (currentStep === 1) {
            if (canProceedToCheckout()) {
                clearTickets()
                return
            }
            router.back()
        } else if (currentStep === 3) {
            // Going back from payment step — scroll to buttons so user sees the form
            prevStep()
            setTimeout(() => scrollToButtons(), 200)
        } else if (currentStep > 1) {
            scrollToTop()
            setTimeout(() => {
                prevStep()
            }, 200)
        }
    }

    return (
        <>
            {/* Marker element for scrolling */}
            <div id="checkout-top" className="absolute top-0 left-0" />

            <div ref={buttonsRef} className="flex gap-4 md:gap-6">
                <button
                    type="button"
                    onClick={handleCancel}
                    disabled={!!isSubmitting || isProcessing}
                    className="flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-4 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                >
                    <span>
                        {currentStep === 1 && canProceedToCheckout() ? "Clear" :
                            currentStep === 1 && !canProceedToCheckout() ? "Cancel" :
                                currentStep > 1 ? "Back" : "Cancel"}
                    </span>
                </button>


                <ActionButton1
                    buttonText={currentStep === 1 ? "Continue" : "Checkout"}
                    action={() => handleContinue()}
                    isDisabled={buttonIsDisabled}
                    isLoading={!!isSubmitting || isProcessing}
                    buttonType="button"
                    className="flex-1 text-sm!"
                />
            </div>
        </>
    )
}