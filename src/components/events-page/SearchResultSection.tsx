"use client"

import { usePagination } from "@/lib/custom-hooks/PaginationHook"
import PaginationControls from "../custom-utils/buttons/event-search/PaginationControl"
import { useState } from "react"
import CategoryFilter from "../homepage/dropdowns/CategoryFilter"
import LocationFilter from "../homepage/dropdowns/LocationFilter"
import PriceFilter from "../homepage/dropdowns/PriceFilter"
import DateFilter from "../homepage/dropdowns/DateFilter"
import { countries, getStates } from "@/components-data/location"
import { eventsMock } from "@/components-data/demo-data"
import EventsCard1 from "../custom-utils/cards/EventCards"
import { DateRange } from "react-day-picker"
import { space_grotesk } from "@/lib/fonts"
import { buildSearchResultsHeading } from "@/helper-fns/buildHeading"

interface SearchResultSectionProps {
  data: IEvent[]
  pageSize?: number
  className?: string
  searchValue: FilterValues
  paginationClassName?: string
}

export function SearchResultSection({
  data,
  searchValue,
  paginationClassName = ''
}: SearchResultSectionProps) {

    const pagination = usePagination(data, 12)

    const [filters, setFilters] = useState<FilterValues>({
        categories: searchValue.categories,
        location: searchValue.location,
        dateRange: searchValue.dateRange,
        priceRange: searchValue.priceRange
    })

    const handleSearch = () => {
        console.log('Search with filters:', filters)
    }


    return (
        <section className="w-full py-8 mt-12 md:mt-20 global-px">
            <div className='flex flex-wrap gap-4 mb-8'>
                <CategoryFilter
                    filterFor='eventPage'
                    value={filters.categories}
                    onChange={(categories) => setFilters({ ...filters, categories })}
                />
                <LocationFilter
                    filterFor='eventPage'
                    value={filters.location}
                    onChange={(location) => setFilters({ ...filters, location })} 
                    countries={countries}
                    getStates={getStates}
                />
                <PriceFilter
                    filterFor='eventPage'
                    value={filters.priceRange}
                    onChange={(priceRange) => setFilters({ ...filters, priceRange })}
                />
                <DateFilter
                    filterFor='eventPage'
                    value={filters.dateRange}
                    onChange={(v) => setFilters({...filters, dateRange: v || { from: new Date(), to: new Date()} as DateRange})}
                />
            </div>

            <h2 className={`max-w-xl text-2xl sm:text-3xl  md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                {buildSearchResultsHeading(searchValue)}
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-[repeat(auto-fit,minmax(16em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                {eventsMock.map((event) => (
                    <EventsCard1 
                        key={event.href}
                        {...event} 
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className={`mt-16 ${paginationClassName}`}>
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