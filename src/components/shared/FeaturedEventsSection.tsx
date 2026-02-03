'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { space_grotesk } from '@/lib/fonts'
import { demoFeaturedEvents, eventsMock } from '@/components-data/demo-data'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import { Icon } from '@iconify/react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { getAvatarColor } from '@/helper-fns/getAvatarColor'
import { getInitialsFromName } from '@/helper-fns/getInitialFromName'
import Link from 'next/link'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'


const dupliactedFeaturedEvents: FeaturedEvent[] = [...demoFeaturedEvents, ...demoFeaturedEvents, ...demoFeaturedEvents].map(
    (event, index) => ({
        ...event,
        id: index + 1
    })
)

export default function FeaturedEventsSection() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
        loop: true,
        align: 'start',
        skipSnaps: false,
        dragFree: false,
        },
        [
        Autoplay({
            delay: 2000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: false,
        }),
        ]
    )

    const scrollPrev = useCallback(() => {
        const autoplayPlugin = emblaApi?.plugins()?.autoplay
        autoplayPlugin?.stop()
        emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        const autoplayPlugin = emblaApi?.plugins()?.autoplay
        autoplayPlugin?.stop()
        emblaApi?.scrollNext()
    }, [emblaApi])

    const pauseAutoPlay = useCallback(() => {
        const autoplayPlugin = emblaApi?.plugins()?.autoplay
        autoplayPlugin?.stop()
    }, [emblaApi])

    const play = useCallback(() => {
        const autoplayPlugin = emblaApi?.plugins()?.autoplay
        autoplayPlugin?.play()
    }, [emblaApi])


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
        <section className="w-full py-10 ps-4 md:ps-10 lg:ps-16 md:pe-0">
            <div className="max-w-8xl mx-auto">
                <div className="flex pe-4 items-center gap-6 justify-between mb-8 md:pe-10">
                    <h2 className={`text-2xl sm:text-3xl  md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Featured events
                    </h2>
                    
                    <CarouselActionBtns
                        scrollPrev={scrollPrev}
                        scrollNext={scrollNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                </div>

                {/* Carousel */}
                <div className="overflow-hidden p-1.5 lg:py-2" ref={emblaRef}>
                    <div className="flex">
                        {dupliactedFeaturedEvents.map((event) => (
                            <Link key={event.id} href={EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id.toString())} className='flex-[0_0_85%] sm:flex-[0_0_30%] md:w-[23.75] mr-2'>
                                <div
                                    onMouseOver={pauseAutoPlay}
                                    onMouseLeave={play}
                                    className="pr-6"
                                >
                                    <div className="group drop-shadow-sm lg:drop-shadow-xs bg-transparent relative aspect-3/4 cursor-pointer">

                                        {/* IMAGE */}
                                        <Image
                                            src={event.image}
                                            alt={event.title}
                                            fill
                                            className="object-cover rounded-4xl transition-transform duration-400 lg:group-hover:scale-103"
                                        />

                                        {/* WHITE SLIDE-UP DETAILS */}
                                        <div
                                            className="
                                                absolute inset-x-0 -bottom-1
                                                bg-white
                                                p-5
                                                w-full
                                                group-hover:scale-103
                                                border-b rounded-b-4xl lg:rounded-b-sm
                                                transform transition-all duration-400
                                                ease-[cubic-bezier(0.22,1,0.36,1)]

                                                translate-y-0 opacity-100
                                                lg:translate-y-full lg:opacity-0
                                                lg:group-hover:translate-y-0 md:group-hover:opacity-100
                                            "
                                        >
                                            {/* CATEGORY */}
                                            <span className="bg-accent-1 w-fit block text-accent-7 font-medium py-1 px-2 rounded-2xl text-xs">
                                                {eventsMock[0].category}
                                            </span>

                                            {/* TITLE */}
                                            <p className="text-sm text-secondary-9 font-medium mt-2 line-clamp-2">
                                                {eventsMock[0].title}
                                            </p>

                                            {/* HOST */}
                                            <span className="text-[11px] block mt-1 text-neutral-7">
                                                Hosted by {eventsMock[0].host}
                                            </span>

                                            {/* DATE */}
                                            <div className="flex items-center gap-1 mt-2 text-neutral-7 text-[11px]">
                                                <Icon icon="hugeicons:calendar-04" className="size-4" />
                                                <span>{eventsMock[0].date}</span>
                                            </div>

                                            {/* LOCATION */}
                                            <div className="flex items-center gap-1 mt-1 text-neutral-7 text-[11px]">
                                                <Icon icon="hugeicons:location-01" className="size-4" />
                                                <span>{eventsMock[0].location}</span>
                                            </div>

                                            {/* FOOTER */}
                                            <div className="flex items-center justify-between pt-4">
                                                {/* ATTENDEES */}
                                                <div className="flex -space-x-2">
                                                    {eventsMock[0].attendees.slice(0, 3).map((user) => (
                                                        <Avatar key={user.id} className="ring-2 ring-white size-7">
                                                            <AvatarFallback
                                                                className={`${getAvatarColor(user.id.toString())} text-white text-xs`}
                                                            >
                                                                {getInitialsFromName(user.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ))}
                                                    {eventsMock[0].attendees.length > 3 && (
                                                        <Avatar className="ring-2 ring-white size-7">
                                                            <AvatarFallback className="bg-primary-1 text-xs font-medium">
                                                                +{eventsMock[0].attendees.length - 3}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                </div>

                                                {/* PRICE */}
                                                <div className="text-right">
                                                    {eventsMock[0].originalPrice && (
                                                        <p className="text-xs text-neutral-6 line-through">
                                                            {eventsMock[0].originalPrice}
                                                        </p>
                                                    )}
                                                    <p className={`${space_grotesk.className} font-medium text-lg text-secondary-9`}>
                                                        {eventsMock[0].price}
                                                    </p>
                                                </div>
                                            </div>
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