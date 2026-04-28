"use client"

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { space_grotesk } from '@/lib/fonts'
import { Icon } from '@iconify/react'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import { getCityStaticData, FALLBACK_DESTINATIONS } from '@/components-data/cities'


interface Props {
    locations: TopLocation[]
}

const MIN_LOCATIONS = 5

export default function TopDestinationTravelledSection({ locations }: Props) {

    // Pad with fallback destinations if API returns fewer than MIN_LOCATIONS
    const paddedLocations = locations.length >= MIN_LOCATIONS
        ? locations
        : [
            ...locations,
            ...FALLBACK_DESTINATIONS.filter(
                fb => !locations.some(loc => loc.city.toLowerCase() === fb.city.toLowerCase())
            ).slice(0, MIN_LOCATIONS - locations.length),
        ]

    // Merge live data with curated images + descriptions
    const enriched = paddedLocations.map(loc => ({
        ...loc,
        ...getCityStaticData(loc.city, loc.state),
    }))

    const displayLocations = [...enriched, ...enriched].map((loc, i) => ({
        ...loc,
        _key: `${loc.city}-${i}`,
    }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', skipSnaps: false, dragFree: false },
        [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
    )

    const autoplay = emblaApi?.plugins()?.autoplay

    const scrollPrev = useCallback(() => { autoplay?.stop(); emblaApi?.scrollPrev() }, [emblaApi, autoplay])
    const scrollNext = useCallback(() => { autoplay?.stop(); emblaApi?.scrollNext() }, [emblaApi, autoplay])

    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setCanScrollPrev(emblaApi.canScrollPrev())
        setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
        return () => { emblaApi.off('select', onSelect); emblaApi.off('reInit', onSelect) }
    }, [emblaApi, onSelect])

    return (
        <section className="w-full py-8 mt-8 bg-neutral-1 ps-4 sm:ps-10 lg:ps-14 xl:ps-20 lg:min-h-[25em] lg:h-[25em]">
            <div>
                <div className="flex pe-4 items-center gap-6 justify-between mb-8 md:pe-10">
                    <h2 className={`text-2xl md:text-3xl font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Top traveled destinations
                    </h2>
                    <CarouselActionBtns
                        scrollPrev={scrollPrev}
                        scrollNext={scrollNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6 px-3 py-1">
                        {displayLocations.map(loc => (
                            <Link
                                key={loc._key}
                                href={`/events/location/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}
                                className="relative flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_30%] xl:flex-[0_0_22%] min-w-0"
                                onMouseEnter={() => autoplay?.stop()}
                                onMouseLeave={() => autoplay?.play()}
                            >
                                <div className="group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 ease-cubic-bezier(0.4,0,0.2,1)">

                                    <div className="relative h-56 lg:h-64 group-hover:h-32 transition-all duration-500 ease-cubic-bezier(0.4,0,0.2,1) overflow-hidden rounded-3xl">
                                        {loc.image ? (
                                            <Image
                                                src={loc.image}
                                                alt={loc.city}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-linear-to-br from-primary-2 via-primary-3 to-slate-300" />
                                        )}

                                        <div className="absolute hidden lg:block inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ease-out group-hover:opacity-0">
                                            <h3 className={`absolute left-5 bottom-5 z-10 text-lg md:text-xl text-white font-medium drop-shadow-md transition-all duration-500 ease-out group-hover:translate-y-2 group-hover:opacity-0 ${space_grotesk.className}`}>
                                                {loc.city}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="bg-white h-auto lg:h-0 lg:opacity-0 overflow-hidden transition-all duration-500 ease-cubic-bezier(0.4,0,0.2,1) group-hover:h-auto group-hover:opacity-100">
                                        <div className="p-5 transform translate-y-0 opacity-100 lg:translate-y-4 lg:opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                                            <h3 className={`text-lg text-secondary-9 font-medium mb-2 ${space_grotesk.className}`}>
                                                {loc.city}
                                            </h3>
                                            <p className="text-sm leading-relaxed text-secondary-7 line-clamp-3">
                                                {loc.description}
                                            </p>
                                            <p className="text-xs text-neutral-6 mt-2 flex items-center gap-1">
                                                <Icon icon="hugeicons:location-01" className="size-3.5" />
                                                {loc.city}, {loc.country}
                                            </p>
                                            {loc.event_count > 0 && (
                                                <p className="text-xs text-neutral-5 mt-1">
                                                    {loc.event_count} event{loc.event_count !== 1 ? "s" : ""}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}