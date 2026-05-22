'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FormInput2 from '@/components/custom-utils/inputs/FormInput2'
import { useTicketUser } from '@/contexts/TicketUserProvider'
import { useFormState } from 'react-hook-form'
import { AttendeeFormData } from '@/schemas/checkout-flow.schema'
import { useSplitPayment } from '@/contexts/SplitPaymentContextProvider'
import { space_grotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { useCheckoutAttendeeInfoForm } from '@/contexts/CheckoutAttendeeInfoFormContext'

interface AttendeeCardProps {
    attendee: AttendeeFormData
    index: number
    canRemove: boolean
    allAttendees: AttendeeFormData[]
    onRemove: (index: number) => void
}

export default function SplitPaymentAddAttendee({ attendee, index, canRemove, onRemove }: AttendeeCardProps) {

    const { groups, event: { age_restriction } } = useCheckout()
    const { splitMode, updateAttendee, splitPaymentEnabled } = useSplitPayment()
    const { user } = useTicketUser()
    const [selectedGroup, setSelectedGroup] = useState<string>('')

    const { form } = useCheckoutAttendeeInfoForm()
    const { register, setValue, watch, clearErrors, control } = form
    const { errors } = useFormState({ control })

    const attendeeErrors = (errors.attendees as any)?.[index]

    // Watch the amount specifically to keep the input controlled
    // Providing a default value of 0 ensures it never becomes 'undefined', against yeye react errors.
    const amountValue = watch(`attendees.${index}.amount`) ?? 0

    const handleCopyFrom = (source: string) => {
        if (!source) return

        const groupId = source.startsWith('group-') ? source.replace(/^group-/, '') : source
        setSelectedGroup(groupId)
        clearErrors(`attendees.${index}`)
    }

    const membersInSelectedGroup = groups.find(g => g.id === selectedGroup)?.members ?? []
    const filteredMembers = membersInSelectedGroup.filter(m => m.email !== user?.email)

    const handleMemberSelect = (memberId: string) => {
        const member = filteredMembers[parseInt(memberId)]
        if (member) {
            setValue(`attendees.${index}.email`, member.email)
            clearErrors(`attendees.${index}.email` as any)

            if (member.name) {
                setValue(`attendees.${index}.name`, member.name)
                clearErrors(`attendees.${index}.name` as any)
            }
            if (member.phone_number) {
                setValue(`attendees.${index}.phone`, member.phone_number)
                clearErrors(`attendees.${index}.phone` as any)
            }
            if (member.dob) {
                setValue(`attendees.${index}.dateOfBirth`, member.dob)
                clearErrors(`attendees.${index}.dateOfBirth` as any)
            }
            
            updateAttendee(attendee.attendeeID, { 
                email: member.email,
                ...(member.name && { name: member.name }),
                ...(member.phone_number && { phone: member.phone_number }),
                ...(member.dob && { dateOfBirth: member.dob })
            })
        }
    }

    return (
        <div className="p-4 space-y-4 border rounded-lg border-neutral-3 bg-neutral-1/50">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-between w-full gap-3">
                    <h3 className={`${space_grotesk.className} font-medium md:text-lg text-secondary-9`}>
                        Attendee {index + 2}
                    </h3>

                    {splitPaymentEnabled && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-6">Amount:</span>
                            <input
                                type="number"
                                // We separate name and onChange from register to handle custom logic
                                {...register(`attendees.${index}.amount` as const, { valueAsNumber: true })}
                                value={amountValue}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0
                                    // Update RHF state
                                    setValue(`attendees.${index}.amount`, val)
                                    clearErrors(`attendees.${index}.amount` as any)
                                    // Update SplitPayment Context
                                    updateAttendee(attendee.attendeeID, { amount: val })
                                }}
                                disabled={splitMode === 'equal'}
                                className="w-24 px-2 py-1 text-sm border rounded-md border-neutral-4 disabled:bg-neutral-2 focus:outline-none focus:ring-1 focus:ring-accent-6"
                                placeholder="0.00"
                            />
                        </div>
                    )}
                </div>

                {canRemove && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        <Icon icon="mdi:close" className="w-5 h-5" />
                    </Button>
                )}
            </div>

            <div className='grid grid-cols-1 gap-2 mt-4 md:grid-cols-2'>
                <Select onValueChange={handleCopyFrom}>
                    <SelectTrigger className="w-full text-xs bg-neutral-2">
                        <SelectValue placeholder="Copy details from" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map(group => (
                            <SelectItem key={group.id} value={group.id} className='text-xs hover:bg-accent-3!'>{group.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {selectedGroup && (
                    <Select onValueChange={handleMemberSelect}>
                        <SelectTrigger className="w-full text-xs bg-neutral-2">
                            <SelectValue placeholder="Select member" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredMembers.map((m, idx) => (
                                <SelectItem key={m.email} value={idx.toString()} className='text-xs hover:bg-accent-3!'>{m.email}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="space-y-4">
                <div className={cn("grid gap-4", age_restriction ? "md:grid-cols-2" : "grid-cols-1")}>
                    <FormInput2
                        label="Attendee name"
                        placeholder="e.g. Jon"
                        {...register(`attendees.${index}.name` as const)}
                        error={attendeeErrors?.name?.message}
                        required
                    />
                    {age_restriction && (
                        <FormInput2
                            label="Date of birth"
                            placeholder="DD/MM/YY"
                            type='date'
                            {...register(`attendees.${index}.dateOfBirth` as const)}
                            error={attendeeErrors?.dateOfBirth?.message}
                            required
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormInput2
                        label="Email address"
                        type="email"
                        placeholder="e.g. Jon.Doe@gmail.com"
                        {...register(`attendees.${index}.email` as const)}
                        error={attendeeErrors?.email?.message}
                        required
                    />
                    <FormInput2
                        label="Phone number"
                        {...register(`attendees.${index}.phone` as const)}
                        placeholder="e.g. +234 806 123 4567"
                        error={attendeeErrors?.phone?.message}
                        required
                    />
                </div>
            </div>
        </div>
    )
}