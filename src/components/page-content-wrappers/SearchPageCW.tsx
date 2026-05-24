"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import { fromPublicPagesEvent } from "@/components/custom-utils/cards/resources/event-card-adapter"
import { formatEventDate } from "@/helper-fns/date-utils"
import { formatPrice, parsePrice } from "@/helper-fns/formatPrice"
import { resolveSearchIntent } from "@/components-data/search-intelligence"
import { searchEvents } from "@/actions/filters/client"

export default function SearchPage() {

    const searchParams = useSearchParams()
    const router = useRouter()

    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [intent, setIntent] = useState<SearchResult | null>(null)
    const [events, setEvents] = useState<PublicPagesEvent[]>([])
    const [totalEvents, setTotalEvents] = useState(0)
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    const handleQuery = useCallback((value: string) => {
        setQuery(value)

        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        if (!value.trim()) {
            setIntent(null)
            setEvents([])
            setHasSearched(false)
            return
        }

        // Instant intent detection — no debounce needed, pure JS
        const result = resolveSearchIntent(value)
        setIntent(result)

        if (result.intent !== 'event') {
            setEvents([])
            setHasSearched(true)
            return
        }

        // Debounce API call — 350ms sweet spot (fast but not hammering)
        debounceTimer.current = setTimeout(async () => {
            if (abortRef.current) abortRef.current.abort()

            setIsSearching(true)
            setHasSearched(false)

            const res = await searchEvents(value.trim())

            setIsSearching(false)
            setHasSearched(true)
            setEvents(res.data ?? [])
            setTotalEvents(res.total ?? 0)
        }, 350)
    }, [])

    // Run on mount if query param present
    useEffect(() => {
        if (query) handleQuery(query)
    }, [])

    const goToFullSearch = () => {
        router.push(`${NAV_LINKS.SEARCH_EVENTS.href}?q=${encodeURIComponent(query)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && query.trim() && intent?.intent === 'event') {
            goToFullSearch()
        }
    }

    const showEmpty = hasSearched && !isSearching && query.trim() && events.length === 0 && intent?.intent === 'event'
    const showEvents = events.length > 0 && intent?.intent === 'event'
    const showPages = intent && intent.intent !== 'event' && intent.intent !== 'empty' && intent.suggestions.length > 0

    return (
        <main className="bg-white min-h-screen pt-28 pb-20 global-px">

            {/* Search Input */}
            <div className="relative group max-w-3xl mx-auto">
                <Icon
                    icon="hugeicons:search-01"
                    className="absolute left-5 top-1/2 shrink-0 -translate-y-1/2 size-6 text-neutral-7 group-focus-within:text-primary transition-colors duration-200"
                />
                <input
                    type="text"
                    value={query}
                    onChange={e => handleQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search events, categories, or organizers..."
                    autoFocus
                    className="
                        w-full h-16 pl-14 pr-14
                        text-sm text-secondary-9 placeholder:text-neutral-6
                        bg-neutral-2
                        border-[1.5px] border-neutral-5 rounded-xl
                        outline-none
                        transition-all duration-300 ease-out
                        hover:bg-neutral-2 hover:border-neutral-6
                        focus:border-primary-7 focus:shadow-lg focus:shadow-primary/10
                    "
                />
                {query ? (
                    <button onClick={() => handleQuery("")} aria-label="Clear search">
                        <Icon
                            icon="material-symbols-light:cancel-outline-rounded"
                            className="absolute right-5 top-1/2 -translate-y-1/2 size-7 text-neutral-7 hover:text-secondary-9 transition-colors"
                        />
                    </button>
                ) : (
                    <button onClick={() => router.back()} aria-label="Go back">
                        <Icon
                            icon="material-symbols-light:cancel-outline-rounded"
                            className="absolute right-5 top-1/2 -translate-y-1/2 size-7 text-neutral-7 hover:text-secondary-9 transition-colors"
                        />
                    </button>
                )}
            </div>

            {/* Results Area */}
            <div className="max-w-3xl mx-auto mt-8 space-y-8">

                {/* Loading */}
                {isSearching && (
                    <div className="flex items-center justify-center py-12 gap-3">
                        <Icon icon="eos-icons:three-dots-loading" className="size-14 text-primary" />
                        <span className="text-sm text-neutral-7">Searching events...</span>
                    </div>
                )}

                {/* Page / Category / Support Suggestions */}
                {showPages && !isSearching && (
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-neutral-5 uppercase tracking-widest">
                            {intent.intent === 'support' ? 'Need help?' : 'Pages'}
                        </p>
                        {intent.suggestions.map(s => (
                            <Link
                                key={s.href}
                                href={s.href}
                                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-4 hover:border-primary hover:bg-primary-1 transition-all duration-150 group"
                            >
                                <div className="size-10 rounded-full bg-primary-1 group-hover:bg-primary-2 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon icon={s.icon} className="size-5 text-primary-6" />
                                </div>
                                <div>
                                    <p className={`${space_grotesk.className} text-sm font-medium text-secondary-9`}>{s.label}</p>
                                    <p className="text-xs text-neutral-6">{s.description}</p>
                                </div>
                                <Icon icon="iconoir:arrow-right" className="size-4 text-neutral-5 ml-auto group-hover:text-primary-6 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Event Results Preview — top 3 */}
                {showEvents && !isSearching && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-neutral-7 uppercase tracking-widest">
                                Events
                            </p>
                            <span className="text-xs text-neutral-5">{totalEvents} result{totalEvents !== 1 ? 's' : ''}</span>
                        </div>

                        {events.map(event => {
                            const card = fromPublicPagesEvent(event)
                            return (
                                <Link
                                    key={event.id}
                                    href={`/events/details/${event.id}`}
                                    className="flex items-center gap-4 p-3 rounded-xl border border-neutral-4 hover:border-primary hover:bg-primary-1 transition-all duration-150 group"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-neutral-3">
                                        {card.image ? (
                                            <Image src={card.image} alt={card.title} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon icon="hugeicons:calendar-03" className="size-6 text-neutral-5" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className={`${space_grotesk.className} text-sm font-medium text-secondary-9 truncate`}>
                                            {card.title}
                                        </p>
                                        <p className="text-xs text-neutral-6 truncate mt-0.5">
                                            {card.date ? formatEventDate(card.date) : 'Date TBA'}
                                        </p>
                                        <p className="text-xs text-neutral-5 truncate">
                                            {card.location}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        {card.price && parsePrice(card.price) != null && (
                                            <p className={`${space_grotesk.className} text-sm font-semibold text-secondary-9`}>
                                                {parsePrice(card.price) === 0 ? 'Free' : formatPrice(parsePrice(card.price)!, card.currency || 'NGN')}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}

                        {/* View all button */}
                        {totalEvents > 3 && (
                            <button
                                onClick={goToFullSearch}
                                className="w-full py-3.5 rounded-xl border-[1.5px] border-primary text-primary text-sm font-medium hover:bg-primary-1 active:scale-[0.99] transition-all duration-150 flex items-center justify-center gap-2"
                            >
                                View all {totalEvents} results for &ldquo;{query}&rdquo;
                                <Icon icon="iconoir:arrow-right" className="size-4" />
                            </button>
                        )}
                    </div>
                )}

                {/* No results */}
                {showEmpty && (
                    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                        <div className="size-14 rounded-full bg-neutral-2 flex items-center justify-center">
                            <Icon icon="hugeicons:search-remove-01" className="size-7 text-neutral-5" />
                        </div>
                        <div>
                            <p className={`${space_grotesk.className} text-base font-medium text-secondary-9`}>
                                No events found for &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-sm text-neutral-7 mt-1">
                                Try different keywords, or explore all events
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

                {/* Empty state — nothing typed yet */}
                {!query && (
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-neutral-7 uppercase tracking-widest">
                            Quick links
                        </p>
                        {[
                            { label: 'Explore all events', href: NAV_LINKS.EVENTS.href, icon: 'hugeicons:calendar-03' },
                            { label: 'Pricing plans', href: NAV_LINKS.PRICING.href, icon: 'hugeicons:money-bag-01' },
                            { label: 'Contact support', href: NAV_LINKS.CONTACT_US.href, icon: 'hugeicons:customer-support' },
                            { label: 'FAQ', href: NAV_LINKS.FAQ.href, icon: 'hugeicons:help-circle' },
                        ].map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-3 hover:border-primary hover:bg-primary-1 transition-all duration-150 group"
                            >
                                <div className="size-9 rounded-full bg-neutral-2 group-hover:bg-primary-1 flex items-center justify-center shrink-0 transition-colors">
                                    <Icon icon={link.icon} className="size-6 text-neutral-7 group-hover:text-primary-6" />
                                </div>
                                <span className="text-sm font-medium text-neutral-8 group-hover:text-secondary-9">
                                    {link.label}
                                </span>
                                <Icon icon="iconoir:arrow-right" className="size-4 text-neutral-7 ml-auto group-hover:text-primary-6 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}