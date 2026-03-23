import { notFound } from "next/navigation"
import { getEventDetails } from "@/actions/getters"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventDetailPage({ params }: Props) {
    const { event_id } = await params

    const result = await getEventDetails(event_id)

    if (!result.success || !result.data) notFound()

    return <EventDetailsPageContentContainer event={result.data} />
}