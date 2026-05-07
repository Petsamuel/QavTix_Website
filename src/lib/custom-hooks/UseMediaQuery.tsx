import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const media = window.matchMedia(query)
        setMatches(media.matches)

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)
    }, [query])

    // Always return false on the server and the very first client render to ensure hydration match.
    // After mount, return the actual media query result.
    return mounted ? matches : false
}