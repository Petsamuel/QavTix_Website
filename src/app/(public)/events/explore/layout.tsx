import TopHostsSection from "@/components/events-page/TopHostSection"
import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection"
import { TrendingEvents } from "@/components/shared/TrendingEvents"
import { getFeaturedEvents, getTrendingEvents } from "@/actions/getters"
import { ReactNode } from "react"
import { getCategories } from "@/actions/filters"

export default async function EventExploreLayout({ children }: { children: ReactNode }) {

    const [featuredEvents, trendingEvents, categories] = await Promise.all([
        getFeaturedEvents(),
        getTrendingEvents(),
        getCategories()
    ])

    return (
        <>
            {children}
            <div className="mt-10 md:mt-16">
                <FeaturedEventsSection events={featuredEvents} />
            </div>
            <TrendingEvents className="" initialEvents={trendingEvents} categories={categories.data} />
            <TopHostsSection />
        </>
    )
}