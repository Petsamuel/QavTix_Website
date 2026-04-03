import { notFound } from "next/navigation"
import { EVENT_CATEGORIES_ARRAY } from "@/components-data/event-category"
import { getCategoryPage } from "@/actions/filters"
import EventSectionHero from "@/components/events-page/EventSectionHero"
import EventsNearYouSection from "@/components/shared/EventsNearYou"
import { getNearbyEvents, getUserLocation } from "@/actions/getters"

interface Props {
    params: Promise<{ category_name: string }>
}

export default async function EventCategoryPage({ params }: Props) {
    const { category_name: categoryPath } = await params

    // Unknown path — 404 (this is still correct, bad URL = 404)
    const categoryEntry = EVENT_CATEGORIES_ARRAY.find(c => c.path === categoryPath)
    if (!categoryEntry) notFound()

    const result = await getCategoryPage(categoryPath)

    const { city, country } = await getUserLocation()
    const nearbyEvents = await getNearbyEvents(city, country)

    const data = result.data ?? {
        name:              categoryEntry.label,
        description:       "",
        total_events:      0,
        total_subscribers: 0,
        events:            [],
    }

    const { description, total_events, total_subscribers } = data

    return (
        <main className="pt-24 md:pt-40">
            <EventSectionHero
                heading={categoryEntry.label}
                imageSrc="/images/demo-images/unsplash_E2vA_AMubQ0.png"
                description={description || `Discover the best ${categoryEntry.label.toLowerCase()} events happening near you and around the world.`}
                stats={[
                    { label: "Events",      value: total_events      },
                    { label: "Subscribers", value: total_subscribers },
                ]}
            />

            {
                !result.data&&
                <div className="mt-16">
                    <EventsNearYouSection events={nearbyEvents} />
                </div>
            }
        </main>
    )
}