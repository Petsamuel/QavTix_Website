// Add fields here as the card grows. Never put raw API models in the card.
import { toTitleCase } from '@/helper-fns/stringFormaters'

export interface EventCardProps {
    id: string
    title: string
    category: string
    host: string
    date: string          // pre-formatted display string
    location: string          // pre-formatted display string
    locationType?: string     // "physical" | "online" | "tba"
    image: string
    price: string | null
    originalPrice: string | null
    status: string | null   // displayed as a badge
    attendees?: number
    isFavourite?: boolean
    is_mine?: boolean
    isFeatured?: boolean
    currency?: string          // ISO code e.g. "NGN", "USD", "GBP"
}

export interface EventCardAttendee {
    id: string | number
    full_name: string
    profile_picture: string | null
}


export function formatLocation(loc: EventLocation): string {
    const parts = [loc.venue_name, loc.city, loc.state].filter(Boolean)
    return parts.join(', ')
}


export function fromPublicPagesEvent(e: PublicPagesEvent): EventCardProps {
    const price = e.price != null ? String(e.price) : null
    const locType = (e as any).location_type as string | undefined

    return {
        id: e.id,
        title: toTitleCase(e.event_name),
        category: e.category,
        host: toTitleCase(e.host),
        date: e.event_datetime,
        location: formatLocation(e.event_location),
        locationType: locType,
        image: e.event_image,
        price,
        originalPrice: null,
        status: e.event_status,
        attendees: e.attendees_count,
        currency: e.currency ?? undefined,
        isFavourite: e.is_favorite,
        is_mine: e.is_mine,
        isFeatured: (e as any).is_featured
    }
}

export function fromIEvent(e: IEvent & {
    resolvedCategory?: string
    resolvedLocation?: string
    resolvedPrice?: string
    resolvedOriginalPrice?: string
    attendees?: number
}): EventCardProps {
    return {
        id: e.id,
        title: toTitleCase(e.title ?? ''),
        category: e.resolvedCategory ?? '',
        host: toTitleCase(e.organizer_display_name),
        date: e.start_datetime,
        location: e.resolvedLocation ?? '',
        locationType: e.location_type,
        image: '',
        price: e.resolvedPrice ?? null,
        originalPrice: e.resolvedOriginalPrice ?? null,
        status: e.status ?? null,
        attendees: e.attendees,
        isFavourite: false,
        isFeatured: (e as any).is_featured,
        currency: e.currency ?? undefined,
    }
}