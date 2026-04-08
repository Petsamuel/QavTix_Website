"use client"

import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection"
import WhereItsHappeningSection from "@/components/shared/WhereItsHappeningSection"
import EventsNearYouSection from "@/components/shared/EventsNearYou"
import TopDestinationTravelledSection from "@/components/homepage/TopDestinationTravelledSection"
import PlanningAnEventSection from "@/components/homepage/PlanningAnEventSection"
import SellTicketsSection from "@/components/homepage/SellTicketsSection"

interface Props {
    featuredEvents: PublicPagesEvent[]
    nearbyEvents:   PublicPagesEvent[]
    topLocations:   TopLocation[]
}

export default function HomepagePageCW({
    featuredEvents,
    nearbyEvents,
    topLocations
}: Props) {
    return (
        <>
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
        </>
    )
}