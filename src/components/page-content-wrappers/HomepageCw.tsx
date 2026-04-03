"use client"

import HeroSection from "@/components/homepage/HeroSection"
import EventCategorySection from "@/components/shared/EventCategorySection"
import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection"
import WhereItsHappeningSection from "@/components/shared/WhereItsHappeningSection"
import EventsNearYouSection from "@/components/shared/EventsNearYou"
import TopDestinationTravelledSection from "@/components/homepage/TopDestinationTravelledSection"
import PlanningAnEventSection from "@/components/homepage/PlanningAnEventSection"
import SellTicketsSection from "@/components/homepage/SellTicketsSection"
import { ApiCategory } from "@/actions/filters"

interface Props {
    featuredEvents: PublicPagesEvent[]
    nearbyEvents:   PublicPagesEvent[]
    topLocations:   TopLocation[]
    categories:     ApiCategory[]
}

export default function HomepagePageCW({
    featuredEvents,
    nearbyEvents,
    topLocations,
    categories
}: Props) {
    return (
        <main>
            <HeroSection categories={categories} />
            <EventCategorySection />
            <div className="mt-10 md:mt-20">
                <FeaturedEventsSection events={featuredEvents} />
            </div>
            <WhereItsHappeningSection />
            <EventsNearYouSection
                events={nearbyEvents}
            />
            <TopDestinationTravelledSection locations={topLocations} />
            <PlanningAnEventSection />
            <SellTicketsSection />
        </main>
    )
}