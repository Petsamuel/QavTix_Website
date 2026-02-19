"use client"
import TopHostsSection from "@/components/events-page/TopHostSection";
import { TrendingEvents } from "@/components/shared/TrendingEvents";
import TopDestinationTravelledSection from "@/components/homepage/TopDestinationTravelledSection";
import EventCategorySection2 from "@/components/shared/EventCategorySection2";
import EventsNearYouSection from "@/components/shared/EventsNearYou";
import FeaturedEventsSection from "@/components/shared/FeaturedEventsSection";
import SectionHeading from "@/components/shared/SectionHeading";
import WhereItsHappeningSection from "@/components/shared/WhereItsHappeningSection";
import { useEffect, useRef } from "react";

export default function EventsPageCW(){
    const featuredRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (featuredRef.current) {
                const yOffset = -15;
                const element = featuredRef.current;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                })
            }
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <main className="pb-14">
            <SectionHeading title="Events" />
            <div ref={featuredRef} className="md:mt-8">
                <FeaturedEventsSection />
            </div>
            <WhereItsHappeningSection />
            <EventsNearYouSection />
            <EventCategorySection2 />
            <div className="mt-12">
                <TrendingEvents />
            </div>
            <TopDestinationTravelledSection />
            <TopHostsSection />
        </main>
    )
}