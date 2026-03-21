"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format } from "date-fns"

export type PublicFetchStatus = "idle" | "loading" | "loadingMore" | "error" | "empty"

export interface PublicEventsState {
    items:         PublicPagesEvent[]
    count:         number
    totalPages:    number
    hasNext:       boolean
    currentPage:   number
    status:        PublicFetchStatus
    isLoading:     boolean
    isLoadingMore: boolean
    isError:       boolean
    isEmpty:       boolean
    loadMore:      () => void
    goToPage:      (page: number) => void
}

interface Config {
    endpoint:     string
    initialItems: PublicPagesEvent[]
    initialCount: number
    initialPages: number
    initialNext:  boolean
}

// Builds query params from public filter values
const buildPublicFilterParams = (filters: Partial<FilterValues>): Record<string, string> => {
    const params: Record<string, string> = {}
    if (filters.categories?.length)                                    params.category  = filters.categories.join(',')
    if (filters.dateRange?.from)                                       params.start_date = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to)                                         params.end_date   = format(new Date(filters.dateRange.to), 'yyyy-MM-dd')
    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price  = String(filters.priceRange.min)
    if (filters.priceRange?.max != null)                               params.max_price  = String(filters.priceRange.max)
    if (filters.location?.state)                                       params.state       = filters.location.state
    if (filters.location?.country)                                     params.country    = filters.location.country
    return params
}

const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.location?.state ||
        filters.location?.country
    )

async function fetchPublicEvents(
    endpoint:    string,
    filterParams: Record<string, string>,
    page:        number,
): Promise<{ results: PublicPagesEvent[]; count: number; next: boolean; total_pages: number } | null> {
    try {
        const params = new URLSearchParams({ ...filterParams, page: String(page) })
        const res    = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}?${params}`)

        if (!res.ok) {
            console.log("[usePublicEvents] fetch failed:", res.status)
            return null
        }

        const json = await res.json()
        const data = json.data ?? json

        return {
            results:     data.results ?? [],
            count:       data.count   ?? 0,
            next:        !!data.next,
            total_pages: data.total_pages ?? 1,
        }
    } catch (err) {
        console.log("[usePublicEvents] error:", err)
        return null
    }
}

export function usePublicEvents(
    config:  Config,
    filters: Partial<FilterValues>,
): PublicEventsState {

    const [items,       setItems]       = useState<PublicPagesEvent[]>(config.initialItems)
    const [count,       setCount]       = useState(config.initialCount)
    const [totalPages,  setTotalPages]  = useState(config.initialPages)
    const [hasNext,     setHasNext]     = useState(config.initialNext)
    const [currentPage, setCurrentPage] = useState(1)
    const [status,      setStatus]      = useState<PublicFetchStatus>("idle")

    const filtersRef       = useRef(filters)
    filtersRef.current     = filters
    const isFetching       = useRef(false)
    const initialized      = useRef(false)
    const pageRef          = useRef(1)

    const filterKey = [
        filters.categories?.join(',')       ?? '',
        filters.dateRange?.from?.toString() ?? '',
        filters.dateRange?.to?.toString()   ?? '',
        String(filters.priceRange?.min      ?? ''),
        String(filters.priceRange?.max      ?? ''),
        filters.location?.state              ?? '',
        filters.location?.country           ?? '',
    ].join('|')

    const prevFilterKey = useRef(filterKey)

    const fetchData = useRef(async (page: number, append: boolean) => {
        if (isFetching.current) return
        isFetching.current = true
        setStatus(append ? "loadingMore" : "loading")

        const result = await fetchPublicEvents(
            config.endpoint,
            buildPublicFilterParams(filtersRef.current),
            page,
        )

        isFetching.current = false

        if (!result) {
            setStatus("error")
            return
        }

        if (result.results.length === 0 && !append) {
            setItems([])
            setCount(0)
            setHasNext(false)
            setTotalPages(0)
            setCurrentPage(1)
            setStatus("empty")
            return
        }

        setItems(prev => append ? [...prev, ...result.results] : result.results)
        setCount(result.count)
        setHasNext(result.next)
        setTotalPages(result.total_pages)
        setCurrentPage(page)
        setStatus("idle")
    })

    // Filter changes trigger fresh fetch — same pattern as useDataDisplay
    useEffect(() => {
        if (!initialized.current) return
        if (prevFilterKey.current === filterKey) return
        prevFilterKey.current = filterKey

        if (!hasActiveFilters(filters)) {
            // Restore initial server data when all filters cleared
            setItems(config.initialItems)
            setCount(config.initialCount)
            setHasNext(config.initialNext)
            setTotalPages(config.initialPages)
            setCurrentPage(1)
            pageRef.current = 1
            setStatus("idle")
            return
        }

        pageRef.current = 1
        fetchData.current(1, false)
    }, [filterKey])

    // INIT — must be last
    useEffect(() => {
        initialized.current = true
        return () => { initialized.current = false }
    }, [])

    const loadMore = useCallback(() => {
        if (!hasNext || status === "loadingMore" || isFetching.current) return
        const nextPage = pageRef.current + 1
        pageRef.current = nextPage
        fetchData.current(nextPage, true)
    }, [hasNext, status])

    const goToPage = useCallback((page: number) => {
        if (isFetching.current) return
        pageRef.current = page
        fetchData.current(page, false)
    }, [])

    return {
        items, count, totalPages, hasNext, currentPage,
        status,
        isLoading:     status === "loading",
        isLoadingMore: status === "loadingMore",
        isError:       status === "error",
        isEmpty:       status === "empty",
        loadMore,
        goToPage,
    }
}