"use client"

import { useCallback, useEffect, useState } from "react"

export interface RecentSearchEntry {
    id: string
    query: string
    location?: {
        countryCode:  string
        countryLabel: string
        stateCode?:   string
        stateLabel?:  string
    } | null
    categories: {
        id:   number | string
        name: string
    }[]
    priceRange?: {
        min: number
        max: number
    } | null
    searchedAt: string // ISO string
}


const STORAGE_KEY   = "recent_event_searches"
const MAX_ENTRIES   = 8
const TTL_MONTHS    = 3


function isExpired(entry: RecentSearchEntry): boolean {
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - TTL_MONTHS)
    return new Date(entry.searchedAt) < cutoff
}

function isDuplicate(entry: RecentSearchEntry, existing: RecentSearchEntry[]): boolean {
    return existing.some(e =>
        e.query                           === entry.query &&
        e.location?.countryCode           === entry.location?.countryCode &&
        e.location?.stateCode             === entry.location?.stateCode &&
        JSON.stringify(e.categories.map(c => c.id).sort()) ===
        JSON.stringify(entry.categories.map(c => c.id).sort())
    )
}

function readFromStorage(): RecentSearchEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed: RecentSearchEntry[] = JSON.parse(raw)
        // Prune expired entries on every read
        return parsed.filter(e => !isExpired(e))
    } catch {
        return []
    }
}

function writeToStorage(entries: RecentSearchEntry[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
        // localStorage unavailable (SSR guard, private browsing quota, etc.)
    }
}



export function useRecentSearches() {
    const [searches, setSearches] = useState<RecentSearchEntry[]>([])

    // Hydrate from localStorage on mount (client only)
    useEffect(() => {
        setSearches(readFromStorage())
    }, [])

    /**
     * Push a new search. Deduplicates by (query + location + categories).
     * If a duplicate exists, it is removed and the fresh entry is prepended
     * so it surfaces at the top.
     */
    const push = useCallback((entry: Omit<RecentSearchEntry, "id" | "searchedAt">) => {
        setSearches(prev => {
            const newEntry: RecentSearchEntry = {
                ...entry,
                id:         crypto.randomUUID(),
                searchedAt: new Date().toISOString(),
            }

            // Remove exact duplicate (same query + location + categories)
            const deduped = prev.filter(e => !isDuplicate(newEntry, [e]))

            // Prepend and cap at MAX_ENTRIES
            const updated = [newEntry, ...deduped].slice(0, MAX_ENTRIES)

            writeToStorage(updated)
            return updated
        })
    }, [])

    const clear = useCallback(() => {
        writeToStorage([])
        setSearches([])
    }, [])

    const remove = useCallback((id: string) => {
        setSearches(prev => {
            const updated = prev.filter(e => e.id !== id)
            writeToStorage(updated)
            return updated
        })
    }, [])

    return { searches, push, clear, remove }
}