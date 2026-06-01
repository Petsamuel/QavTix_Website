'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { mockAttendees } from '@/components-data/mock-attendees'
import CarouselActionBtns from '../custom-utils/buttons/CarouselActionBtns'
import { getAvatarColor } from '@/helper-fns/getAvatarColor'
import { getInitialsFromName } from '@/helper-fns/getInitialFromName'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import { formatEventDate } from '@/helper-fns/date-utils'
import { Skeleton } from '../ui/skeleton'
import { formatPrice } from '@/helper-fns/formatPrice'
import { statusStyles, StatusStylesRecord } from '@/components/custom-utils/cards/resources/event-status-styles'
import { cn } from '@/lib/utils'
import { toTitleCase } from '@/helper-fns/stringFormaters'


interface Props {
    events: PublicPagesEvent[]
}

export default function FeaturedEventsSection({ events }: Props) {

    // Duplicate for infinite loop feel — always attach a unique _key so the JSX
    // can use it as the React key regardless of which branch is taken.
    const displayEvents = (() => {
        if (events.length > 3) {
            return [...events, ...events, ...events].map((e, i) => ({ ...e, _key: `${e.id}-${i}` }))
        }
        // Fewer than or equal to 3 events — show them once, still with a stable _key
        return events.map((e, i) => ({ ...e, _key: `${e.id}-${i}` }))
    })()

    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: 'start', skipSnaps: false, dragFree: false },
        [Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: false })]
    )

    const scrollPrev = useCallback(() => {
        emblaApi?.plugins()?.autoplay?.stop()
        emblaApi?.scrollPrev()
    }, [emblaApi])

    const scrollNext = useCallback(() => {
        emblaApi?.plugins()?.autoplay?.stop()
        emblaApi?.scrollNext()
    }, [emblaApi])

    const pauseAutoPlay = useCallback(() => emblaApi?.plugins()?.autoplay?.stop(), [emblaApi])
    const play = useCallback(() => emblaApi?.plugins()?.autoplay?.reset(), [emblaApi])

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

    if (events.length === 0) return null

    return (
        <section className="w-full py-10 ps-4 md:ps-10 lg:ps-16 md:pe-0">
            <div className="max-w-8xl mx-auto">
                <div className="flex pe-4 items-center gap-6 justify-between mb-8 md:pe-10">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                        Featured events
                    </h2>
                    <CarouselActionBtns
                        scrollPrev={scrollPrev}
                        scrollNext={scrollNext}
                        canScrollPrev={canScrollPrev}
                        canScrollNext={canScrollNext}
                    />
                </div>

                <div className="overflow-hidden p-1.5 lg:py-2" ref={emblaRef}>
                    <div className="flex">
                        {displayEvents.map(event => (
                            <Link
                                key={event._key}
                                href={EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}
                                className="flex-[0_0_85%] sm:flex-[0_0_30%] mr-2"
                            >
                                <div onMouseOver={pauseAutoPlay} onMouseLeave={play} className="pr-6">
                                    <div className="group drop-shadow-sm lg:drop-shadow-xs bg-transparent relative aspect-3/4 cursor-pointer">
                                        {
                                            event.event_image ?
                                                <Image
                                                    src={event.event_image}
                                                    alt={event.event_name}
                                                    fill
                                                    className="object-cover rounded-4xl transition-transform duration-400 lg:group-hover:scale-103"
                                                />
                                                :
                                                <Skeleton className="rounded-4xl bg-neutral-4 w-full h-full transition-transform duration-400 lg:group-hover:scale-103" />
                                        }

                                        {/* Status badge — top left */}
                                        {event.event_status && (
                                            <span
                                                suppressHydrationWarning
                                                className={cn(
                                                    "absolute top-3 hidden group-hover:flex left-3 z-10 py-1 px-2 rounded-2xl text-center text-xs font-medium capitalize shadow-sm items-center justify-center gap-1 whitespace-nowrap",
                                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.bg || "bg-white/90 backdrop-blur-sm shadow-sm",
                                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.text || "text-neutral-8",
                                                    ['selling_fast', 'fast_selling', 'starts_soon', 'near_capacity'].includes(event.event_status) ? "border border-[#3D4149]! text-[#3D4149]! bg-white/90 backdrop-blur-sm" : ""
                                                )}
                                            >
                                                {['selling_fast', 'fast_selling', 'starts_soon', 'near_capacity'].includes(event.event_status) && (
                                                    <Image src="/Fire.svg" alt="Fire Icon" width={16} height={16} />
                                                )}
                                                <span>
                                                    {statusStyles[event.event_status as keyof StatusStylesRecord]?.label ?? event.event_status}
                                                </span>
                                            </span>
                                        )}

                                        {/* Featured icon — top right */}
                                        <span suppressHydrationWarning className="absolute top-3 right-3 z-10 flex items-center justify-center size-8 rounded-full bg-white/60 shadow-sm">
                                            <Icon icon="mdi:feature-highlight" width="20" height="20" className="text-accent-6" />
                                        </span>

                                        <div className="absolute inset-x-0 -bottom-1 bg-white p-5 w-full group-hover:scale-103 border-b rounded-b-4xl lg:rounded-b-sm transform transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-0 opacity-100 lg:translate-y-full lg:opacity-0 lg:group-hover:translate-y-0 md:group-hover:opacity-100">
                                            <span className="bg-accent-1 w-fit block text-accent-9 font-medium py-1 px-2 rounded-2xl text-xs">
                                                {event.category}
                                            </span>

                                            <p className="text-sm text-secondary-9 font-medium mt-2 line-clamp-2">
                                                {toTitleCase(event.event_name)}
                                            </p>

                                            <span className="text-[11px] block mt-1 text-neutral-7">
                                                Hosted by {toTitleCase(event.host)}
                                            </span>

                                            <div className="flex items-center gap-1 mt-2 text-neutral-7 text-[11px]">
                                                <Icon icon="hugeicons:calendar-04" className="size-4" />
                                                <span>{formatEventDate(event.event_datetime)}</span>
                                            </div>

                                            <div className="flex items-center gap-1 mt-1 text-neutral-7 text-[11px]">
                                                <Icon icon="hugeicons:location-01" className="size-4" />
                                                <span>
                                                    {event.event_location.city}, {event.event_location.state}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                {(event.attendees_count ?? 0) > 0 && (
                                                    <div className="flex -space-x-1.5 shrink-0">
                                                        {mockAttendees.slice(0, event.attendees_count <= 5 ? event.attendees_count : 4).map((user) => (
                                                            <Avatar key={user.id} className="ring-2 ring-white size-7">
                                                                {user.profile_picture && <AvatarImage src={user.profile_picture} alt={user.full_name} />}
                                                                <AvatarFallback className={`${getAvatarColor(user.id.toString())} text-white font-medium text-[10px]`}>
                                                                    {getInitialsFromName(user.full_name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        ))}
                                                        {event.attendees_count > 5 && (
                                                            <Avatar className="ring-2 ring-white size-7">
                                                                <AvatarFallback className="bg-primary-1 font-medium text-secondary-7 text-xs">
                                                                    +{event.attendees_count - 4}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-right">
                                                    <p className={`${space_grotesk.className} font-medium text-lg text-secondary-9`}>
                                                        {parseInt(event.price) === 0 ? 'Free' : formatPrice(parseInt(event.price), event.currency)}
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