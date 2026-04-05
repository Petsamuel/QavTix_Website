'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { space_grotesk } from '@/lib/fonts'
import CarouselActionBtns from '@/components/custom-utils/buttons/CarouselActionBtns'
import EventsCard1 from '@/components/custom-utils/cards/EventCards'
import { fromPublicPagesEvent } from '@/components/custom-utils/cards/resources/event-card-adapter'
import { useMediaQuery } from '@/lib/custom-hooks/UseMediaQuery'

interface Props {
    events: PublicPagesEvent[]
}

const MIN_FOR_LOOP = 6

export default function UpcomingEvents({ events }: Props) {

    const isMobile = !useMediaQuery('(min-width: 768px)')
    const shouldCarousel = isMobile || events.length >= MIN_FOR_LOOP

    const displayEvents = shouldCarousel
        ? Array.from(
            { length: Math.ceil(MIN_FOR_LOOP / Math.max(events.length, 1)) + 1 },
            (_, i) => events.map((e, j) => ({ ...e, _key: `${e.id}-${i}-${j}` }))
          ).flat()
        : events.map((e, i) => ({ ...e, _key: `${e.id}-${i}` }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: shouldCarousel, align: 'start', skipSnaps: false, dragFree: false, watchDrag: shouldCarousel },
        shouldCarousel
            ? [Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: false })]
            : []
    )

    const autoplay   = emblaApi?.plugins()?.autoplay
    const scrollPrev = useCallback(() => { autoplay?.stop(); emblaApi?.scrollPrev() }, [emblaApi, autoplay])
    const scrollNext = useCallback(() => { autoplay?.stop(); emblaApi?.scrollNext() }, [emblaApi, autoplay])
    const pauseAuto  = useCallback(() => autoplay?.stop(), [autoplay])
    const resumeAuto = useCallback(() => autoplay?.play(), [autoplay])

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
        <section className="w-full py-10 md:ps-10 lg:ps-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 justify-between mb-8 md:pe-16">
                    <h2 className={`${space_grotesk.className} text-2xl sm:text-3xl md:text-[2rem] font-medium text-secondary-9`}>
                        Upcoming events
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

                {!shouldCarousel ? (
                    <div className="flex justify-center items-center flex-wrap gap-6 lg:gap-8 md:grid grid-cols-3 lg:grid-cols-4 2xl:flex mt-10">
                        {displayEvents.map(event => (
                            <div key={event._key}>
                                <EventsCard1 {...fromPublicPagesEvent(event)} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden" ref={emblaRef} onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
                        <div className="flex gap-4 px-3 py-2">
                            {displayEvents.map(event => (
                                <div key={event._key} className="flex-[0_0_95%] sm:flex-[0_0_45%] lg:flex-[0_0_33.33%] xl:flex-[0_0_24%] min-w-0">
                                    <EventsCard1 {...fromPublicPagesEvent(event)} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}