"use client"

import { useEffect, useState } from "react"
import EventsCard1 from "../custom-utils/cards/EventCards"
import { space_grotesk } from "@/lib/fonts"
import { searchEvents, SearchEventsFilters } from "@/actions/filters/client"
import { useRecentSearches, RecentSearchEntry } from "@/lib/custom-hooks/UseRecentSearch"
import { resolveCountryLabel, resolveStateLabel } from "@/helper-fns/resolveCountryCode"
import EventCardLoaderContainer from "../loaders/EventCardLoader"
import { fromPublicPagesEvent } from "../custom-utils/cards/resources/event-card-adapter"

const DISPLAY_COUNT       = 4
const MAX_SEARCHES_TO_USE = 3

function buildFiltersFromEntry(entry: RecentSearchEntry): {
    query:   string
    filters: SearchEventsFilters
} {
    const filters: SearchEventsFilters = {}

    if (entry.categories.length > 0) {
        filters.categories = entry.categories.map(c => Number(c.id))
    }

    if (entry.location?.countryCode) {
        filters.country = resolveCountryLabel(entry.location.countryCode)
        if (entry.location.stateCode) {
            filters.state = resolveStateLabel(
                entry.location.stateCode,
                entry.location.countryCode,
            )
        }
    }

    if (entry.priceRange) {
        if (entry.priceRange.min != null) filters.min_price = entry.priceRange.min
        if (entry.priceRange.max != null) filters.max_price = entry.priceRange.max
    }

    return { query: entry.query ?? "", filters }
}

/**
 * Interleaves results from multiple queries so no single search dominates.
 * Deduplicates by event id/href.
 */
function mergeAndDedupe(batches: PublicPagesEvent[][]): PublicPagesEvent[] {
    const seen   = new Set<string | number>()
    const merged: PublicPagesEvent[] = []

    const maxLen = Math.max(...batches.map(b => b.length))

    for (let i = 0; i < maxLen; i++) {
        for (const batch of batches) {
            const event = batch[i]
            if (!event) continue
            const key = event.id
            if (key && seen.has(key)) continue
            if (key) seen.add(key)
            merged.push(event)
        }
    }

    return merged
}

export default function BasedOnRecentSearchSection() {
    const { searches } = useRecentSearches()

    const [events, setEvents] = useState<PublicPagesEvent[]>([])
    const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle")

    useEffect(() => {
        if (searches.length === 0) return

        let cancelled = false

        async function fetchFromRecentSearches() {
            setStatus("loading")

            try {
                const entriesToUse   = searches.slice(0, MAX_SEARCHES_TO_USE)
                const perEntryLimit  = Math.ceil(DISPLAY_COUNT / entriesToUse.length) + 1

                const results = await Promise.allSettled(
                    entriesToUse.map(entry => {
                        const { query, filters } = buildFiltersFromEntry(entry)
                        return searchEvents(query, perEntryLimit, filters)
                    })
                )

                if (cancelled) return

                const batches: PublicPagesEvent[][] = results
                    .filter(
                        (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof searchEvents>>> =>
                            r.status === "fulfilled" &&
                            !!r.value.success &&
                            !!r.value.data?.length
                    )
                    .map(r => r.value.data!)

                if (batches.length === 0) {
                    setStatus("done")
                    return
                }

                const merged = mergeAndDedupe(batches).slice(0, DISPLAY_COUNT)

                setEvents(merged)
                setStatus("done")
            } catch {
                if (!cancelled) setStatus("error")
            }
        }

        fetchFromRecentSearches()

        return () => { cancelled = true }
    }, [searches])

    if (status === "idle" || status === "error")  return null
    if (status === "done" && events.length === 0) return null

    return (
        <section className="my-24 md:my-28 global-px">
            <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                Based on recent searches
            </h2>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-[repeat(auto-fit,minmax(16em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
                {status === "loading"
                    ? <EventCardLoaderContainer />
                    : events.map(event => (
                          <EventsCard1 key={event.id} {...fromPublicPagesEvent(event)} />
                      ))
                }
            </div>
        </section>
    )
}