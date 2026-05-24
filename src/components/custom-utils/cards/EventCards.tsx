'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { space_grotesk } from "@/lib/fonts"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { Skeleton } from '@/components/ui/skeleton'
import { statusStyles, StatusStylesRecord } from './resources/event-status-styles'
import { EventCardProps } from './resources/event-card-adapter'
import { formatPrice, parsePrice } from '@/helper-fns/formatPrice'
import { formatEventDate } from '@/helper-fns/date-utils'
import { useFavourite } from '@/lib/custom-hooks/UseFavourite'
import { EventIconActionButton } from '@/components/shared/EventIconActionButton'
import ShareEventModal from '@/components/modals/ShareEventModal'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import Link from 'next/link'
import { mockAttendees } from '@/components-data/mock-attendees'

export default function EventsCard(card: EventCardProps) {

    const [imageError, setImageError] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const totalAttendees = card.attendees || 0
    const avatarsToShow = totalAttendees <= 5 ? totalAttendees : 4

    const { isFavourite, toggle: toggleFavourite, feedbackMsg } = useFavourite(card.id, card.isFavourite)

    const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", card.id)}`

    const handleShare = () => {
        setShowShare(true)
    }

    return (
        <>
            <Link
                href={eventUrl}
                className="block w-full max-w-72 md:max-w-70 p-3 relative min-h-[25em] rounded-[32px] border border-neutral-6 bg-white hover:bg-secondary-1 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-[1.5px] focus:ring-accent-5 focus:ring-offset-[1.5px] group"
                aria-label={`View event: ${card.title}`}
            >
                <div className="flex flex-col h-full">
                    <div className="relative shrink-0">
                        <span className={cn(
                            "absolute top-2 shadow-sm left-2 z-10 py-1 px-2 rounded-2xl text-center text-xs font-medium capitalize",
                            statusStyles[card.status as keyof StatusStylesRecord]?.bg,
                            statusStyles[card.status as keyof StatusStylesRecord]?.text,
                        )}>
                            {card.status}
                        </span>

                        <figure className="relative w-full aspect-4/3 h-40 rounded-4xl overflow-hidden">
                            {!imageError && card.image ? (
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    fill
                                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    placeholder="blur"
                                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlNWU3ZWIiLz4KPC9zdmc+"
                                    onError={() => setImageError(true)}
                                    priority={false}
                                />
                            ) : (
                                <Skeleton className="w-full h-full bg-linear-to-br from-neutral-4 to-neutral-5" />
                            )}
                        </figure>

                        <div
                            className="flex text-white justify-end gap-3 items-center absolute bottom-3 right-3"
                            onClick={(e) => e.preventDefault()}
                        >
                            <EventIconActionButton
                                icon="hugeicons:share-08"
                                onClick={handleShare}
                                feedback="Opening share..."
                            />
                            <EventIconActionButton
                                icon="ph:link-bold"
                                onClick={() => copyToClipboard(eventUrl)}
                                feedback="Link copied!"
                            />
                            <EventIconActionButton
                                icon={isFavourite ? "teenyicons:heart-solid" : "hugeicons:favourite"}
                                onClick={toggleFavourite}
                                feedback=""
                                externalFeedback={feedbackMsg}
                                iconStyles={isFavourite ? "text-primary-5" : ""}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col justify-between flex-1 mt-1">
                        <div>
                            <span className="bg-accent-1 capitalize w-fit block text-accent-9 font-medium py-1 px-2 mt-2 rounded-2xl text-center text-xs">
                                {card.category}
                            </span>
                            <span className="text-[11px] block mt-1 w-fit text-neutral-7 truncate max-w-full">
                                Hosted by {card.host}
                            </span>
                            <p className="text-sm text-secondary-9 font-medium mt-1 mb-3 line-clamp-2">
                                {card.title}
                            </p>

                            <div className="space-y-2 mb-2">
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center gap-0.5">
                                        <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-accent-6" />
                                        <hr className="w-px h-2 border border-neutral-6" />
                                        <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-accent-6" />
                                    </div>
                                    <span className="text-neutral-7 text-[11px] truncate flex-1">{formatEventDate(card.date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                                    <span className="text-neutral-7 text-[11px] truncate flex-1">{card.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center flex-wrap justify-between pt-2 gap-2">
                            {(card.attendees ?? 0) > 0 && (
                                <div className="flex -space-x-1.5 shrink-0">
                                    {mockAttendees.slice(0, avatarsToShow).map((user) => (
                                        <Avatar key={user.id} className="ring-2 ring-background size-8">
                                            {user.profile_picture && <AvatarImage src={user.profile_picture} alt={user.full_name} />}
                                            <AvatarFallback className={`${getAvatarColor(user.id.toString())} text-white font-medium text-[10px]`}>
                                                {getInitialsFromName(user.full_name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {card.attendees && card.attendees > 5 && (
                                        <Avatar className="ring-2 ring-background size-8">
                                            <AvatarFallback className="bg-primary-1 font-medium text-secondary-7 text-xs">
                                                +{card.attendees - 4}
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )}

                            <div className="text-right shrink-0 ml-auto">
                                {card.originalPrice && parsePrice(card.originalPrice) != null && (
                                    <p className="text-xs text-neutral-6 line-through">
                                        {formatPrice(parsePrice(card.originalPrice)!, card.currency || 'NGN')}
                                    </p>
                                )}
                                {card.price && parsePrice(card.price) != null && (
                                    <p className={`${space_grotesk.className} font-semibold text-lg text-secondary-9`}>
                                        {parsePrice(card.price) === 0 ? 'Free' : formatPrice(parsePrice(card.price)!, card.currency || 'NGN')}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
                title={card.title}
            />
        </>
    )
}