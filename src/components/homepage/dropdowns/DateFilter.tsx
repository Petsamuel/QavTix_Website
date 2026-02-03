'use client'

import { useState } from 'react'
import { MobileBottomSheet } from '@/components/custom-utils/EventFilterDropdownMobileBottomSheet'
import FilterButtonsActions1 from '@/components/custom-utils/buttons/event-search/FilterActionButtons1'
import { QuickDateButtons } from '@/components/custom-utils/buttons/event-search/QuickDateButtons'
import { EventSearchDateRangePicker } from '@/components/custom-utils/inputs/event-search/EventSearchDateRangePicker'
import { formatDate } from '@/helper-fns/date-utils'
import { DateRange } from 'react-day-picker'
import EventFilterTypeBtn from '@/components/custom-utils/buttons/event-search/EventFilterTypeBtn'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DateFilterProps {
    value?: DateRange | null
    onChange: (value: DateRange | null) => void,
    filterFor?: "homepage" | "eventPage"
}

export default function DateFilter({ value, onChange, filterFor = "homepage" }: DateFilterProps) {

    
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    
    const [dateRange, setDateRange] = useState<DateRange>(
        value || { from: undefined, to: undefined }
    )

    const hasActiveFilter = value && (value?.from || value?.to)


    const displayText = (() => {
        if (!hasActiveFilter) return 'Date Range'
        if (value?.from && value?.to) {
            return `${formatDate(value.from, 'MMM dd')} - ${formatDate(value.to, 'MMM dd')}`
        }
        if (value?.from) {
            return formatDate(value.from, 'MMM dd, yyyy')
        }
        return 'Date Range'
    })()

    const handleApply = () => {
        onChange(dateRange.from || dateRange.to ? dateRange : null)
        setIsOpen(false)
    }

    const handleClear = () => {
        setDateRange({ from: undefined, to: undefined })
        onChange(null)
    }

    const handleQuickSelect = (range: DateRange) => {
        setDateRange(range)
    }

    const triggerVariant = filterFor === "homepage" ? 'default' : 'compact'

    const filterContent = (
        <>
            <QuickDateButtons
                selectedRange={dateRange}
                onSelect={handleQuickSelect}
            />

            <EventSearchDateRangePicker
                value={dateRange}
                onChange={setDateRange}
            />
        </>
    )

    return (
        <>
            {/* Mobile - Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        hasActiveFilter={!!hasActiveFilter}
                        variant={triggerVariant}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Date"
                    >
                        {filterContent}
                        <FilterButtonsActions1
                            onApply={handleApply}
                            onClear={handleClear}
                        />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet - Dialog */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <EventFilterTypeBtn 
                                onClick={() => setIsOpen(true)}
                                displayText={displayText} 
                                hasActiveFilter={!!hasActiveFilter}
                                variant={triggerVariant}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className={cn(
                            "w-[25em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                            // Open animation
                            "data-[state=open]:animate-in",
                            "data-[state=open]:fade-in-0",
                            "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                            "data-[state=open]:zoom-in-90",
                            "data-[state=open]:slide-in-from-top-4",
                            // Close animation
                            "data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0",
                            "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                            "data-[state=closed]:zoom-out-90",
                            "data-[state=closed]:slide-out-to-top-4"
                        )}
                        align="start"
                    >
                        <div className="space-y-6">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}