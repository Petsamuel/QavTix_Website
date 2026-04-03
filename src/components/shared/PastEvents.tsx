'use client'

import { space_grotesk } from '@/lib/fonts'
import EventsCard1 from '../custom-utils/cards/EventCards'
import { useState } from 'react'
import PaginationControls from '../custom-utils/buttons/event-search/PaginationControl'
import { usePublicEvents } from '@/lib/custom-hooks/UsePublicEvents'
import { HOST_PAST_EVENTS_ENDPOINT } from '@/endpoints'
import { fromPublicPagesEvent } from '../custom-utils/cards/resources/event-card-adapter'
import { Icon } from '@iconify/react'
import EventCardLoaderContainer from '../loaders/EventCardLoader'

interface Props {
    hostID:        number
    initialEvents: PublicPagesEvent[]
    initialCount:  number
}

const PAGE_SIZE = 8

export function PastEvents({ hostID, initialEvents, initialCount }: Props) {

    const [showAll, setShowAll] = useState(false)

    const {
        items, count, totalPages, currentPage,
        isLoading, isError, isEmpty,
        goToPage,
    } = usePublicEvents(
        {
            endpoint:     HOST_PAST_EVENTS_ENDPOINT.replace("[host_id]", String(hostID)),
            initialItems: initialEvents,
            initialCount: initialCount,
            initialPages: Math.ceil(initialCount / PAGE_SIZE) || 1,
            initialNext:  initialCount > PAGE_SIZE,
            query: "",
        },
        {},
    )

    const displayed = showAll ? items : items.slice(0, PAGE_SIZE)

    const hasNoEvents = !isLoading && !isError && items.length === 0

    return (
        <section className="w-full py-8">
            <div>
                <div className="flex items-center justify-between gap-8">
                    <h2 className={`${space_grotesk.className} text-2xl sm:text-3xl md:text-[2rem] font-medium text-secondary-9`}>
                        Past events
                    </h2>
                    {!showAll && items.length > PAGE_SIZE && (
                        <button onClick={() => setShowAll(true)} className="text-sm font-medium text-primary-6 hover:underline">
                            View All
                        </button>
                    )}
                </div>

                {isLoading && <EventCardLoaderContainer />}

                {isError && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-6">
                        <Icon icon="nonicons:error-16" className="size-6 text-red-400" />
                        <p className="text-sm font-medium text-secondary-8">Could not load past events</p>
                    </div>
                )}

                {
                    isEmpty && (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-6">
                            <Icon icon="hugeicons:calendar-04" className="size-8 text-neutral-7" />
                            <p className="text-sm font-medium text-secondary-8">No past events found</p>
                            <p className="text-xs text-neutral-7">No result based on your criteria</p>
                        </div>
                    )
                }

                {hasNoEvents && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center mt-6">
                        <Icon icon="hugeicons:calendar-04" className="size-8 text-neutral-7" />
                        <p className="text-sm font-medium text-secondary-9">No past events yet</p>
                        <p className="text-xs text-neutral-7">Events this host has organised will appear here</p>
                    </div>
                )}
            
                {!isLoading && !isError && items.length > 0 && (
                    <div className="flex flex-wrap gap-6 lg:gap-8 md:grid grid-cols-3 lg:grid-cols-4 2xl:flex mt-10">
                        {displayed.map(event => (
                            <EventsCard1
                                key={event.id}
                                {...fromPublicPagesEvent(event)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {showAll && totalPages > 1 && !isLoading && (
                <div className="mt-16">
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