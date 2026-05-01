import { getEventDetails }  from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { searchEvents } from "@/actions/filters/client"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"
import EventNotFound from "@/components/events-page/EventNotFound"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"

interface Props {
    params: Promise<{ event_id: string }>
}


export async function generateMetadata(
    { params }: { params: Promise<{ event_id: string }> }
): Promise<Metadata> {
    const { event_id } = await params
    const result       = await getEventDetails(event_id)
 
    if (!result.success || !result.data) {
        return buildPageMetadata("Event Not Found", undefined, `/events/details/${event_id}`)
    }
 
    const { title, short_description, full_description, event_location } = result.data
    const desc = short_description || full_description.slice(0, 155)
 
    return buildPageMetadata(
        title,
        desc,
        `/events/details/${event_id}`,
    )
}

export default async function EventDetailPage({ params }: Props) {
    const { event_id } = await params

    const result = await getEventDetails(event_id)

    if (!result.success || !result.data) {
        return <EventNotFound />
    }

    const event    = result.data
    const category = event.category ?? null

    const categories        = await getCategories()
    const foundCategoryID   = categories.data.find(
        v => v.name.toLowerCase() === category?.toLowerCase()
    )?.id

    const relatedEventsResult = await searchEvents(
        "",
        8,
        foundCategoryID ? { categories: [foundCategoryID] } : {},
    )

    return (
        <EventDetailsPageContentContainer
            event={event}
            relatedEvents={relatedEventsResult.data?.filter(v => v.id !== event.id) ?? []}
        />
    )
}