'use client';

import { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({
  initialSeconds,
  onExpire,
  className = '',
}: CountdownTimerProps) {

    const [secondsLeft, setSecondsLeft] = useState(initialSeconds)
    const hasExpired = useRef(false)

    useEffect(() => {
        setSecondsLeft(initialSeconds)
        hasExpired.current = false

        if (initialSeconds <= 0) {
            onExpire?.()
            return
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [initialSeconds])

    // Call onExpire outside of the state updater
    useEffect(() => {
        if (secondsLeft === 0 && !hasExpired.current) {
            hasExpired.current = true
            onExpire?.()
        }
    }, [secondsLeft, onExpire])

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(Math.max(0, totalSeconds) / 60)
        const secs = Math.max(0, totalSeconds) % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const isExpired = secondsLeft <= 0

    return (
        <div className="text-center">
            {!isExpired ? (
                <p className="text-sm text-secondary-9">
                    <span>Code expires in </span>
                    <span className={`font-medium tracking-wider text-secondary-9 ${className}`}>
                        {formatTime(secondsLeft)}
                    </span>
                </p>
            ) : (
                <p className="text-sm text-[#616166] text-center">
                    Time expired.
                </p>
            )}
        </div>
    )
}