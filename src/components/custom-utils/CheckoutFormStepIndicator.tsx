'use client'
import { useCheckout } from "@/contexts/CheckoutFlowProvider"

export function CheckoutFormStepIndicator() {
    
    const { currentStep } = useCheckout()
    
    const steps = [
        { number: 1, label: 'Ticket' },
        { number: 2, label: 'Ticket Information' },
        { number: 3, label: 'Checkout' }
    ]
    
    return (
        <div className="flex items-center w-full gap-2">
            {steps.map((step, index) => (
                <div 
                    key={step.number} 
                    className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : 'flex-none'}`}
                >
                    <div className="flex items-center gap-2 shrink-0">
                        <div className={`
                            flex items-center justify-center w-10 h-10 lg:w-8 lg:h-8 rounded-[6.6px] font-semibold text-xl lg:text-sm shrink-0
                            ${currentStep >= step.number 
                                ? 'bg-primary text-white' 
                                : 'text-neutral-7 border-[1.6px] border-neutral-7'
                            }
                        `}>
                            {step.number}
                        </div>
                        <span className={`
                            text-xs font-medium whitespace-nowrap hidden lg:inline-block
                            ${currentStep >= step.number ? 'text-neutral-9' : 'text-neutral-6'}
                        `}>
                            {step.label}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <div className={`
                            flex-1 h-0.5 border-t-[1.4px] border-dotted mx-2 sm:mx-3
                            ${currentStep > step.number ? 'border-primary' : 'border-neutral-7/80'}
                        `} />
                    )}
                </div>
            ))}
        </div>
    )
}