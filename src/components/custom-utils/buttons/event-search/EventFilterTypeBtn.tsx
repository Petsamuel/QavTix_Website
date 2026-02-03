'use client'

import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface EventFilterTypeBtnProps {
    onClick: () => void
    displayText: string
    hasActiveFilter: boolean
    variant?: 'default' | 'compact'
}

export default function EventFilterTypeBtn({
    onClick,
    displayText,
    hasActiveFilter,
    variant = 'default'
}: EventFilterTypeBtnProps) {
    const baseStyles = 'flex items-center gap-3 transition-colors outline-none'

    const variants = {
        default: cn(
            'w-full justify-between text-left text-sm rounded-xl font-normal h-14 md:h-[8vh] px-4',
            'bg-accent-1 hover:bg-accent-2/60 border border-transparent'
        ),
        compact: cn(
            'px-4 justify-between text-xs rounded-[11px] h-9 min-w-24 font-medium',
            'bg-white border border-neutral-5',
            'hover:border-primary hover:bg-primary-1'
        )
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                baseStyles,
                variants[variant],
                hasActiveFilter ? 'text-neutral-8' : 'text-neutral-7'
            )}
        >
            <span className="truncate">{displayText}</span>

            <Icon
                icon="fluent:chevron-down-20-filled"
                className={cn(
                    'size-5 shrink-0 text-neutral-6',
                    'group-hover:text-primary-6'
                )}
            />
        </button>
    )
}