'use client'

import { DateRange } from 'react-day-picker'
import DateFilter from '../homepage/dropdowns/DateFilter'
import LocationFilter from '../homepage/dropdowns/LocationFilter'
import CategoryFilter from '../homepage/dropdowns/CategoryFilter'
import PriceFilter from '../homepage/dropdowns/PriceFilter'
import { space_grotesk } from '@/lib/fonts'
import EventsCard1 from '../custom-utils/cards/EventCards'
import { useMemo, useState } from 'react'
import { countries, getStates } from '@/components-data/location'
import PaginationControls from '../custom-utils/buttons/event-search/PaginationControl'
import { usePathname } from 'next/navigation'
import { buildTrendingEventsHeading } from '@/helper-fns/buildHeading'
import { fromPublicPagesEvent } from '../custom-utils/cards/resources/event-card-adapter'
import { TRENDING_EVENTS_ENDPOINT } from '@/endpoints'
import { Icon } from '@iconify/react'
import { usePublicEvents } from '@/lib/custom-hooks/UsePublicEvents'
import EventCardLoaderContainer from '../loaders/EventCardLoader'
import { ApiCategory } from '@/actions/filters'
import { deriveCategories } from '@/helper-fns/deriveCategories'

interface Props {
    className?:     string
    initialEvents?: PublicPagesEvent[]
    initialCount?:  number
    initialPages?:  number
    categories: ApiCategory[]
    initialNext?:   boolean
}

export function TrendingEvents({
    className,
    initialEvents = [],
    initialCount  = 0,
    initialPages  = 1,
    categories,
    initialNext   = false,
}: Props) {

    const [showAll, setShowAll] = useState(false)
    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    const {
        items, count, totalPages, currentPage,
        isLoading, isError, isEmpty, goToPage,
    } = usePublicEvents(
        {
            endpoint:     TRENDING_EVENTS_ENDPOINT,
            initialItems: initialEvents,
            initialCount,
            query: "",
            initialPages,
            initialNext,
        },
        filters,
    )

    const pathName = usePathname()
    const showThisFilter = (filterPath: string) => pathName.split("/")[3] !== filterPath

    const pageSize   = showAll ? 12 : 8
    const displayed  = showAll ? items : items.slice(0, pageSize)

    
    const availableCategories = useMemo(
        () => deriveCategories(categories, items),
        [categories, items]
    )

    return (
        <section className={`w-full py-8 global-px ${className}`}>
            <div className="flex flex-wrap gap-4 mb-8">
                {showThisFilter("category") && (
                    <CategoryFilter
                        value={filters.categories}
                        categories={availableCategories}
                        filterFor='eventPage'
                        onChange={(categories) => setFilters(prev => ({ ...prev, categories }))}
                    />
                )}
                {showThisFilter("location") && (
                    <LocationFilter
                        filterFor="eventPage"
                        value={filters.location}
                        onChange={(location) => setFilters(prev => ({ ...prev, location }))}
                        countries={countries}
                        getStates={getStates}
                    />
                )}
                {showThisFilter("price") && (
                    <PriceFilter
                        filterFor="eventPage"
                        value={filters.priceRange}
                        onChange={(priceRange) => setFilters(prev => ({ ...prev, priceRange }))}
                    />
                )}
                {showThisFilter("date") && (
                    <DateFilter
                        filterFor="eventPage"
                        value={filters.dateRange}
                        onChange={(v) => setFilters(prev => ({ ...prev, dateRange: v || { from: new Date(), to: new Date() } as DateRange }))}
                    />
                )}
            </div>

            <div>
                <div className="flex items-center justify-between gap-8">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                        {buildTrendingEventsHeading(filters, categories)}
                    </h2>
                    {!showAll && items.length > pageSize && (
                        <button onClick={() => setShowAll(true)} className="text-sm font-medium text-primary-6 hover:underline">
                            View All
                        </button>
                    )}
                </div>

                {isLoading && (
                    <EventCardLoaderContainer />
                )}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-6">
                        <Icon icon="nonicons:error-16" className="size-6 text-red-400" />
                        <p className="text-sm font-medium text-secondary-8">Could not load events</p>
                    </div>
                )}

                {isEmpty && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-6">
                        <Icon icon="mage:filter" className="size-7 text-neutral-7" />
                        <p className="text-sm font-medium text-secondary-8">No events match your filters</p>
                    </div>
                )}

                {!isLoading && !isError && !isEmpty && (
                    <div className="flex justify-center items-center flex-wrap gap-6 lg:gap-8 md:grid grid-cols-3 lg:grid-cols-4 2xl:flex mt-10">
                        {displayed.map(event => (
                            <EventsCard1
                                key={event.id}
                                {...fromPublicPagesEvent(event)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Full pagination — after showAll */}
            {showAll && totalPages > 1 && !isLoading && (
                <div className="mt-16">
                    <PaginationControls
                        startIndex={(currentPage - 1) * 12 + 1}
                        endIndex={Math.min(currentPage * 12, count)}
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