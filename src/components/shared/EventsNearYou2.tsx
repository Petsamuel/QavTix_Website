"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { space_grotesk } from "@/lib/fonts"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import CarouselActionBtns from "../custom-utils/buttons/CarouselActionBtns"
import EventsCard from "../custom-utils/cards/EventCards"
import { fromPublicPagesEvent } from "../custom-utils/cards/resources/event-card-adapter"
import { useMediaQuery } from "@/lib/custom-hooks/UseMediaQuery"
import ActionButton1 from "../custom-utils/buttons/ActionButton1"
import { TRENDING_EVENTS_ENDPOINT } from "@/endpoints"


interface Props {
    events: PublicPagesEvent[]
    city?:  string
}

const MIN_FOR_LOOP = 6

export default function EventsNearYouSection2({ events }: Props) {

    const isMobile = !useMediaQuery("(min-width: 768px)")

    const isFallback = events.length === 0
    const [fallbackEvents, setFallbackEvents] = useState<PublicPagesEvent[]>([])
    const [isLoadingFallback, setIsLoadingFallback] = useState(false)

    useEffect(() => {
        if (isFallback) {
            setIsLoadingFallback(true)
            const fetchFallback = async () => {
                try {
                    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
                    const res = await fetch(`${base}/${TRENDING_EVENTS_ENDPOINT}`)
                    if (res.ok) {
                        const json = await res.json()
                        const data = json.data ?? json
                        setFallbackEvents(data.results ?? data)
                    }
                } catch (e) {
                    // ignore
                } finally {
                    setIsLoadingFallback(false)
                }
            }
            fetchFallback()
        }
    }, [isFallback])

    const displayed = isFallback ? fallbackEvents : events
    const heading = isFallback ? "Trending events" : "Events near you"

    const shouldCarousel = isMobile || displayed.length >= MIN_FOR_LOOP

    const displayEvents = shouldCarousel
        ? Array.from(
            { length: Math.ceil(MIN_FOR_LOOP / Math.max(displayed.length, 1)) + 1 },
            (_, i) => displayed.map((e, j) => ({ ...e, _key: `${e.id}-${i}-${j}` }))
          ).flat()
        : displayed.map((e, i) => ({ ...e, _key: `${e.id}-${i}` }))

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop:      shouldCarousel,
            align:     "start",
            skipSnaps: false,
            dragFree:  false,
            watchDrag: shouldCarousel,
        },
        shouldCarousel
            ? [Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })]
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
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
        return () => { emblaApi.off("select", onSelect); emblaApi.off("reInit", onSelect) }
    }, [emblaApi, onSelect])

    return (
        <section className="w-full py-8 ps-4 md:ps-10 lg:ps-16 md:pe-0">
            <div className="flex items-center justify-between gap-5 pe-4 md:pe-10 mb-8">
                <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                    {heading}
                </h2>

                <div className="flex items-center gap-3">
                    {shouldCarousel && displayed.length > 0 && !isLoadingFallback && (
                        <CarouselActionBtns
                            scrollPrev={scrollPrev}
                            scrollNext={scrollNext}
                            canScrollPrev={canScrollPrev}
                            canScrollNext={canScrollNext}
                        />
                    )}
                </div>
            </div>

            {isLoadingFallback ? (
                <div className="mt-10 flex items-center justify-center py-16 pe-4 md:pe-10">
                    <Icon icon="eos-icons:three-dots-loading" className="size-12 text-primary" />
                </div>
            ) : displayed.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center py-16 gap-3 text-center pe-4 md:pe-10">
                    <Icon icon="hugeicons:location-01" className="size-8 text-neutral-4" />
                    <p className="text-sm font-medium text-secondary-7">No events found</p>
                    <p className="text-xs text-neutral-6">Try exploring all events instead</p>
                </div>
            ) : !shouldCarousel ? (
                <div className="flex justify-center items-center flex-wrap gap-6 lg:gap-8 md:grid grid-cols-3 lg:grid-cols-4 2xl:flex mt-10 pe-4 md:pe-10">
                    {displayEvents.map(event => (
                        <EventsCard
                            key={event._key}
                            {...fromPublicPagesEvent(event)}
                        />
                    ))}
                </div>
            ) : (
                <div
                    className="overflow-hidden animate-fade-in"
                    ref={emblaRef}
                    onMouseEnter={pauseAuto}
                    onMouseLeave={resumeAuto}
                >
                    <div className="flex gap-5 px-3 py-2">
                        {displayEvents.map(event => (
                            <div
                                key={event._key}
                                className="flex-[0_0_85%] px-1 sm:flex-[0_0_45%] md:flex-[0_0_30%] xl:flex-[0_0_23%] min-w-0"
                            >
                                <EventsCard {...fromPublicPagesEvent(event)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}