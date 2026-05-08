'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import PromoCode from '@/components/checkout/PromoCode'
import CheckoutFlowActionBtns from '@/components/custom-utils/buttons/CheckoutFlowActionBtns'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { formatPrice } from '@/helper-fns/formatPrice'
import { Controller } from 'react-hook-form'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import { useCheckoutAttendeeInfoForm } from '@/contexts/CheckoutAttendeeInfoFormContext'
import Link from 'next/link'


const mobileSummaryVariants = {
    hidden: {
        opacity: 0,
        y: 240,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: "linear" as const,
        },
    },
    exit: {
        opacity: 0,
        y: 240,
        transition: {
            duration: 0.4,
            ease: "linear" as const,
        },
    },
}




export default function CheckoutSummary({ showMobileSummary, setShowMobileSummary }: { showMobileSummary: boolean, setShowMobileSummary: Dispatch<SetStateAction<boolean>> }) {

    const {
        selectedTickets,
        subtotal,
        discountAmount,
        platformFee,
        total,
        event,
        currentStep
    } = useCheckout()


    const { form: { control, formState: { errors } } } = useCheckoutAttendeeInfoForm()

    // Return nothing if no tickets selected
    if (selectedTickets.length === 0) return null


    const TicketsList = () => (
        <div className="space-y-4">
            {selectedTickets.map((ticket) => (
                <div key={ticket._key} className="flex items-center justify-between text-sm">
                    <p className="text-neutral-8">
                        {ticket.quantity} × {ticket.ticket_type}
                    </p>
                    <p className="text-neutral-8 font-medium">
                        {formatPrice(ticket.price * ticket.quantity, event.currency || 'NGN')}
                    </p>
                </div>
            ))}
        </div>
    )

    const PriceBreakdown = ({ showTooltips = true }) => (
        <div className="space-y-4 text-sm w-full">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
                <p className="text-neutral-8">Subtotal</p>
                <p className="text-neutral-8 font-medium">
                    {formatPrice(subtotal, event.currency || 'NGN')}
                </p>
            </div>

            {/* Membership Discount */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <p className="text-neutral-8">Membership discount</p>
                    {showTooltips && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Membership discount info"
                                    className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                >
                                    <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Discount applied for QavTix members</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <p className="text-neutral-8">—</p>
            </div>

            {/* Promo Discount */}
            <div className="flex items-center justify-between">
                <p className="text-neutral-8">Promo discount</p>
                <p className="text-neutral-8 font-medium">
                    {formatPrice(discountAmount, event.currency || 'NGN')}
                </p>
            </div>

            {/* Fees */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <p className="text-neutral-8">Fees</p>
                    {showTooltips && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Fees information"
                                    className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                >
                                    <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Non-refundable processing fee</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
                <p className="text-neutral-8 font-medium">
                    {formatPrice(platformFee, event.currency || 'NGN')}
                </p>
            </div>
        </div>
    )

    const TotalRow = ({ showChevron = false, onClick }: { showChevron?: boolean; onClick?: () => void }) => (
        <div className="flex items-center justify-between">
            <h3 className={cn('text-xl font-medium text-secondary-9', space_grotesk.className)}>
                Total
            </h3>
            <button
                onClick={onClick}
                className={cn(
                    'flex items-center gap-2',
                    showChevron ? 'cursor-pointer' : 'cursor-default'
                )}
                aria-expanded={showChevron ? showMobileSummary : undefined}
                aria-controls={showChevron ? 'mobile-summary-details' : undefined}
                disabled={!showChevron}
            >
                <p className={cn('text-xl font-medium text-primary-6', space_grotesk.className)}>
                    {formatPrice(total, event.currency || 'NGN')}
                </p>
                {showChevron && (
                    <Icon
                        icon={showMobileSummary ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                        className="size-6 text-neutral-7"
                    />
                )}
            </button>
        </div>
    )


    const DesktopSummary = () => (
        <section className="hidden md:flex w-full min-h-screen flex-col justify-between">
            <div className=''>
                <h2 className={cn('text-2xl mt-10 font-medium text-secondary-9 mb-8', space_grotesk.className)}>
                    Payment Summary
                </h2>

                <PromoCode />

                <div className="mt-8">
                    <TicketsList />
                </div>

                <div className="border-t-[1.4px] border-neutral-5 my-6" />

                <PriceBreakdown showTooltips={true} />
            </div>

            <div className="pt-6 border-t border-neutral-3">
                <TotalRow />
                <div className="mt-8">
                    <CheckoutFlowActionBtns />
                </div>
            </div>
        </section>
    )


    const MobileSummary = () => (

        <div className='w-full md:hidden'>
            {/* Expanded Summary Details */}
            <AnimatePresence>
                {showMobileSummary && (
                    <motion.div
                        id="mobile-summary-details"
                        key="mobile-summary"
                        variants={mobileSummaryVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden bg-white py-4"
                    >
                        <h2 className={cn('text-2xl font-bold text-secondary-9 mb-6 mt-5', space_grotesk.className)}>
                            Payment Summary
                        </h2>

                        <TicketsList />

                        <div className="border-t-[1.4px] border-neutral-5 my-6" />

                        <PriceBreakdown showTooltips={false} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky/Relative Bottom Section */}
            <div
                className={cn(
                    'md:hidden left-0 right-0 bg-white border-t border-neutral-3 z-50 fixed bottom-0'
                )}
            >
                <div className="global-px py-4">
                    <TotalRow
                        showChevron={true}
                        onClick={() => setShowMobileSummary(!showMobileSummary)}
                    />


                    {
                        currentStep === 2 &&
                        <Controller
                            name="agreeToTerms"
                            control={control}
                            render={({ field }) => (
                                <FormCheckbox1
                                    id="agreed-to-terms"
                                    {...field}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    error={errors.agreeToTerms?.message}
                                    className='mt-6'
                                    label={
                                        <span className='font-normal'>
                                            I agree to QavTix{' '}
                                            <Link href="/terms" className="text-accent-6 font-medium hover:underline">
                                                Terms & Conditions
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/commission" className="text-accent-6 font-medium hover:underline">
                                                Refund Policy
                                            </Link>.
                                        </span>
                                    }
                                />
                            )}
                        />
                    }

                    <div className="mt-4 space-y-4">
                        <PromoCode />
                        <CheckoutFlowActionBtns />
                    </div>
                </div>
            </div>
        </div>
    )


    return (
        <>
            <DesktopSummary />
            <MobileSummary />
        </>
    )
}