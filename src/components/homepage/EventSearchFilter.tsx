'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateRange } from 'react-day-picker'
import { Country, State } from 'country-state-city'
import LocationFilterDropdown from './dropdowns/LocationFilter'
import DateFilter from './dropdowns/DateFilter'
import CategoryFilter from './dropdowns/CategoryFilter'
import PriceFilter from './dropdowns/PriceFilter'
import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApiCategory } from '@/actions/filters'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import { useRecentSearches } from '@/lib/custom-hooks/UseRecentSearch'
import { deriveCategories } from '@/helper-fns/deriveCategories'

interface Props {
    initialFilters?: Partial<FilterValues>
    categories?: ApiCategory[]
}

export function EventSearchFilters({ initialFilters, categories = [] }: Props) {
    
    const router        = useRouter()
    const currentParams = useSearchParams()
    const { push }      = useRecentSearches()

    const [filters, setFilters] = useState<FilterValues>({
        categories: initialFilters?.categories ?? [],
        priceRange: initialFilters?.priceRange ?? null,
        dateRange:  initialFilters?.dateRange  ?? null,
        location:   initialFilters?.location   ?? null,
    })

    const handleSearch = () => {
        const params = new URLSearchParams()

        const q = currentParams.get('q')
        if (q) params.set('q', q)

        if (filters.categories.length) {
            filters.categories.forEach(cat => params.append('category', String(cat)))
        }

        if (filters.location?.country) {
            params.set('country', filters.location.country)
            if (filters.location.state) params.set('state', filters.location.state)
        }

        if (filters.priceRange) {
            if (filters.priceRange.min != null) params.set('min_price', String(filters.priceRange.min))
            if (filters.priceRange.max != null) params.set('max_price', String(filters.priceRange.max))
        }

        if (filters.dateRange?.from) {
            params.set('start_date', filters.dateRange.from.toISOString())
            if (filters.dateRange.to) params.set('end_date', filters.dateRange.to.toISOString())
        }

        const hasFilters =
            filters.categories.length > 0 ||
            filters.location?.country ||
            filters.priceRange ||
            filters.dateRange?.from ||
            q

        if (hasFilters) {
            let locationEntry: Parameters<typeof push>[0]['location'] = null

            if (filters.location?.country) {
                const countryCode  = filters.location.country
                const countryMatch = Country.getCountryByCode(countryCode.toUpperCase())

                let stateLabel: string | undefined
                if (filters.location.state) {
                    const stateCode  = filters.location.state
                    const stateMatch = State.getStatesOfCountry(countryCode.toUpperCase())
                        .find(s => s.isoCode === stateCode.toUpperCase())
                    stateLabel = stateMatch?.name ?? stateCode
                }

                locationEntry = {
                    countryCode,
                    countryLabel: countryMatch?.name ?? countryCode,
                    stateCode:    filters.location.state || undefined,
                    stateLabel,
                }
            }

            // Map selected category IDs → { id, name } using the categories prop
            const selectedCategories = filters.categories.map(catId => {
                const match = categories.find(c => String(c.id) === String(catId))
                return { id: catId, name: match?.name ?? String(catId) }
            })

            push({
                query:      q ?? "",
                location:   locationEntry,
                categories: selectedCategories,
                priceRange: filters.priceRange ?? null,
            })
        }

        router.push(`${EVENT_ROUTES.SEARCH_EVENTS.href}?${params.toString()}`)
    }

    const allCountries = Country.getAllCountries().map(c => ({
        value: c.isoCode,
        label: c.name,
    }))

    const getStates = (countryCode: string) =>
        State.getStatesOfCountry(countryCode).map(s => ({
            value: s.isoCode,
            label: s.name,
        }))

    const availableCategories = useMemo(
        () => deriveCategories(categories, []),
        [categories]
    )

    return (
        <div className="w-full py-8 md:py-0 md:mt-[6vh]">
            <div>
                <div className="space-y-4">
                    {/* First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DateFilter
                            value={filters.dateRange}
                            onChange={(v) =>
                                setFilters({
                                    ...filters,
                                    dateRange: v || ({ from: new Date(), to: new Date() } as DateRange),
                                })
                            }
                        />
                        <LocationFilterDropdown
                            value={filters.location}
                            onChange={(location) => setFilters({ ...filters, location })}
                            countries={allCountries}
                            getStates={getStates}
                        />
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <CategoryFilter
                            value={filters.categories}
                            categories={availableCategories}
                            showCount={false}
                            onChange={(categories) => setFilters({ ...filters, categories })}
                        />
                        <PriceFilter
                            value={filters.priceRange}
                            onChange={(priceRange) => setFilters({ ...filters, priceRange })}
                        />
                    </div>
                </div>

                {/* Search Button */}
                <Button
                    onClick={handleSearch}
                    data-action="search-events"
                    className="w-40 bg-primary hover:bg-primary-7 h-14 md:h-[9vh] xl:h-14 mt-5 md:mt-[4vh] px-8 rounded-full"
                >
                    <Search className="mr-2 size-6" />
                    Search event
                </Button>
            </div>
        </div>
    )
}