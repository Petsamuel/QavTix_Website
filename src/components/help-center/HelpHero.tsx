'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'

interface HelpHeroProps {
    search: string
    onSearchChange: (value: string) => void
    onClearSearch: () => void
    quickFilters: string[]
    activeFilter: string | null
    onFilterClick: (f: string) => void
}

export default function HelpHero({
    search,
    onSearchChange,
    onClearSearch,
    quickFilters,
    activeFilter,
    onFilterClick,
}: HelpHeroProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleClear = () => {
        onClearSearch()
        inputRef.current?.focus()
    }

    return (
        <section className="global-px py-16 md:pt-20 md:pb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="max-w-2xl"
            >
                <h1 className={cn(
                    space_grotesk.className,
                    'text-2xl md:text-3xl lg:text-[40px] font-bold text-secondary-9 leading-tight mb-4'
                )}>
                    How can we help you today?
                </h1>
                <p className="text-neutral-8 text-base mb-8">
                    Everything you need to know about ticketing, events, payouts, and your QavTix account, all in one place.
                </p>

                {/* Search input */}
                <div className="mb-5">
                    <div className="flex md:max-w-lg items-center gap-3 bg-accent-1 border border-[#FFD5C2]/60 rounded-3xl h-12 px-5 py-4 focus-within:border-primary-7 focus-within:bg-white transition-all duration-200">
                        <Icon icon="hugeicons:search-01" className="size-5 text-secondary-5 shrink-0" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={e => onSearchChange(e.target.value)}
                            placeholder="Search for answers"
                            className="flex-1 bg-transparent outline-none text-secondary-9 placeholder:text-neutral-8 text-sm"
                            aria-label="Search help topics"
                        />
                        {search && (
                            <button
                                onClick={handleClear}
                                className="text-neutral-5 hover:text-secondary-8 transition-colors"
                                aria-label="Clear search"
                            >
                                <Icon icon="lucide:x" className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick filter pills */}
                <div className="flex flex-wrap gap-2">
                    {quickFilters.map(f => (
                        <button
                            key={f}
                            onClick={() => onFilterClick(f)}
                            className={cn(
                                'px-4 py-1.5 rounded-md border text-sm shadow-xs transition-all duration-150',
                                activeFilter === f
                                    ? 'bg-secondary-8 text-white border-secondary-8'
                                    : 'bg-white text-neutral-7 border-neutral-4 hover:border-secondary-5 hover:text-secondary-9'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}
