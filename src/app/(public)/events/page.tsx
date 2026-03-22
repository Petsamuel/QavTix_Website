import { headers } from "next/headers"
import EventsPageCW from "@/components/page-content-wrappers/EventPageCW"
import { getFeaturedEvents, getTopLocations, getNearbyEvents, getTrendingEvents } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { getTrendingHosts } from "@/actions/host"

async function getUserCity(): Promise<string> {
    const headersList = await headers()
    const city = headersList.get("x-vercel-ip-city") ?? "Lagos"
    return decodeURIComponent(city)
}

export default async function EventsPage() {

    const city = await getUserCity()

    const [
        featuredEvents,
        trendingEvents,
        nearbyEvents,
        topLocations,
        categoriesResult,
        hostsResult,
    ] = await Promise.all([
        getFeaturedEvents(),
        getTrendingEvents(),
        getNearbyEvents(city),
        getTopLocations(),
        getCategories(),
        getTrendingHosts(),
    ])

    return (
        <EventsPageCW
            featuredEvents={featuredEvents}
            trendingEvents={trendingEvents}
            nearbyEvents={nearbyEvents}
            topLocations={topLocations}
            categories={categoriesResult.data}
            hosts={hostsResult.data ?? []}
            userCity={city}
        />
    )
}