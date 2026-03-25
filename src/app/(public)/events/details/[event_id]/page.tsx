import { notFound }      from "next/navigation"
import { getEventDetails } from "@/actions/getters"
import { searchEvents }    from "@/actions/filters"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventDetailPage({ params }: Props) {
    const { event_id } = await params

    const result = await getEventDetails(event_id)
    if (!result.success || !result.data) notFound()

    const event = result.data

    const categoryId = event.category ?? null

    const relatedEventsResult = await searchEvents(
        "",
        8,
        categoryId ? { categories: [categoryId] } : {},
    )

    return (
        <EventDetailsPageContentContainer
            event={event}
            relatedEvents={relatedEventsResult.data ?? []}
        />
    )
}