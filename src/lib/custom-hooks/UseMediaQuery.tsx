import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(() => {
        // During SSR `window` doesn't exist — default to false.
        // On the client this runs synchronously before the first paint,
        // so the initial render already reflects the real viewport and
        // there is no SSR/hydration mismatch.
        if (typeof window === 'undefined') return false
        return window.matchMedia(query).matches
    })

    useEffect(() => {
        const media = window.matchMedia(query)

        // Sync in case the query changed after mount
        setMatches(media.matches)

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)

        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)
    }, [query])

    return matches
}