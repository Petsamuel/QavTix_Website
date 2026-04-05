import { getLocationPage } from "@/actions/getters"
import EventSectionHero from "@/components/events-page/EventSectionHero"
import { getCityStaticData } from "@/components-data/cities"
import { Metadata } from "next"
import { buildPageMetadata } from "@/metadata"

interface Props {
    params: Promise<{ location: string }>
}

export async function generateMetadata(
    { params }: { params: Promise<{ location: string }> }
): Promise<Metadata> {
    const { location } = await params
    const city = decodeURIComponent(location).replace(/-/g, ' ')
 
    return buildPageMetadata(
        `Events in ${city}`,
        `Discover upcoming events happening in ${city}. Concerts, festivals, networking events and more — all on QavTix.`,
        `/events/explore/location/${location}`,
    )
}

export default async function EventLocationPage({ params }: Props) {

    const { location } = await params

    const result = await getLocationPage(location)

    const { image } = getCityStaticData(result.data?.city || location)

    return (
        <main className="pt-24 md:pt-40">
            <EventSectionHero
                heading={`Events Happening in ${result.data?.city || location}`}
                description={result.data?.description || ""}
                stats={[
                    { label: "Events",      value: result.data?.total_events || 0 },
                    { label: "Subscribers", value: result.data?.total_subscribers || 0 },
                ]}
                imageSrc={image || undefined}
                subscribeKey={result.data?.city || location}
            />
        </main>
    )
}