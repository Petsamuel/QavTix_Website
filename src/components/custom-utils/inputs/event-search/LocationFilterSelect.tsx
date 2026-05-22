'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'


interface FilterSelectProps {
    value?: string
    onValueChange?: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    className?: string
    disabled?: boolean
}

export function LocationFilterSelect({
    value,
    onValueChange,
    options,
    placeholder = 'Select',
    className,
    disabled = false
}: FilterSelectProps) {
    const hasActiveFilter = !!value

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger
                className={cn(
                    'w-full flex items-center justify-between text-left text-sm rounded-xl font-normal h-14! px-4 bg-accent-1 hover:bg-accent-2/60 border border-transparent transition-colors',
                    hasActiveFilter ? 'text-neutral-8' : 'text-neutral-7',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-75 relative z-100">
                {options.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-neutral-6 text-center">
                        No options available
                    </div>
                ) : (
                    [...options]
                        .sort((a, b) => a.label.localeCompare(b.label))
                        .map(option => (
                            <SelectItem 
                                key={option.value} 
                                value={option.value}
                                className="hover:bg-accent-2! hover:text-secondary-9 cursor-pointer"
                            >
                                {option.label}
                            </SelectItem>
                        ))
                )}
            </SelectContent>
        </Select>
    )
}