import { Suspense } from "react"
import BasedOnRecentSearchSection from "@/components/events-page/BasedOnRecentSearchSection"
import SectionHeading from "@/components/shared/SectionHeading"
import SearchResultFetcher from "@/components/page-content-wrappers/SearchResultFetcherCW"
import EventCardLoaderContainer from "@/components/loaders/EventCardLoader"

interface Props {
    searchParams: Promise<{
        q?: string
        category?: string
        country?: string
        state?: string
        min_price?: string
        max_price?: string
        start_date?: string
        end_date?: string
    }>
}

export default function ExploreEventPage({ searchParams }: Props) {
    const coords = searchParams.then(sp => sp)

    return (
        <main>
            <SectionHeading title="Events" />
            <Suspense fallback={<EventCardLoaderContainer />}>
                <SearchResultFetcher searchParams={coords} />
            </Suspense>
            <Suspense fallback={null}>
                <BasedOnRecentSearchSection />
            </Suspense>
        </main>
    )
}