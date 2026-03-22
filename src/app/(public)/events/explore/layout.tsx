import TopHostsSection from "@/components/events-page/TopHostSection"
import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection"
import { TrendingEvents } from "@/components/shared/TrendingEvents"
import { getFeaturedEvents, getTrendingEvents } from "@/actions/getters"
import { getTrendingHosts } from "@/actions/host"
import { ReactNode } from "react"
import { getCategories } from "@/actions/filters"

export default async function EventExploreLayout({ children }: { children: ReactNode }) {

    const [featuredEvents, trendingEvents, categoriesResult, hostsResult] = await Promise.all([
        getFeaturedEvents(),
        getTrendingEvents(),
        getCategories(),
        getTrendingHosts(),
    ])

    return (
        <>
            {children}
            <div className="mt-10 md:mt-16">
                <FeaturedEventsSection events={featuredEvents} />
            </div>
            <TrendingEvents className="" initialEvents={trendingEvents} categories={categoriesResult.data} />
            <TopHostsSection hosts={hostsResult.data ?? []} />
        </>
    )
}