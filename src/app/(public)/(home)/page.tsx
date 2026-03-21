import { headers } from "next/headers"
import { getFeaturedEvents, getNearbyEvents, getTopLocations } from "@/actions/getters"
import { getCategories } from "@/actions/filters"
import HomepagePageCW from "@/components/page-content-wrappers/HomepageCw";


async function getUserLocation(): Promise<{ city: string; country: string }> {
  const headersList = await headers()
  const city    = headersList.get("x-vercel-ip-city")    ?? "Lagos"
  const country = headersList.get("x-vercel-ip-country") ?? "NG"
  return { city: decodeURIComponent(city), country }
}

export default async function Homepage() {

  const { city } = await getUserLocation()

  const [featuredEvents, nearbyEvents, topLocations, categoriesResult] = await Promise.all([
    getFeaturedEvents(),
    getNearbyEvents(city),
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