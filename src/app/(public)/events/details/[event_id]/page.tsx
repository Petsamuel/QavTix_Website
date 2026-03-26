import { notFound }      from "next/navigation"
import { getEventDetails } from "@/actions/getters"
import { getCategories, searchEvents }    from "@/actions/filters"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventDetailPage({ params }: Props) {
    const { event_id } = await params

    const result = await getEventDetails(event_id)
    if (!result.success || !result.data) notFound()

    const event = result.data

    const category = event.category ?? null
    
    const categories = getCategories()
    const foundCategoryID = (await categories).data.find(v => v.name.toLowerCase() === category.toLowerCase())?.id;

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