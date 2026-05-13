'use client'

import { useEffect } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { AUTH_ROUTES } from '@/components-data/navigation/navLinks'
import FormCheckbox1 from '@/components/custom-utils/inputs/FormCheckbox1'
import FormInput2 from '@/components/custom-utils/inputs/FormInput2'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useCheckoutAttendeeInfoForm } from '@/contexts/CheckoutAttendeeInfoFormContext'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { space_grotesk } from '@/lib/fonts'
import { useSplitPayment } from '@/contexts/SplitPaymentContextProvider'
import SplitPaymentAddAttendee from './SplitPaymentAddAttendee'
import { SplitMode } from '@/schemas/checkout-flow.schema'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import ErrorPara from '@/components/custom-utils/ErrorPara'
import { formatPrice } from '@/helper-fns/formatPrice'

export default function TicketCheckoutAttendeeInformationStep() {

    const { event, total, selectedTickets } = useCheckout()
    const { isAuthenticated, user } = useAppSelector(s => s.auth)
    const { form } = useCheckoutAttendeeInfoForm()

    const {
        register,
        control,
        setValue,
        formState: { errors },
        watch,
    } = form

    const {
        splitMode,
        setSplitMode,
        attendees,
        addAttendee,
        removeAttendee,
        canAddMoreAttendees,
        getTotalAssignedAmount,
        setSplitPaymentEnabled,
        nextAttendeeId,
        getRemainingAmount,
        splitError,
    } = useSplitPayment()

    const { fields, append, remove } = useFieldArray({ control, name: 'attendees' })

    const splitPaymentEnabled = watch('splitPayment')
    const shareWithGroupEnabled = watch('shareWithGroup')

    // Auto-fill form fields for authenticated users on mount
    useEffect(() => {
        if (!isAuthenticated || !user) return
        if (user.full_name) setValue('name', user.full_name, { shouldValidate: true })
        if (user.email) setValue('email', user.email, { shouldValidate: true })
        if (user.phone_number) setValue('phone', user.phone_number, { shouldValidate: true })
        if (user.dob) setValue('dateOfBirth', user.dob, { shouldValidate: true })
    }, [isAuthenticated, user, setValue])

    // Sync split payment toggle into context
    useEffect(() => {
        setSplitPaymentEnabled(!!splitPaymentEnabled)
    }, [splitPaymentEnabled, setSplitPaymentEnabled])

    // When shareWithGroup is turned off, also disable split payment
    useEffect(() => {
        if (!shareWithGroupEnabled) {
            setValue('splitPayment', false)
        }
    }, [shareWithGroupEnabled, setValue])

    // Propagate split validation errors via alert dispatch
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (splitError) {
            dispatch(showAlert({
                title: 'Split Payment Error',
                description: splitError,
                variant: 'destructive',
            }))
        }
    }, [splitError, dispatch])

    // Sync attendee amounts from context to form for equal split
    useEffect(() => {
        if (splitMode === 'equal') {
            attendees.forEach((attendee, index) => {
                setValue(`attendees.${index}.amount`, attendee.amount)
            })
        }
    }, [attendees, splitMode, setValue])

    const handleAddAttendee = () => {
        append({
            attendeeID: nextAttendeeId,
            name: '',
            email: '',
            phone: '',
            amount: 0,
            dateOfBirth: event.age_restriction ? '' : '2000-01-01',
        })
        addAttendee()
        window.scrollBy({ top: 200, behavior: 'smooth' })
    }

    const handleRemoveAttendee = (index: number) => {
        const attendeeId = fields[index].attendeeID
        remove(index)
        removeAttendee(attendeeId)
    }

    return (
        <>
            {!isAuthenticated && (
                <p className="text-sm text-neutral-7 mb-8" data-testid="guest-signin-prompt">
                    <Link
                        href={`${AUTH_ROUTES.SIGN_IN.href}?returnTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        className="font-medium text-accent-6"
                    >
                        Sign in
                    </Link>{' '}
                    for a quicker, smoother experience
                </p>
            )}

            <form
                className="space-y-5"
                data-testid="attendee-info-form"
                noValidate
            >
                {/* Name + Date of Birth */}
                <div className={cn('md:grid gap-4', event.age_restriction ? 'grid-cols-2' : 'grid-cols-1')}>
                    <FormInput2
                        label="Name"
                        placeholder="e.g. Jon Doe"
                        required
                        {...register('name')}
                        error={errors.name?.message}
                        className="bg-neutral-3"
                        data-testid="input-name"
                        // Read-only for auth users — they see their own name pre-filled
                        readOnly={isAuthenticated}
                    />
                    {event.age_restriction && (
                        <FormInput2
                            label="Date of birth"
                            placeholder="DD/MM/YY"
                            required
                            helperText="This event is age-restricted"
                            type="date"
                            {...register('dateOfBirth')}
                            error={errors.dateOfBirth?.message}
                            className="bg-neutral-3"
                            data-testid="input-dob"
                            readOnly={isAuthenticated}
                        />
                    )}
                </div>

                {/* Email + Phone */}
                <div className="grid grid-col md:grid-cols-2 gap-4">
                    <FormInput2
                        label="Email Address"
                        placeholder="e.g. jon.doe@gmail.com"
                        required
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        className="bg-neutral-3"
                        data-testid="input-email"
                        readOnly={isAuthenticated}
                    />
                    <FormInput2
                        label="Phone Number"
                        placeholder="e.g. +234 806 123 4567"
                        required
                        {...register('phone')}
                        error={errors.phone?.message}
                        className="bg-neutral-3"
                        data-testid="input-phone"
                        // Phone may not always be on the user profile — keep editable
                        readOnly={isAuthenticated}
                    />
                </div>

                {/* Marketing checkboxes */}
                <Controller
                    name="sendUpdates"
                    control={control}
                    render={({ field }) => (
                        <FormCheckbox1
                            id="send-updates"
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            error={errors.sendUpdates?.message}
                            className="mt-10"
                            data-testid="checkbox-send-updates"
                            label={
                                <span className="font-normal">
                                    Send me updates on future events and news from this organizer
                                </span>
                            }
                        />
                    )}
                />

                <Controller
                    name="keepInLoop"
                    control={control}
                    render={({ field }) => (
                        <FormCheckbox1
                            id="keep-in-loop"
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            error={errors.keepInLoop?.message}
                            data-testid="checkbox-keep-in-loop"
                            label={
                                <span className="font-normal">
                                    Keep me in the loop with the best events near me or online
                                </span>
                            }
                        />
                    )}
                />

                {/* Group & split features — AUTH USERS ONLY */}
                {isAuthenticated && (
                    <>
                        {/* Share with group */}
                        <Controller
                            name="shareWithGroup"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <div data-testid="share-with-group-toggle">
                                    <div className="flex items-center gap-2 mt-10">
                                        <Switch
                                            id="share-with-group"
                                            checked={value}
                                            onCheckedChange={onChange}
                                            disabled={selectedTickets.length === 0 || (selectedTickets.length === 1 && selectedTickets[0].quantity < 2)}
                                            aria-describedby="share-with-group-info"
                                            {...field}
                                        />
                                        <Label
                                            htmlFor="share-with-group"
                                            className="flex items-center gap-1 font-normal text-secondary-8"
                                        >
                                            <span>Share tickets with a group</span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        id="share-with-group-info"
                                                        aria-label="Share with group: what this means"
                                                        className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                                    >
                                                        <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Tickets go to the emails provided here</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </Label>
                                    </div>
                                    {errors.shareWithGroup?.message && (
                                        <p className="text-xs text-red-500 mt-1.5 ml-1">
                                            {errors.shareWithGroup.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Split payment */}
                        <Controller
                            name="splitPayment"
                            control={control}
                            render={({ field: { value, onChange, ...field } }) => (
                                <div data-testid="split-payment-toggle">
                                    <div className="flex gap-3 justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Switch
                                                id="split-payment"
                                                checked={value}
                                                onCheckedChange={onChange}
                                                disabled={!shareWithGroupEnabled}
                                                aria-describedby="split-payment-info"
                                                {...field}
                                            />
                                            <Label
                                                htmlFor="split-payment"
                                                className="flex items-center gap-1 font-normal text-secondary-8"
                                            >
                                                <span>Split payment with the group</span>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            type="button"
                                                            id="split-payment-info"
                                                            aria-label="Split payment: what this means"
                                                            className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                                        >
                                                            <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Tickets are delivered after all members complete payment.</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Label>
                                        </div>

                                        {value && (
                                            <Select
                                                value={splitMode}
                                                onValueChange={(v) => setSplitMode(v as SplitMode)}
                                            >
                                                <SelectTrigger
                                                    className="w-fit h-9 font-normal text-secondary-9 text-xs md:text-sm"
                                                    data-testid="split-mode-select"
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="font-normal space-y-2 text-secondary-7">
                                                    <SelectItem value="equal" className="hover:bg-accent-4! text-xs">Equal Split</SelectItem>
                                                    <SelectItem value="manual" className="hover:bg-accent-4! text-xs">Manual Input</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </div>
                                    {errors.splitPayment?.message && (
                                        <p className="text-xs text-red-500 mt-1.5 ml-1">
                                            {errors.splitPayment.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />

                        {/* Attendees section */}
                        {shareWithGroupEnabled && (
                            <div className="my-12 space-y-4" data-testid="attendees-section">
                                <div className="flex items-center gap-3 justify-between">
                                    <h3 className={`${space_grotesk.className} text-lg font-medium text-secondary-9`}>
                                        Sharing With Attendees
                                    </h3>
                                    <Button
                                        type="button"
                                        onClick={handleAddAttendee}
                                        disabled={!canAddMoreAttendees}
                                        className="flex items-center gap-2 text-xs px-2! w-fit"
                                        data-testid="add-attendee-btn"
                                        aria-label="Add attendee"
                                    >
                                        <Icon icon="mdi:plus" className="w-5 h-5" aria-hidden="true" />
                                        Add Attendee
                                    </Button>
                                </div>

                                {splitPaymentEnabled && attendees.length > 0 && (
                                    <div className="space-y-2" data-testid="split-summary">
                                        <div className="text-sm text-neutral-7">
                                            {splitMode === 'equal'
                                                ? 'Each person (including you) pays an equal share of the total amount.'
                                                : 'Initiator (you) is responsible for the remaining amount after group members assignment.'
                                            }
                                        </div>
                                        {splitMode === 'equal' ? (
                                            <div className="flex justify-between text-sm text-secondary-8">
                                                <span className="text-neutral-7">Amount per person:</span>
                                                <span className="font-medium">
                                                    {formatPrice(total / (attendees.length + 1), event.currency)}
                                                </span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex justify-between text-sm text-secondary-8">
                                                    <span className="text-neutral-7">Total Assigned to Group:</span>
                                                    <span className="font-medium">
                                                        {formatPrice(getTotalAssignedAmount(), event.currency)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-7">Remaining (your share):</span>
                                                    <span className={`font-medium ${getRemainingAmount() < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {formatPrice(getRemainingAmount(), event.currency)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        {splitError && (
                                            <p className="text-xs text-red-500 mt-2" data-testid="split-error-text">
                                                {splitError}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-8 mt-6">
                                    <AnimatePresence mode="popLayout">
                                        {attendees.map((attendee, index) => (
                                            <motion.div
                                                key={attendee.attendeeID}
                                                initial={{ opacity: 0, height: 0, y: 20 }}
                                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                                exit={{ opacity: 0, height: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                                layout
                                            >
                                                <SplitPaymentAddAttendee
                                                    index={index}
                                                    attendee={attendee}
                                                    onRemove={handleRemoveAttendee}
                                                    canRemove={attendees.length > 1}
                                                    allAttendees={attendees}
                                                    data-testid={`attendee-card-${index}`}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {
                                    errors.attendees && typeof errors.attendees.message === 'string' && (
                                        <ErrorPara error={errors.attendees.message} data-testid="attendees-error" />
                                    )
                                }
                            </div>
                        )}
                    </>
                )}

                {/* Terms — hidden on mobile (rendered in summary instead) */}
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
                            className="mt-10 hidden md:block"
                            data-testid="checkbox-agree-terms"
                            label={
                                <span className="font-normal">
                                    I agree to QavTix{' '}
                                    <Link href="/terms" className="text-accent-6 font-medium hover:underline">
                                        Terms & Conditions
                                    </Link>
                                    {' '}and{' '}
                                    <Link href="/commission" className="text-accent-6 font-medium hover:underline">
                                        Refund Policy
                                    </Link>
                                    .
                                </span>
                            }
                        />
                    )}
                />
            </form>
        </>
    )
}