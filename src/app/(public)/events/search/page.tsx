import { searchEvents, SearchEventsFilters } from "@/actions/filters"
import { getCategories } from "@/actions/filters"
import BasedOnRecentSearchSection from "@/components/events-page/BasedOnRecentSearchSection"
import { SearchResultSection } from "@/components/events-page/SearchResultSection"
import SectionHeading from "@/components/shared/SectionHeading"
import { resolveCountryLabel, resolveStateLabel } from "@/helper-fns/resolveCountryCode"

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

export default async function ExploreEventPage({ searchParams }: Props) {
    const params = await searchParams
    const query = params.q ?? ""

    const countryLabel = params.country ? resolveCountryLabel(params.country) : undefined
    const stateLabel = params.state && params.country
        ? resolveStateLabel(params.state, params.country)
        : params.state

    const initialFilters: Partial<FilterValues> = {
        categories: params.category ? [params.category] : [],
        location: params.country
            ? { country: params.country, state: params.state || "" }
            : undefined,
        priceRange: params.min_price != null || params.max_price != null
            ? { min: Number(params.min_price ?? 0), max: Number(params.max_price ?? 0) }
            : null,
        dateRange: params.start_date
            ? {
                from: new Date(params.start_date),
                to: params.end_date ? new Date(params.end_date) : undefined,
            }
            : null,
    }

    const searchFilters: SearchEventsFilters = {}
    if (params.category) searchFilters.categories = [Number(params.category)]
    if (countryLabel) searchFilters.country = countryLabel
    if (stateLabel) searchFilters.state = stateLabel
    if (params.min_price != null) searchFilters.min_price = Number(params.min_price)
    if (params.max_price != null) searchFilters.max_price = Number(params.max_price)
    if (params.start_date) searchFilters.start_date = params.start_date
    if (params.end_date) searchFilters.end_date = params.end_date

    const [searchResult, categoriesResult] = await Promise.all([
        searchEvents(query, 12, searchFilters),
        getCategories(),
    ])

    return (
        <main>
            <SectionHeading title="Events" />
            <SearchResultSection
                query={query}
                initialEvents={searchResult.data ?? []}
                initialCount={searchResult.total ?? 0}
                initialFilters={initialFilters}
                categories={categoriesResult.data}
            />
            <BasedOnRecentSearchSection />
        </main>
    )
}