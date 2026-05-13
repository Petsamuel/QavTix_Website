import EventsPageCW from "@/components/page-content-wrappers/EventPageCW"
import { getFeaturedEvents, getTopLocations, getNearbyEvents, getTrendingEvents } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { getTrendingHosts } from "@/actions/host"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"
import { getUserLocation } from "@/actions/getters/client"

export const metadata: Metadata = buildPageMetadata(
    "Browse Events",
    "Explore hundreds of upcoming events — music, sports, travel, nightlife, and more. Find something you love on QavTix.",
    "/events",
)

export default async function EventsPage() {
    const { city, country } = await getUserLocation()

    const [
        featuredEvents,
        trendingEvents,
        nearbyEvents,
        topLocations,
        categoriesResult,
        hostsResult,
    ] = await Promise.all([
        getFeaturedEvents(country),
        getTrendingEvents(country),
        getNearbyEvents(city, country),
        getTopLocations(),
        getCategories(),
        getTrendingHosts(),
    ])

    return (
        <main>
            <EventsPageCW
                featuredEvents={featuredEvents}
                trendingEvents={trendingEvents}
                nearbyEvents={nearbyEvents}
                topLocations={topLocations}
                categories={categoriesResult.data}
                hosts={hostsResult.data ?? []}
                userCity={city}
            />
        </main>
    )
}