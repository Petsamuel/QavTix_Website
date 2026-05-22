import { notFound } from "next/navigation"
import { EVENT_CATEGORIES_ARRAY } from "@/components-data/event-category"
import { getCategoryPage, getCategories } from "@/actions/filters"
import EventSectionHero from "@/components/events-page/EventSectionHero"
import EventsNearYouSection from "@/components/shared/EventsNearYou"
import { getNearbyEvents } from "@/actions/getters"
import { getUserLocation } from "@/actions/getters/client"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"

interface Props {
    params: Promise<{ category_name: string }>
}

export async function generateMetadata(
    { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
    const { category } = await params
    const entry = EVENT_CATEGORIES_ARRAY.find(c => c.path === category)
 
    if (!entry) return buildPageMetadata("Events", undefined, `/events/explore/category/${category}`)
 
    return buildPageMetadata(
        `${entry.label} Events`,
        `Discover the best ${entry.label.toLowerCase()} events near you and around the world. Buy tickets on QavTix.`,
        `/events/explore/category/${category}`,
    )
}

export default async function EventCategoryPage({ params }: Props) {
    const { category_name: categoryPath } = await params

    // Unknown path — 404 (this is still correct, bad URL = 404)
    const categoryEntry = EVENT_CATEGORIES_ARRAY.find(c => c.path === categoryPath)
    if (!categoryEntry) notFound()

    const [result, categoriesResult] = await Promise.all([
        getCategoryPage(categoryPath),
        getCategories(),
    ])

    const apiCategory = categoriesResult.data.find(
        c => c.slug === categoryPath || 
             c.slug === categoryEntry.value || 
             c.name.toLowerCase() === categoryEntry.label.toLowerCase()
    )
    const categoryId = apiCategory?.id

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
                subscribeKey={categoryId ?? categoryPath}
                subscribeType="category"
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