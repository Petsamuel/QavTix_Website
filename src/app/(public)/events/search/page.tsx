import { Suspense } from "react"
import BasedOnRecentSearchSection from "@/components/events-page/BasedOnRecentSearchSection"
import EventPageLoader from "@/components/loaders/EventPagesLoader"
import SectionHeading from "@/components/shared/SectionHeading"
import SearchResultFetcher from "@/components/page-content-wrappers/SearchResultFetcherCW"

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
            <Suspense fallback={<EventPageLoader />}>
                <SearchResultFetcher searchParams={coords} />
            </Suspense>
            <Suspense fallback={null}>
                <BasedOnRecentSearchSection />
            </Suspense>
        </main>
    )
}