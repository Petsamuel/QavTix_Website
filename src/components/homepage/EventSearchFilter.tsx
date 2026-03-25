'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateRange } from 'react-day-picker'
import { Country, State } from 'country-state-city'
import LocationFilterDropdown from './dropdowns/LocationFilter'
import DateFilter from './dropdowns/DateFilter'
import CategoryFilter from './dropdowns/CategoryFilter'
import PriceFilter from './dropdowns/PriceFilter'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function EventSearchFilters({
    initialFilters,
}: {
    initialFilters?: Partial<FilterValues>
}) {
    const router = useRouter()
    const currentParams = useSearchParams()

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
            params.set('date_from', filters.dateRange.from.toISOString())
            if (filters.dateRange.to) params.set('date_to', filters.dateRange.to.toISOString())
        }

        router.push(`/explore?${params.toString()}`)
    }

    const countries = Country.getAllCountries().map(c => ({
        value: c.isoCode,
        label: c.name,
    }))

    const getStates = (countryCode: string) =>
        State.getStatesOfCountry(countryCode).map(s => ({
            value: s.isoCode,
            label: s.name,
        }))

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
                            countries={countries}
                            getStates={getStates}
                        />
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <CategoryFilter
                            value={filters.categories}
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
                    className="w-40 bg-primary hover:bg-primary-7 h-14 md:h-[9vh] mt-5 md:mt-[4vh] px-8 rounded-full"
                >
                    <Search className="mr-2 size-6" />
                    Search event
                </Button>
            </div>
        </div>
    )
}