'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { validatePromoCode } from '@/actions/checkout'

// Zod schema for promo code
const promoCodeSchema = z.object({
    code: z
        .string()
        .trim()
        // .regex(/^[A-Z0-9-]+$/i, 'Only letters, numbers, and hyphens allowed'),
})

type PromoCodeForm = z.infer<typeof promoCodeSchema>

export default function PromoCode() {

    const { currentStep, discount, removeDiscount, validateCoupon } = useCheckout()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
    } = useForm<PromoCodeForm>({
        resolver: zodResolver(promoCodeSchema),
        mode: 'onChange',
        defaultValues: { code: '' },
    })

    const onSubmit = async (data: PromoCodeForm) => {
        setIsSubmitting(true)
        try {
            await validateCoupon(data.code)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        currentStep === 1 &&
        <div className="w-full max-w-md">
            {discount ? 
                <p className="mt-1.5 text-xs text-green-600 font-medium flex items-center gap-1">
                    <Icon icon="mdi:check-circle" className="size-3.5" />
                    {discount.description} applied
                    <button
                        type="button"
                        onClick={() => { removeDiscount(); reset() }}
                        className="ml-2 text-neutral-500 underline text-xs"
                    >
                        Remove
                    </button>
                </p>
                :
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1">
                        <input
                            {...register('code')}
                            type="text"
                            placeholder="Enter promo code"
                            disabled={isSubmitting}
                            className={cn(
                                'w-full px-4 py-5 text-secondary-8 rounded-md bg-accent-1 text-sm',
                                'placeholder:font-normal placeholder:text-neutral-7 focus:outline-none focus:ring-2 focus:ring-accent/30',
                                errors.code
                                    ? 'border border-red-400 focus:border-red-500'
                                    : 'focus:border-accent-5',
                                isSubmitting && 'opacity-70 cursor-not-allowed'
                            )}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid || !isDirty}
                        className={cn(
                            'px-6 py-3.5 h-11 flex justify-center items-center rounded-3xl font-medium text-sm whitespace-nowrap transition-all',
                            'bg-secondary-6 text-white hover:bg-secondary-7 hover:shadow-md',
                            'active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                            'disabled:bg-neutral-4 disabled:text-neutral-6 disabled:cursor-not-allowed disabled:opacity-60',
                            isSubmitting && 'opacity-70 cursor-wait'
                        )}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Icon icon="svg-spinners:90-ring-with-bg" className="size-4 animate-spin" />
                                Applying...
                            </span>
                        ) : (
                            'Apply'
                        )}
                    </button>
                </form>
            }
        </div>
    )
}