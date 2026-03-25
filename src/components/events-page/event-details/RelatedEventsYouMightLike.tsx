'use client'
import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { space_grotesk } from '@/lib/fonts'
import CarouselActionBtns from '@/components/custom-utils/buttons/CarouselActionBtns'
import EventsCard1 from '@/components/custom-utils/cards/EventCards'
import { fromPublicPagesEvent } from '@/components/custom-utils/cards/resources/event-card-adapter'

export default function RelatedEventsYouMightLike({ events }: { events: PublicPagesEvent[] }) {

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', dragFree: true },
        [Autoplay({ delay: 2000, stopOnInteraction: true })]
    )

    const getAutoplay = useCallback(() => {
        return emblaApi?.plugins()?.autoplay ?? null
    }, [emblaApi])

    const scrollPrev = useCallback(() => {
        getAutoplay()?.stop()
        emblaApi?.scrollPrev()
    }, [emblaApi, getAutoplay])

    const scrollNext = useCallback(() => {
        getAutoplay()?.stop()
        emblaApi?.scrollNext()
    }, [emblaApi, getAutoplay])

    const pauseAutoPlay = useCallback(() => {
        getAutoplay()?.stop()
    }, [getAutoplay])

    const play = useCallback(() => {
        const autoplay = getAutoplay()
        if (!autoplay) return
        // embla-carousel-autoplay v8+ exposes .play(), guard it exists
        if (typeof autoplay.play === 'function') {
            autoplay.play()
        }
    }, [getAutoplay])

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

    return (
         <section className="w-full py-10 overflow-x-hidden!">
            <div className="max-w-7xl mx-auto">
                <div className="flex gap-5 items-center justify-between mb-8 px-4 md:px-10 lg:px-16">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] mb-6 font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Related events you may like
                    </h2>
                    <CarouselActionBtns
                        scrollPrev={scrollPrev}
                        scrollNext={scrollNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                </div>

                <div>
                    <div className="pl-4 md:pl-10 lg:pl-16" ref={emblaRef}>
                        <div className="flex gap-4 md:gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    onMouseEnter={pauseAutoPlay}
                                    onMouseLeave={play}
                                    className="flex-[0_0_270px] min-w-0"
                                >
                                    <EventsCard1 {...fromPublicPagesEvent(event)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}