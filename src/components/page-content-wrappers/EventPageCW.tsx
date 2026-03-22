"use client"

import { useEffect, useRef } from "react"
import TopHostsSection from "@/components/events-page/TopHostSection"
import { TrendingEvents } from "@/components/shared/TrendingEvents"
import TopDestinationTravelledSection from "@/components/homepage/TopDestinationTravelledSection"
import EventCategorySection2 from "@/components/shared/EventCategorySection2"
import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection"
import SectionHeading from "@/components/shared/SectionHeading"
import WhereItsHappeningSection from "@/components/shared/WhereItsHappeningSection"
import { ApiCategory } from "@/actions/filters"
import EventsNearYouSection2 from "../shared/EventsNearYou2"


interface Props {
    featuredEvents: PublicPagesEvent[]
    trendingEvents: PublicPagesEvent[]
    nearbyEvents:   PublicPagesEvent[]
    topLocations:   TopLocation[]
    categories:     ApiCategory[]
    hosts:          TrendingHost[]
    userCity:       string
}

export default function EventsPageCW({
    featuredEvents,
    trendingEvents,
    nearbyEvents,
    topLocations,
    categories,
    hosts,
    userCity,
}: Props) {

    const featuredRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (featuredRef.current) {
                const y = featuredRef.current.getBoundingClientRect().top + window.pageYOffset - 15
                window.scrollTo({ top: y, behavior: 'smooth' })
            }
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="pb-14">
            <SectionHeading title="Events" />

            <div ref={featuredRef} className="md:mt-8">
                <FeaturedEventsSection events={featuredEvents} />
            </div>

            <WhereItsHappeningSection />

            <EventsNearYouSection2
                events={nearbyEvents}
                city={userCity}
            />

            <EventCategorySection2 />

            <div className="mt-12">
                <TrendingEvents
                    className=""
                    initialEvents={trendingEvents}
                    initialCount={trendingEvents.length}
                    categories={categories}
                />
            </div>

            <TopDestinationTravelledSection locations={topLocations} />

            <TopHostsSection hosts={hosts} />
        </main>
    )
}