'use client'

import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { space_grotesk } from '@/lib/fonts'
import { Dispatch, SetStateAction, useState } from 'react'
import { Icon } from '@iconify/react'
import { AnimatedDialogForPrompt } from '../custom-utils/AnimatedDialogForPrompts'
import FormCheckbox1 from '../custom-utils/inputs/FormCheckbox1'
import ActionButton1 from '../custom-utils/buttons/ActionButton1'
import { useAppDispatch } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'
import { cancelTickets } from '@/actions/checkout'
import { Button } from '../ui/button'

interface Props {
    open:                boolean
    setOpen:             Dispatch<SetStateAction<boolean>>
    user_ticket_summary: Pick<UserTicketSummary, "tickets"> | null
    onSuccess?:          () => void   // optional callback after successful cancel
}

export default function CancelTicketPrompt({
    open,
    setOpen,
    user_ticket_summary,
    onSuccess,
}: Props) {

    const dispatch = useAppDispatch()
    const [selectedTickets, setSelectedTickets] = useState<string[]>([])
    const [isLoading,        setIsLoading]        = useState(false)

    const handleToggle = (ticketId: string, checked: boolean) => {
        setSelectedTickets(prev =>
            checked ? [...prev, ticketId] : prev.filter(id => id !== ticketId)
        )
    }

    const handleClose = () => {
        if (isLoading) return
        setSelectedTickets([])
        setOpen(false)
    }

    const handleConfirm = async () => {
        if (selectedTickets.length === 0) {
            dispatch(showAlert({
                variant:     "warning",
                title:       "No tickets selected",
                description: "Please select at least one ticket to cancel.",
            }))

            return;
        }

        setIsLoading(true)

        const result = await cancelTickets(selectedTickets)

        setIsLoading(false)

        if (result.success) {
            dispatch(showAlert({
                variant:     "success",
                title:       "Ticket cancelled",
                description: "Your selected ticket(s) have been cancelled successfully.",
            }))
            setSelectedTickets([])
            setOpen(false)
            onSuccess?.()
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Failed to cancel tickets",
                description: result.message ?? "Failed to cancel tickets. Please try again.",
            }))

            if (result.failedIDs && result.failedIDs.length < selectedTickets.length) {
                // Partial success — some cancelled, remove the ones that succeeded
                setSelectedTickets(result.failedIDs)
                onSuccess?.()
            }
        }
    }

    return (
        <AnimatedDialogForPrompt open={open} onOpenChange={v => !v && handleClose()}>
            <div>
                <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="absolute right-6 top-6 rounded-full p-2 hover:bg-neutral-2 transition-colors disabled:opacity-40"
                >
                    <Icon icon="mdi:close" width="18" height="18" className="text-neutral-8" />
                </button>

                <div className="w-14 h-14 bg-danger-tertiary rounded-full flex items-center justify-center mb-6">
                    <Icon icon="mynaui:ticket-off" width="24" height="24" className="text-danger-default" />
                </div>

                <div className="text-left mb-6">
                    <DialogHeader className="mb-3">
                        <DialogTitle className={`${space_grotesk.className} text-left text-2xl font-medium text-secondary-9`}>
                            Cancel ticket
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-neutral-7 text-sm">
                        This action will cancel your ticket and remove event access. Ticket cancellation is subject to the event's refund policy.
                    </p>
                </div>

                {/* Ticket checkboxes */}
                <div className="space-y-4 mb-6 md:mb-8">
                    {user_ticket_summary?.tickets.filter(t => t.status === "cancelled").map((ticket, index) => (
                        <FormCheckbox1
                            key={ticket.issued_ticket_id}
                            id={`ticket-${ticket.issued_ticket_id}`}
                            label={
                                <span className="font-normal text-secondary-9 capitalize">
                                    Ticket {index + 1} — {ticket.ticket_type}
                                </span>
                            }
                            checked={selectedTickets.includes(String(ticket.issued_ticket_id))}
                            onCheckedChange={(checked) => handleToggle(String(ticket.issued_ticket_id), checked)}
                            disabled={isLoading}
                            flexDirection="flex-row-reverse justify-between"
                        />
                    ))}
                </div>

                <div className="flex gap-3">
                    {/* Cancel / dismiss */}
                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="h-14 flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        Cancel
                    </Button>

                    {/* Confirm cancel */}
                    <ActionButton1
                        buttonText="Confirm"
                        action={handleConfirm}
                        isLoading={isLoading}
                        isDisabled={selectedTickets.length === 0}
                        className="h-14 flex-1 text-sm! rounded-[30px] bg-danger-default! hover:bg-danger-hover! active:bg-danger-pressed! focus:ring-danger-default"
                    />
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}