'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { space_grotesk } from '@/lib/fonts'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import TopHostCard from '../custom-utils/cards/TopHostCard'
import { TrendingHost } from '@/actions/hosts'

interface Props {
    hosts: TrendingHost[]
}

export default function TopHostsSection({ hosts }: Props) {

    const displayHosts = [...hosts, ...hosts, ...hosts].map((h, i) => ({
        ...h,
        _key: `${h.id}-${i}`,
    }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', skipSnaps: false, dragFree: false },
        [Autoplay({ delay: 2000, stopOnInteraction: true })]
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
        <section className="w-full pt-16 md:pt-10 pb-24 px-4 md:ps-10 lg:ps-16 md:pe-0">
            <div>
                <div className="flex items-center gap-6 justify-between md:pe-16">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Top Hosts
                    </h2>
                    <CarouselActionBtns
                        scrollPrev={scrollPrev}
                        scrollNext={scrollNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                </div>

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
            </div>
        </section>
    )
}