'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'
import CategoryItemBtn from '@/components/custom-utils/buttons/event-search/CategoryItemBtn'
import EventFilterTypeBtn from '@/components/custom-utils/buttons/event-search/EventFilterTypeBtn'
import { MobileBottomSheet } from '@/components/custom-utils/EventFilterDropdownMobileBottomSheet'
import FilterButtonsActions1 from '@/components/custom-utils/buttons/event-search/FilterActionButtons1'

interface CategoryFilterProps {
    value?:      string[]
    onChange:    (value: string[]) => void
    categories?: Category[]
    filterFor?:  'homepage' | 'eventPage' 
}

export default function CategoryFilter({
    value      = [],
    onChange,
    categories = [],
    filterFor  = "homepage",
}: CategoryFilterProps) {

    const [isOpen,              setIsOpen]              = useState(false)
    const [selectedCategories,  setSelectedCategories]  = useState<string[]>(value)
    const isTablet = useMediaQuery('(min-width: 768px)')

    const triggerVariant = filterFor === "homepage" ? 'default' : 'compact'

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) setSelectedCategories(value)
    }

    const handleToggle = (categoryValue: string) => {
        if (categoryValue === 'all') {
            setSelectedCategories([])
            return
        }
        setSelectedCategories(prev =>
            prev.includes(categoryValue)
                ? prev.filter(v => v !== categoryValue)
                : [...prev, categoryValue]
        )
    }

    const handleApply = () => {
        onChange(selectedCategories)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedCategories([])
    }

    const hasActiveFilter = value.length > 0
    const displayText     = hasActiveFilter ? `${value.length} selected` : 'Event category'

    const categoryList = (
        <div className="space-y-1 max-h-[50vh] overflow-y-auto md:max-h-[unset]">
            {categories.map((category, index) => {
                const isSelected = category.value === 'all'
                    ? selectedCategories.length === 0
                    : selectedCategories.includes(category.value)

                return (
                    <CategoryItemBtn
                        key={index}
                        category={category}
                        isSelected={isSelected}
                        handleToggle={handleToggle}
                    />
                )
            })}
        </div>
    )

    return (
        <>
            {/* Mobile — Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn
                        onClick={() => setIsOpen(true)}
                        displayText={displayText}
                        hasActiveFilter={hasActiveFilter}
                        variant={triggerVariant}
                    />
                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Event Category"
                    >
                        {categoryList}
                        <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet+ — Dropdown */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn
                            displayText={displayText}
                            hasActiveFilter={hasActiveFilter}
                            variant={triggerVariant}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={cn(
                            "w-full min-w-[18em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
                            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-400 data-[state=closed]:ease-in data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
                        )}
                        align="start"
                    >
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Category</h3>
                            {categoryList}
                            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}