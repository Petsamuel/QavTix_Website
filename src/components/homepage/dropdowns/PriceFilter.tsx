'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import FilterButtonsActions1 from '@/components/custom-utils/buttons/event-search/FilterActionButtons1'
import { MobileBottomSheet } from '@/components/custom-utils/EventFilterDropdownMobileBottomSheet'
import { QuickPriceButtons } from '@/components/custom-utils/buttons/event-search/QuickPriceButtons'
import { PriceRangeInputs } from '@/components/custom-utils/inputs/event-search/PriceRangeInputs'
import EventFilterTypeBtn from '@/components/custom-utils/buttons/event-search/EventFilterTypeBtn'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface PriceRange {
    min: number
    max: number
}

interface PriceFilterProps {
    value?:     PriceRange | null
    onChange:   (value: PriceRange | null) => void
    currency?:  string
    filterFor?: FilterFor
}

export default function PriceFilter({
    value,
    onChange,
    filterFor = "homepage",
    currency  = '₦',
}: PriceFilterProps) {

    const [isOpen,      setIsOpen]      = useState(false)
    const [priceRange,  setPriceRange]  = useState<PriceRange>(value || { min: 0, max: 10000 })
    const isTablet = useMediaQuery('(min-width: 768px)')

    const defaultMax      = 500000
    const hasActiveFilter = value && (value.min > 0 || value.max < defaultMax)
    const displayText     = hasActiveFilter
        ? `${currency}${value.min.toLocaleString()} - ${currency}${value.max.toLocaleString()}`
        : 'Price'

    const triggerVariant = filterFor === "homepage" ? 'default' : 'compact'

    const handleApply = () => { onChange(priceRange); setIsOpen(false) }
    const handleClear = () => { setPriceRange({ min: 0, max: 10000 }); onChange(null) }
    const handleQuickPrice  = (price: number) => setPriceRange(price === 0 ? { min: 0, max: 0 } : { min: 0, max: price })
    const handleSliderChange = (values: number[]) => setPriceRange({ min: values[0], max: values[1] })

    const filterContent = (
        <>
            <QuickPriceButtons currency={currency} selectedMax={priceRange.max} onSelect={handleQuickPrice} />
            <div className="pt-4 pb-2">
                <Slider min={0} max={defaultMax} step={1000} value={[priceRange.min, priceRange.max]} onValueChange={handleSliderChange} />
            </div>
            <PriceRangeInputs
                min={priceRange.min}
                max={priceRange.max}
                currency={currency}
                onMinChange={(v) => setPriceRange(prev => ({ ...prev, min: v }))}
                onMaxChange={(v) => setPriceRange(prev => ({ ...prev, max: v }))}
            />
            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
        </>
    )

    return (
        <>
            {/* Mobile — Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn
                        onClick={() => setIsOpen(true)}
                        displayText={displayText}
                        hasActiveFilter={!!hasActiveFilter}
                        variant={triggerVariant}
                    />
                    <MobileBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} title="Price">
                        {filterContent}
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet+ — Dropdown */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn
                            displayText={displayText}
                            hasActiveFilter={!!hasActiveFilter}
                            variant={triggerVariant}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={cn(
                            "w-[25em] z-100 p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-400 data-[state=closed]:ease-in data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
                        )}
                        align="start"
                    >
                        <div className="space-y-6">{filterContent}</div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}