import { getLocationPage } from "@/actions/getters"
import EventSectionHero from "@/components/events-page/EventSectionHero"
import { getCityStaticData } from "@/components-data/cities"

interface Props {
    params: Promise<{ location: string }>
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