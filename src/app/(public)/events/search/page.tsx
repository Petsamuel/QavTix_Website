import { searchEvents } from "@/actions/filters"
import { getCategories } from "@/actions/filters"
import BasedOnRecentSearchSection from "@/components/events-page/BasedOnRecentSearchSection"
import { SearchResultSection } from "@/components/events-page/SearchResultSection"
import SectionHeading from "@/components/shared/SectionHeading"

interface Props {
    searchParams: Promise<{ q?: string; category?: string; country?: string; state?: string; min_price?: string; max_price?: string }>
}

export default async function ExploreEventPage({ searchParams }: Props) {

    const params = await searchParams

    const query = params.q ?? ""

    // Build initial filters from URL params
    const initialFilters: Partial<FilterValues> = {
        categories: params.category ? [params.category] : [],
        location:   params.country  ? { country: params.country, state: params.state || "" } : undefined,
        priceRange: params.min_price || params.max_price
            ? { min: Number(params.min_price ?? 0), max: Number(params.max_price ?? 0) }
            : null,
    }

    const [searchResult, categoriesResult] = await Promise.all([
        searchEvents(query, 12),
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