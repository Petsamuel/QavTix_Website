'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { space_grotesk } from '@/lib/fonts'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import TopHostCard from '../custom-utils/cards/TopHostCard'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'

interface Props {
    hosts: TrendingHost[]
}

// Minimum cards needed for a seamless Embla loop at desktop (5 visible slots × 2)
const MIN_FOR_LOOP = 10

export default function TopHostsSection({ hosts }: Props) {

    const isMobile = !useMediaQuery('(min-width: 768px)')

    // Only loop/autoplay on mobile OR when there are enough cards to loop without glitching
    const shouldCarousel = isMobile || hosts.length >= MIN_FOR_LOOP

    // Duplicate enough times to fill the loop buffer — only when using carousel
    const displayHosts = shouldCarousel
        ? Array.from(
            { length: Math.ceil(MIN_FOR_LOOP / hosts.length) + 1 },
            (_, i) => hosts.map((h, j) => ({ ...h, _key: `${h.id}-${i}-${j}` }))
          ).flat()
        : hosts.map((h, i) => ({ ...h, _key: `${h.id}-${i}` }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop:      shouldCarousel,
            align:     'start',
            skipSnaps: false,
            dragFree:  false,
            // Disable drag on desktop static grid
            watchDrag: shouldCarousel,
        },
        shouldCarousel
            ? [Autoplay({ delay: 2000, stopOnInteraction: true })]
            : []
    )

    const scrollPrev    = useCallback(() => { emblaApi?.plugins()?.autoplay?.stop(); emblaApi?.scrollPrev() }, [emblaApi])
    const scrollNext    = useCallback(() => { emblaApi?.plugins()?.autoplay?.stop(); emblaApi?.scrollNext() }, [emblaApi])
    const pauseAutoPlay = useCallback(() => emblaApi?.plugins()?.autoplay?.stop(), [emblaApi])
    const play          = useCallback(() => emblaApi?.plugins()?.autoplay?.play(),  [emblaApi])

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
    }, [emblaApi, onSelect])

    if (hosts.length === 0) return null

    return (
        <section className="w-full pt-16 md:pt-10 pb-16 px-4 md:ps-10 lg:ps-16 md:pe-0">
            <div>
                <div className="flex items-center gap-6 justify-between md:pe-16">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Top Hosts
                    </h2>
                    {shouldCarousel && (
                        <CarouselActionBtns
                            scrollPrev={scrollPrev}
                            scrollNext={scrollNext}
                            canScrollPrev={canScrollPrev}
                            canScrollNext={canScrollNext}
                        />
                    )}
                </div>

                {/* Static grid on desktop when cards are few */}
                {!shouldCarousel ? (
                    <div className="mt-12 flex flex-wrap gap-6 px-3">
                        {displayHosts.map(host => (
                            <TopHostCard
                                key={host._key}
                                host={host}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden mt-12 py-4" ref={emblaRef}>
                        <div className="flex gap-6 px-3">
                            {displayHosts.map(host => (
                                <TopHostCard
                                    key={host._key}
                                    host={host}
                                    onMouseOver={pauseAutoPlay}
                                    onMouseLeave={play}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}