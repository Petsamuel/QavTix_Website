"use client"

import CategoryFilter from "@/components/homepage/dropdowns/CategoryFilter";
import DateFilter from "@/components/homepage/dropdowns/DateFilter";
import LocationFilter from "@/components/homepage/dropdowns/LocationFilter";
import PriceFilter from "@/components/homepage/dropdowns/PriceFilter";
import { Icon } from "@iconify/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { countries, getStates } from "@/components-data/location"

export default function SearchPage(){

    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState<string>(searchParams.get("q") || "")
    const router = useRouter()

    return (
        <>
            <main className="bg-white min-h-screen pt-28 pb-10 global-px">
                <div className="relative group max-w-3xl mx-auto">
                    <Icon 
                        icon="hugeicons:search-01" 
                        className="absolute left-5 top-1/2 shrink-0 -translate-y-1/2 size-6 text-neutral-7 group-focus-within:text-primary transition-colors duration-200" 
                    />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search events, categories, or organizers..."
                        autoFocus
                        className="
                            w-full h-16 pl-14 pr-14 
                            text-sm text-secondary-9 placeholder:text-neutral-6
                            bg-neutral-2 
                            border-[1.5px] border-neutral-5
                            rounded-xl
                            outline-none
                            transition-all duration-300 ease-out
                            hover:bg-neutral-2 hover:border-neutral-6
                            focus:border-primary-7 focus:shadow-lg focus:shadow-primary/10
                        "
                    />
                    <button onClick={() => router.back()}>
                        <Icon 
                            icon="material-symbols-light:cancel-outline-rounded" 
                            className="absolute right-5 top-1/2 -translate-y-1/2 size-7 text-neutral-7 group-focus-within:text-primary transition-colors duration-200" 
                        />
                    </button>
                </div>


                <div className='flex flex-wrap gap-4 mb-8 max-w-3xl mx-auto justify-center mt-5'>
                    <CategoryFilter
                        filterFor='eventPage'
                        value={[]}
                        onChange={(categories) => {}}
                    />
                    <LocationFilter
                        filterFor='eventPage'
                        value={null}
                        onChange={(location) => {}} 
                        countries={countries}
                        getStates={getStates}
                    />
                    <PriceFilter
                        filterFor='eventPage'
                        value={null}
                        onChange={(priceRange) => {}}
                    />
                    <DateFilter
                        filterFor='eventPage'
                        value={null}
                        onChange={(v) => {}}
                    />
                </div>
            </main>
        </>
    )
}