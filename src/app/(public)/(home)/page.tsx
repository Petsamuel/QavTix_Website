import { getFeaturedEvents, getNearbyEvents, getTopLocations, getUserLocation } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import HomepagePageCW from "@/components/page-content-wrappers/HomepageCw";
import { buildPageMetadata } from "@/metadata"
import { Metadata } from "next";


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
    <HomepagePageCW
      featuredEvents={featuredEvents}
      nearbyEvents={nearbyEvents}
      topLocations={topLocations}
      categories={categoriesResult.data}
    />
  )
}