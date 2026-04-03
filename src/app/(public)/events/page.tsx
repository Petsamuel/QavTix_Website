import { headers } from "next/headers"
import EventsPageCW from "@/components/page-content-wrappers/EventPageCW"
import { getFeaturedEvents, getTopLocations, getNearbyEvents, getTrendingEvents, getUserLocation } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { getTrendingHosts } from "@/actions/host"

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