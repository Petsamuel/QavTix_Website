import { getFeaturedEvents, getNearbyEvents, getTopLocations, getUserLocation } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import HomepagePageCW from "@/components/page-content-wrappers/HomepageCw";
import { buildPageMetadata } from "@/metadata"
import { Metadata } from "next";
import HeroSection from "@/components/homepage/HeroSection";
import { Suspense } from "react";
import EventCategorySection from "@/components/shared/EventCategorySection";
import EventCardLoaderContainer from "@/components/loaders/EventCardLoader";


export const metadata: Metadata = buildPageMetadata(
  "Discover Events Near You",
  "Find and book tickets for concerts, festivals, sports, and business events near you. QavTix makes event discovery effortless.",
  "/",
)

export default async function Homepage() {

  const { city, country } = await getUserLocation()

  const [featuredEvents, nearbyEvents, topLocations, categoriesResult] = await Promise.all([
    getFeaturedEvents(country),
    getNearbyEvents(city, country),
    getTopLocations(),
    getCategories(),
  ])

  return (
    <main>
      <HeroSection categories={categoriesResult.data} />
      <EventCategorySection />
      <Suspense fallback={
        <div className="my-8 global-px">
          <EventCardLoaderContainer />
        </div>
      }>
        <HomepagePageCW
          featuredEvents={featuredEvents}
          nearbyEvents={nearbyEvents}
          topLocations={topLocations}
        />
      </Suspense>
    </main>
  )
}