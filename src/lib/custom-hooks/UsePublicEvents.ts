"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { resolveCountryLabel, resolveStateLabel } from "@/helper-fns/resolveCountryCode"

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
    endpoint:     string  // plain endpoint, NO query string — e.g. "public/search"
    query:        string  // text query kept separate so we can always append it cleanly
    initialItems: PublicPagesEvent[]
    initialCount: number
    initialPages: number
    initialNext:  boolean
}

// Builds query params from filter values.
// Resolves ISO codes → labels for country/state before sending to API.
const buildPublicFilterParams = (filters: Partial<FilterValues>): Record<string, string> => {
    const params: Record<string, string> = {}

    if (filters.dateRange?.from) params.start_date = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to)   params.end_date   = format(new Date(filters.dateRange.to),   'yyyy-MM-dd')

    // Only send min_price if greater than 0 — sending 0 may override API defaults
    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price = String(filters.priceRange.min)
    if (filters.priceRange?.max != null)                                params.max_price = String(filters.priceRange.max)

    if (filters.location?.country) {
        params.country = resolveCountryLabel(filters.location.country)
        if (filters.location.state) {
            params.state = resolveStateLabel(filters.location.state, filters.location.country)
        }
    }

    return params
}

const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from    ||
        filters.dateRange?.to      ||
        filters.priceRange?.min    ||
        filters.priceRange?.max    ||
        filters.location?.country
    )

async function fetchPublicEvents(
    endpoint:    string,
    query:       string,
    categories:  string[],
    filterParams: Record<string, string>,
    page:        number,
): Promise<{ results: PublicPagesEvent[]; count: number; next: boolean; total_pages: number } | null> {
    try {
        const base   = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
        const params = new URLSearchParams({ search: query, page: String(page), ...filterParams })
        categories.forEach(id => params.append("category", id))

        const fullUrl = `${base}/${endpoint}?${params}`
        console.log("[usePublicEvents] fetch:", fullUrl)

        const res  = await fetch(fullUrl)
        if (!res.ok) {
            console.log("[usePublicEvents] fetch failed:", res.status)
            return null
        }

        const json = await res.json()
        const data = json.data ?? json

        return {
            results:     data.results     ?? [],
            count:       data.count       ?? 0,
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

    const filtersRef   = useRef(filters)
    filtersRef.current = filters

    const isFetching  = useRef(false)
    const initialized = useRef(false)
    const pageRef     = useRef(1)

    const filterKey = [
        filters.categories?.join(',')       ?? '',
        filters.dateRange?.from?.toString() ?? '',
        filters.dateRange?.to?.toString()   ?? '',
        String(filters.priceRange?.min      ?? ''),
        String(filters.priceRange?.max      ?? ''),
        filters.location?.state             ?? '',
        filters.location?.country           ?? '',
    ].join('|')

    const prevFilterKey = useRef(filterKey)

    // fetchData reads from filtersRef so it always has current values
    const fetchData = useCallback(async (page: number, append: boolean) => {
        if (isFetching.current) return
        isFetching.current = true
        setStatus(append ? "loadingMore" : "loading")

        const currentFilters = filtersRef.current
        const categories     = (currentFilters.categories ?? []).map(String)
        const filterParams   = buildPublicFilterParams(currentFilters)

        const result = await fetchPublicEvents(
            config.endpoint,
            config.query,
            categories,
            filterParams,
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
    // config.endpoint and config.query are stable — passed from server component
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.endpoint, config.query])

    useEffect(() => {
        if (!initialized.current) return
        if (prevFilterKey.current === filterKey) return
        prevFilterKey.current = filterKey

        if (!hasActiveFilters(filters)) {
            // All filters cleared — restore server-rendered initial data
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
        fetchData(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKey])

    // Mark as initialized after first render
    useEffect(() => {
        initialized.current = true
        return () => { initialized.current = false }
    }, [])

    const loadMore = useCallback(() => {
        if (!hasNext || status === "loadingMore" || isFetching.current) return
        const nextPage = pageRef.current + 1
        pageRef.current = nextPage
        fetchData(nextPage, true)
    }, [hasNext, status, fetchData])

    const goToPage = useCallback((page: number) => {
        if (isFetching.current) return
        pageRef.current = page
        fetchData(page, false)
    }, [fetchData])

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