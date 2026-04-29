'use client'

import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import ReservationTimeExpiredPrompt from '../modals/ReservationTimeExpiredPrompt'

const RESERVATION_DURATION = 10 * 60 // 10 minutes in seconds

export default function TicketReservationTimer() {
    const { resetCheckout } = useCheckout()
    const router = useRouter()
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

    const handleBackToTickets = () => {
        resetCheckout()
        router.back()
    }

    // Don't show if no reservation started
    if (timeLeft === null) {
        return null
    }

    // Expired state
    if (hasExpired || timeLeft <= 0) {
        return <ReservationTimeExpiredPrompt open={true} />
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