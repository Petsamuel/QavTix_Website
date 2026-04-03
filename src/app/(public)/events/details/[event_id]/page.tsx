import { getEventDetails }  from "@/actions/getters"
import { getCategories, searchEvents } from "@/actions/filters"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"
import EventNotFound from "@/components/events-page/EventNotFound"

interface Props {
    params: Promise<{ event_id: string }>
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