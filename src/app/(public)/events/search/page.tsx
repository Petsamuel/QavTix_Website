import { searchEvents, SearchEventsFilters } from "@/actions/filters"
import { getCategories } from "@/actions/filters"
import BasedOnRecentSearchSection from "@/components/events-page/BasedOnRecentSearchSection"
import { SearchResultSection } from "@/components/events-page/SearchResultSection"
import SectionHeading from "@/components/shared/SectionHeading"
import { Country, State } from "country-state-city"

interface Props {
    searchParams: Promise<{
        q?:         string
        category?:  string
        country?:   string
        state?:     string
        min_price?: string
        max_price?: string
        date_from?: string
        date_to?:   string
    }>
}

/**
 * Resolves a country value to its full name.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
function resolveCountryLabel(value: string): string {
    if (value.length < 3) {
        const match = Country.getCountryByCode(value.toUpperCase())
        return match?.name ?? value
    }
    return value
}

/**
 * Resolves a state value to its full name within a given country.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
function resolveStateLabel(stateValue: string, countryCode: string): string {
    if (stateValue.length < 3) {
        const states = State.getStatesOfCountry(countryCode.toUpperCase())
        const match  = states.find(s => s.isoCode === stateValue.toUpperCase())
        return match?.name ?? stateValue
    }
    return stateValue
}

export default async function ExploreEventPage({ searchParams }: Props) {
    const params = await searchParams
    const query  = params.q ?? ""

    // Resolve country / state codes → labels for the search API
    const countryLabel = params.country ? resolveCountryLabel(params.country) : undefined
    const stateLabel   = params.state && params.country
        ? resolveStateLabel(params.state, params.country)
        : params.state

    // Reconstruct initialFilters using the raw params (codes are fine for the UI)
    const initialFilters: Partial<FilterValues> = {
        categories: params.category ? [params.category] : [],
        location:   params.country
            ? { country: params.country, state: params.state || "" }
            : undefined,
        priceRange: params.min_price || params.max_price
            ? { min: Number(params.min_price ?? 0), max: Number(params.max_price ?? 0) }
            : null,
        dateRange: params.date_from
            ? {
                from: new Date(params.date_from),
                to:   params.date_to ? new Date(params.date_to) : undefined,
              }
            : null,
    }

    const searchFilters: SearchEventsFilters = {}
    if (params.category)  searchFilters.categories = [Number(params.category)]
    if (countryLabel)     searchFilters.country    = countryLabel
    if (stateLabel)       searchFilters.state      = stateLabel
    if (params.min_price) searchFilters.min_price  = Number(params.min_price)
    if (params.max_price) searchFilters.max_price  = Number(params.max_price)

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