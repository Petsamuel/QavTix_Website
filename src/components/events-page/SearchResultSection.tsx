"use client"

import { useMemo, useState } from "react"
import { DateRange } from "react-day-picker"
import { space_grotesk } from "@/lib/fonts"
import { Icon } from "@iconify/react"
import Link from "next/link"
import CategoryFilter from "../homepage/dropdowns/CategoryFilter"
import LocationFilter from "../homepage/dropdowns/LocationFilter"
import PriceFilter from "../homepage/dropdowns/PriceFilter"
import DateFilter from "../homepage/dropdowns/DateFilter"
import EventsCard1 from "../custom-utils/cards/EventCards"
import PaginationControls from "../custom-utils/buttons/event-search/PaginationControl"
import EventCardLoaderContainer from "../loaders/EventCardLoader"
import { countries, getStates } from "@/components-data/location"
import { fromPublicPagesEvent } from "../custom-utils/cards/resources/event-card-adapter"
import { buildSearchResultsHeading } from "@/helper-fns/buildHeading"
import { usePublicEvents } from "@/lib/custom-hooks/UsePublicEvents"
import { SEARCH_EVENTS_ENDPOINT } from "@/endpoints"
import { ApiCategory } from "@/actions/filters"
import { deriveCategories } from "@/helper-fns/deriveCategories"
import { useAppSelector } from "@/lib/redux/hooks"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"

const PAGE_SIZE = 12

interface Props {
    query:                string
    initialEvents:        PublicPagesEvent[]
    initialCount:         number
    initialFilters:       Partial<FilterValues>
    categories:           ApiCategory[]
    paginationClassName?: string
}

export function SearchResultSection({
    query,
    initialEvents,
    initialCount,
    initialFilters,
    categories,
    paginationClassName = '',
}: Props) {

    const { currency } = useAppSelector(s => s.settings)
    const [filters, setFilters] = useState<Partial<FilterValues>>(initialFilters)

    const {
        items, count, totalPages, currentPage,
        isLoading, isError,
        goToPage,
    } = usePublicEvents(
        {
            endpoint:     `${SEARCH_EVENTS_ENDPOINT}?q=${encodeURIComponent(query)}`,
            initialItems: initialEvents,
            initialCount: initialCount,
            initialPages: Math.ceil(initialCount / PAGE_SIZE) || 1,
            initialNext:  initialCount > PAGE_SIZE,
        },
        filters,
    )

    const availableCategories = useMemo(
        () => deriveCategories(categories, items),
        [categories, items]
    )

    // User has typed a query or applied at least one filter
    const hasActiveSearch =
        !!query.trim() ||
        (filters.categories?.length ?? 0) > 0 ||
        !!filters.location?.country   ||
        !!filters.priceRange          ||
        !!filters.dateRange?.from

    const showEmpty  = !isLoading && !isError && items.length === 0 && hasActiveSearch
    const showPrompt = !isLoading && !isError && items.length === 0 && !hasActiveSearch

    return (
        <section className="w-full py-8 mt-12 md:mt-20 global-px">

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
                <CategoryFilter
                    filterFor="eventPage"
                    value={filters.categories}
                    categories={availableCategories}
                    onChange={(cats) => setFilters(prev => ({ ...prev, categories: cats }))}
                />
                <LocationFilter
                    filterFor="eventPage"
                    value={filters.location}
                    onChange={(location) => setFilters(prev => ({ ...prev, location }))}
                    countries={countries}
                    getStates={getStates}
                />
                <PriceFilter
                    filterFor="eventPage"
                    value={filters.priceRange}
                    onChange={(priceRange) => setFilters(prev => ({ ...prev, priceRange }))}
                />
                <DateFilter
                    filterFor="eventPage"
                    value={filters.dateRange}
                    onChange={(v) => setFilters(prev => ({ ...prev, dateRange: v || { from: new Date(), to: new Date() } as DateRange }))}
                />
            </div>

            {/* Heading — only when there's something active */}
            {hasActiveSearch && !isLoading && (
                <h2 className={`max-w-xl text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 mb-10 ${space_grotesk.className}`}>
                    {buildSearchResultsHeading(filters as FilterValues, currency)}
                    {query && (
                        <span className="text-primary-6 ml-2">
                            &ldquo;{query}&rdquo;
                        </span>
                    )}
                </h2>
            )}

            {/* Loading */}
            {isLoading && <EventCardLoaderContainer />}

            {/* Error */}
            {isError && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <Icon icon="nonicons:error-16" className="size-8 text-red-400" />
                    <p className="text-sm font-medium text-secondary-8">Something went wrong. Please try again.</p>
                </div>
            )}

            {/* Empty — search/filter returned nothing */}
            {showEmpty && (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div className="size-14 rounded-full bg-neutral-2 flex items-center justify-center">
                        <Icon icon="hugeicons:search-remove-01" className="size-7 text-neutral-5" />
                    </div>
                    <div>
                        <p className={`${space_grotesk.className} text-base font-medium text-secondary-9`}>
                            No events found
                            {query && <> for &ldquo;{query}&rdquo;</>}
                        </p>
                        <p className="text-sm text-neutral-6 mt-1">
                            Try adjusting your filters or search for something else
                        </p>
                    </div>
                    <Link
                        href={NAV_LINKS.EVENTS.href}
                        className="px-6 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-7 transition-colors"
                    >
                        Browse all events
                    </Link>
                </div>
            )}

            {/* Prompt — page opened with no search or filters yet */}
            {showPrompt && (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <Icon icon="hugeicons:search-01" className="size-10 text-neutral-4" />
                    <p className={`${space_grotesk.className} text-base font-medium text-secondary-9`}>
                        Search for events
                    </p>
                    <p className="text-sm text-neutral-6">
                        Use the search bar above or apply filters to find events
                    </p>
                </div>
            )}

            {/* Results */}
            {!isLoading && !isError && items.length > 0 && (
                <>
                    <p className="text-xs text-neutral-5 mb-6">
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, count)} of {count} result{count !== 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-[repeat(auto-fit,minmax(16em,1fr))] gap-6 lg:gap-8 justify-items-center md:justify-items-start">
                        {items.map(event => (
                            <EventsCard1
                                key={event.id}
                                {...fromPublicPagesEvent(event)}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
                <div className={`mt-16 ${paginationClassName}`}>
                    <PaginationControls
                        startIndex={(currentPage - 1) * PAGE_SIZE + 1}
                        endIndex={Math.min(currentPage * PAGE_SIZE, count)}
                        totalItems={count}
                        hasNextPage={currentPage < totalPages}
                        hasPreviousPage={currentPage > 1}
                        onNextPage={() => goToPage(currentPage + 1)}
                        onPreviousPage={() => goToPage(currentPage - 1)}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            )}
        </section>
    )
}