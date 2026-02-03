'use client'

import { DateRange } from 'react-day-picker'
import DateFilter from '../homepage/dropdowns/DateFilter'
import LocationFilter from '../homepage/dropdowns/LocationFilter'
import CategoryFilter from '../homepage/dropdowns/CategoryFilter'
import PriceFilter from '../homepage/dropdowns/PriceFilter'
import { space_grotesk } from '@/lib/fonts'
import EventsCard1 from '../custom-utils/cards/EventCards'
import { eventsMock } from '@/components-data/demo-data'
import { useState } from 'react'
import { countries, getStates } from '@/components-data/location'
import { usePagination } from '@/lib/custom-hooks/PaginationHook'
import PaginationControls from '../custom-utils/buttons/event-search/PaginationControl'
import { usePathname } from 'next/navigation'
import { buildTrendingEventsHeading } from '@/helper-fns/buildHeading'

export function TrendingEvents({ className }:{ className?: string }) {

    const [showAll,setShowAll] = useState(false)
    const pagination = usePagination(eventsMock, showAll ? 12 : 8)
    
    const [filters, setFilters] = useState<FilterValues>({
        categories: [],
        priceRange: null
    })

    const handleSearch = () => {
        console.log('Search with filters:', filters)
    }

    const pathName = usePathname()
    const showThisFilter = (filterPath:string) => {
        return pathName.split("/")[3] === filterPath ? false : true;
    }

    return (
        <section className={`w-full py-8 global-px ${className}`}>
            <div className='flex flex-wrap gap-4 mb-8'>
                {
                    showThisFilter("category") &&
                    <CategoryFilter
                        filterFor='eventPage'
                        value={filters.categories}
                        onChange={(categories) => setFilters({ ...filters, categories })}
                    />
                }
                {
                    showThisFilter("location") &&
                    <LocationFilter
                        filterFor='eventPage'
                        value={filters.location}
                        onChange={(location) => setFilters({ ...filters, location })} 
                        countries={countries}
                        getStates={getStates}
                    />
                }
                {
                    showThisFilter("price") &&
                    <PriceFilter
                        filterFor='eventPage'
                        value={filters.priceRange}
                        onChange={(priceRange) => setFilters({ ...filters, priceRange })}
                    />
                }
                {
                    showThisFilter("date") &&    
                    <DateFilter
                        filterFor='eventPage'
                        value={filters.dateRange}
                        onChange={(v) => setFilters({...filters, dateRange: v || { from: new Date(), to: new Date()} as DateRange})}
                    />
                }
            </div>


            <div>
                <div className="flex items-center justify-between gap-8">
                    <h2
                        className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}
                    >
                        {buildTrendingEventsHeading(filters)}
                    </h2>

                    {
                        !showAll &&
                        <button onClick={() => setShowAll(true)} className='text-sm font-medium text-primary-6 hover:underline'>View All</button>
                    }
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-[repeat(auto-fit,minmax(16em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                    {pagination.currentItems.map((event) => (
                        <EventsCard1 
                            key={event.href}
                            {...event} 
                        />
                    ))}
                </div>
            </div>


            {/* Pagination Controls */}
            {showAll && pagination.totalPages > 1 && (
                <div className="mt-16">
                    <PaginationControls
                        startIndex={pagination.startIndex}
                        endIndex={pagination.endIndex}
                        totalItems={pagination.totalItems}
                        hasNextPage={pagination.hasNextPage}
                        hasPreviousPage={pagination.hasPreviousPage}
                        onNextPage={pagination.nextPage}
                        onPreviousPage={pagination.previousPage}
                    />
                </div>
            )}
        </section>
    )
}