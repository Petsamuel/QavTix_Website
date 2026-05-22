import { getFeaturedEvents, getNearbyEvents, getTopLocations } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import { getProfile } from "@/actions/profile"
import HomepagePageCW from "@/components/page-content-wrappers/HomepageCw";
import { buildPageMetadata } from "@/metadata"
import { Metadata } from "next";
import HeroSection from "@/components/homepage/HeroSection";
import EventCategorySection from "@/components/shared/EventCategorySection";
import { getUserLocation } from "@/actions/getters/client";

export const metadata: Metadata = buildPageMetadata(
  "Discover Events Near You",
  "Find and book tickets for concerts, festivals, sports, and business events near you. QavTix makes event discovery effortless.",
  "/",
)

export default async function Homepage() {

  const [profileRes, loc] = await Promise.all([
    getProfile(),
    getUserLocation()
  ])

  let city = loc.city
  let country = loc.country

  if (profileRes.success && profileRes.data) {
    if (profileRes.data.state || profileRes.data.city) city = profileRes.data.state || profileRes.data.city || city
    if (profileRes.data.country) country = profileRes.data.country || country
  }

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
      <HomepagePageCW
        featuredEvents={featuredEvents}
        nearbyEvents={nearbyEvents}
        topLocations={topLocations}
      />
    </main>
  )
}