import { notFound } from "next/navigation"
import EventLocationDetailsSection from "@/components/events-page/EventLocationDetailsSection"
import EventsNearYouSection from "@/components/shared/EventsNearYou"
import { getLocationPage } from "@/actions/getters"

interface Props {
    params: Promise<{ location: string }>
}

export default async function EventLocationPage({ params }: Props) {

    const { location } = await params

    const result = await getLocationPage(location)

    if (!result.success || !result.data) notFound()

    const { city, description, total_events, total_subscribers, events } = result.data

    return (
        <main className="pt-24 md:pt-40">
            <EventLocationDetailsSection
                location={city}
                events={total_events}
                subscribers={total_subscribers}
                heading={`Events Happening in ${city}`}
                description={description}
            />

            <div className="mt-16">
                <EventsNearYouSection
                    events={events}
                    city={city}
                />
            </div>
        </main>
    )
}