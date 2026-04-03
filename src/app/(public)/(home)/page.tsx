import { getFeaturedEvents, getNearbyEvents, getTopLocations, getUserLocation } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import HomepagePageCW from "@/components/page-content-wrappers/HomepageCw";

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