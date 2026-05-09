'use client'

import { cn } from '@/lib/utils'

interface QuickPriceButtonsProps {
    selectedMax: number
    onSelect: (value: number) => void
}

export function QuickPriceButtons({
    selectedMax,
    onSelect,
}: QuickPriceButtonsProps) {
    const quickPrices = [
        { label: 'Free', value: 0 },
        { label: "5,000", value: 5000 },
        { label: "10,000", value: 10000 },
        { label: "20,000", value: 20000 },
    ]

    return (
        <div className="flex flex-wrap gap-3">
            {quickPrices.map((price) => {
                const isSelected =
                    (price.value === 0 && selectedMax === 0) ||
                    (price.value > 0 && selectedMax === price.value)

                return (
                    <button
                        key={price.value}
                        onClick={() => onSelect(price.value)}
                        className={cn(
                            'px-4 py-3 rounded-lg h-10 flex justify-center items-center text-xs font-medium transition-all',
                            isSelected
                                ? 'bg-primary-1 text-neutral-8 border border-primary-6'
                                : 'bg-white text-neutral-7 border border-neutral-4 hover:border-neutral-6'
                        )}
                    >
                        {price.label}
                    </button>
                )
            })}
        </div>
    )
}