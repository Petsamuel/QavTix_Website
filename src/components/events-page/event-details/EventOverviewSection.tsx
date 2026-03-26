import { EventIconActionButton } from "@/components/shared/EventIconActionButton"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
import Link from "next/link"
import MapEmbed from "@/components/custom-utils/maps/MapEmbed"
import { copyToClipboard } from "@/helper-fns/copyToClipboard"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import HostNAttendeeDetailsSection from "./HostNAttendeeSection"
import TicketStatusSection from "./TicketStatusSection"
import { statusStyles, StatusStylesRecord } from "@/components/custom-utils/cards/resources/event-status-styles"
import { formatEventDate } from "@/helper-fns/date-utils"
import { EVENT_ROUTES } from "@/components-data/navigation/navLinks"
import { useFavourite } from "@/lib/custom-hooks/UseFavourite"
import ShareEventModal from "@/components/modals/ShareEventModal"
import { useState } from "react"

interface Props {
    event:      EventDetails
    className?: string
}

export default function EventOverviewSection({ event, className }: Props) {

    const [showShare, setShowShare] = useState(false)

    const { isFavourite, toggle: toggleFavourite, feedbackMsg } = useFavourite(event.id, event.is_favorite)

    const eventUrl    = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}`
    const fullAddress = [
        event.event_location.venue_name,
        event.event_location.address,
        event.event_location.city,
        event.event_location.state,
    ].filter(Boolean).join(", ")

    const mapQuery = `${event.event_location.venue_name}, ${event.event_location.city}, ${event.event_location.country}`

    const handleShare = () => {
        if (typeof navigator?.share === 'function') {
            navigator.share({ title: event.title, text: `Check out ${event.title}! 🎉`, url: eventUrl })
                .catch(() => setShowShare(true))
        } else {
            setShowShare(true)
        }
    }

    return (
        <>
            <section className={cn(className, "mt-4 md:mt-0")}>
                <h1 className={`${space_grotesk.className} font-bold text-[2rem] leading-9.5 text-secondary-9`}>
                    {event.title}
                </h1>

                <div className="flex items-center flex-wrap gap-8 gap-y-4 md:justify-between">
                    <div className="mt-3 space-x-3">
                        {event.tags.map(tag => (
                            <Badge
                                key={tag}
                                variant="default"
                                className={`py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize ${
                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.bg ?? "bg-neutral-2"
                                } ${
                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.text ?? "text-neutral-7"
                                }`}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="flex justify-end text-secondary-9 gap-3 items-center">
                        <EventIconActionButton
                            icon="hugeicons:share-08"
                            onClick={handleShare}
                            feedback="Opening share..."
                        />
                        <EventIconActionButton
                            icon="ph:link-bold"
                            onClick={() => copyToClipboard(eventUrl)}
                            feedback="Event link copied"
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

                {/* Date / Location */}
                <div className="space-y-3 mb-2 mt-7">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                            <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-accent-6" />
                            <hr className="w-px h-2 border border-neutral-6" />
                            <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-accent-6" />
                        </div>
                        <span className="text-neutral-7 text-sm truncate flex-1">
                            {formatEventDate(event.start_datetime)}
                            {event.end_datetime && ` — ${formatEventDate(event.end_datetime)}`}
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                        <Link
                            href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-neutral-7 flex items-center gap-1"
                        >
                            <span className="text-sm truncate">{fullAddress}</span>
                            <Icon icon="system-uicons:arrow-top-right" width="21" height="21" />
                        </Link>
                    </div>
                </div>

                {/* Tickets */}
                <TicketStatusSection eventId={event.id} tickets={event.tickets} />

                {/* Full description */}
                <article className="mt-12">
                    <h2 className={`${space_grotesk.className} font-bold text-xl uppercase text-secondary-9 leading-5.5`}>
                        EVENT OVERVIEW
                    </h2>
                    <p className="mt-7 leading-relaxed text-neutral-8">
                        {event.full_description}
                    </p>
                    {event.short_description && event.short_description !== event.full_description && (
                        <p className="mt-4 leading-relaxed text-neutral-7 text-sm">
                            {event.short_description}
                        </p>
                    )}
                </article>

                {/* Mobile host section */}
                <div className="mt-10 md:hidden">
                    <HostNAttendeeDetailsSection event={event} />
                </div>

                <MapEmbed location={mapQuery} className="mt-14 rounded-4xl" />
            </section>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
                title={event.title}
            />
        </>
    )
}