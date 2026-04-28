import EventsPageCW from "@/components/page-content-wrappers/EventPageCW"
import { getFeaturedEvents, getTopLocations, getNearbyEvents, getTrendingEvents, getUserLocation } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { getTrendingHosts } from "@/actions/host"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"
import { Suspense } from "react"
import EventPageLoader from "@/components/loaders/EventPagesLoader"


export const metadata: Metadata = buildPageMetadata(
    "Browse Events",
    "Explore hundreds of upcoming events — music, sports, travel, nightlife, and more. Find something you love on QavTix.",
    "/events",
)

// app/events/page.tsx
export default async function EventsPage() {
    const [featuredEvents, trendingEvents, topLocations, categoriesResult, hostsResult] =
        await Promise.all([
            getFeaturedEvents(),
            getTrendingEvents(),
            getTopLocations(),
            getCategories(),
            getTrendingHosts(),
        ])

    return (
        <main>
            <Suspense fallback={<EventPageLoader />}>
                <DynamicEventsSection
                    featuredEvents={featuredEvents}
                    trendingEvents={trendingEvents}
                    topLocations={topLocations}
                    categories={categoriesResult.data}
                    hosts={hostsResult.data ?? []}
                />
            </Suspense>
        </main>
    )
}

async function DynamicEventsSection({ featuredEvents, trendingEvents, topLocations, categories, hosts }: any) {
    const { city, country } = await getUserLocation()

    const nearbyEvents = await getNearbyEvents(city, country)

    return (
        <EventsPageCW
            featuredEvents={featuredEvents}
            trendingEvents={trendingEvents}
            nearbyEvents={nearbyEvents}
            topLocations={topLocations}
            categories={categories}
            hosts={hosts}
            userCity={city}
        />
    )
}