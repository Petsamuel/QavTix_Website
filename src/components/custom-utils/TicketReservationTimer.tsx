'use client'

import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import ReservationTimeExpiredPrompt from '../modals/ReservationTimeExpiredPrompt'

const RESERVATION_DURATION = 10 * 60 // 10 minutes in seconds

export default function TicketReservationTimer() {
    const { resetCheckout, currentStep, event } = useCheckout()
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [hasExpired, setHasExpired] = useState(false)
    const hasStarted = useRef(false)

    // Start reservation on mount
    useEffect(() => {
        if (!hasStarted.current) {
            setTimeLeft(RESERVATION_DURATION)
            hasStarted.current = true
        }
    }, [])

    // Reset timer when checkout is restarted (step goes back to 1)
    useEffect(() => {
        if (currentStep === 1) {
            setTimeLeft(RESERVATION_DURATION)
            setHasExpired(false)
        }
    }, [currentStep])

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 0) {
                    setHasExpired(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [timeLeft])

    // Called when the user confirms restart — resets everything and closes modal
    const handleRestart = () => {
        resetCheckout()        // sets currentStep → 1 which also triggers the useEffect above
        setHasExpired(false)
        setTimeLeft(RESERVATION_DURATION)
    }

    // Called when the user cancels — go to the event detail page
    const handleCancel = () => {
        const eventDetailPath = `/events/details/${event.id}`
        window.location.href = eventDetailPath
    }

    // Don't show if no reservation started
    if (timeLeft === null) {
        return null
    }

    // Expired state — show modal (never unmount the timer component itself)
    if (hasExpired || timeLeft <= 0) {
        return (
            <ReservationTimeExpiredPrompt
                open={true}
                onRestart={handleRestart}
                onCancel={handleCancel}
            />
        )
    }

    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    const isUrgent = timeLeft <= 60 // Last minute

    return (
        <div
            className={cn(
                'my-10 rounded px-4 py-2 transition-colors',
                isUrgent
                    ? 'bg-orange-50 border-orange-200 animate-pulse'
                    : 'bg-blue-50 border-blue-200'
            )}
        >
            <div className="flex flex-col items-start gap-1">
                {isUrgent && (
                    <h3 className="font-medium text-accent-8">
                        Hurry! Time Running Out
                    </h3>
                )}
                <p className='text-sm text-neutral-7'>
                    Your ticket is temporarily reserved. Please complete checkout in
                    {' '}
                    <span className="font-mono font-medium text-accent-6">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    {' '}to secure your tickets.
                </p>
            </div>
        </div>
    )
}