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
import { EVENT_ROUTES, MARKETPLACE_ROUTES } from "@/components-data/navigation/navLinks"
import { useFavourite } from "@/lib/custom-hooks/UseFavourite"
import ShareEventModal from "@/components/modals/ShareEventModal"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"

interface Props {
    event: EventDetails | MarketplaceEventDetails
    className?: string
    affiliateCode?: string
}

export default function EventOverviewSection({ event, className, affiliateCode }: Props) {

    const [showShare, setShowShare] = useState(false)
    const pathName = usePathname()
    const router = useRouter()

    const { isFavourite, toggle: toggleFavourite, feedbackMsg } = useFavourite(event.id, event.is_favorite)

    const baseEventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}`
    const eventUrl = affiliateCode ? `${baseEventUrl}?ref=${encodeURIComponent(affiliateCode)}` : baseEventUrl
    const fullAddress = [
        event.event_location.venue_name,
        event.event_location.address,
        event.event_location.city,
        event.event_location.state,
    ].filter(Boolean).join(", ")

    const mapQuery = `${event.event_location.venue_name}, ${event.event_location.city}, ${event.event_location.country}`

    const handleShare = () => {
        setShowShare(true)
    }

    return (
        <>
            <section className={cn(className, "mt-4 md:mt-0")}>
                <h1 className={`${space_grotesk.className} font-bold text-[2rem] leading-9.5 text-secondary-9`}>
                    {event.title}
                </h1>

                <div className="flex items-center flex-wrap gap-8 gap-y-4 md:justify-between mt-3 md:mt-0">
                    <div className="mt-3 flex flex-wrap flex-1 gap-3">
                        {event.event_status && (
                            <Badge
                                variant={['selling_fast', 'fast_selling', 'starts_soon', 'near_capacity'].includes(event.event_status) ? "outline" : "default"}
                                className={cn(
                                    "py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize inline-flex items-center justify-center gap-1",
                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.bg ?? "bg-neutral-2",
                                    statusStyles[event.event_status as keyof StatusStylesRecord]?.text ?? "text-neutral-7",
                                    ['selling_fast', 'fast_selling', 'starts_soon', 'near_capacity'].includes(event.event_status)
                                        ? "border border-[#3D4149]! text-[#3D4149]! bg-transparent"
                                        : (statusStyles[event.event_status as keyof StatusStylesRecord]?.bg?.includes('border') ? "" : "border-none")
                                )}
                            >
                                {['selling_fast', 'fast_selling', 'starts_soon', 'near_capacity'].includes(event.event_status) && (
                                    <Image src="/Fire.svg" alt="Fire Icon" width={16} height={16} />
                                )}
                                {statusStyles[event.event_status as keyof StatusStylesRecord]?.label || event.event_status}
                            </Badge>
                        )}

                        {((event as EventDetails).is_filling_fast && !['fast_filling', 'filling_fast'].includes(event.event_status)) && (
                            <Badge
                                variant="default"
                                className={cn(
                                    "py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize inline-flex items-center justify-center gap-1 border-none",
                                    statusStyles['filling_fast']?.bg ?? "bg-warning-tertiary",
                                    statusStyles['filling_fast']?.text ?? "text-secondary-9"
                                )}
                            >
                                Filling Fast
                            </Badge>
                        )}

                        {
                            event.age_restriction && (
                                <Badge className={cn(space_grotesk.className, "rounded-full p-2 text-xs bg-red-500 font-medium text-white size-7")}>
                                    18+
                                </Badge>
                            )
                        }
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
                        {event.location_type === "tba" ? (
                            <>
                                <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                                <span className="text-neutral-7 text-sm italic">To Be Announced</span>
                            </>
                        ) : event.location_type !== "online" ? (
                            <>
                                <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                                <Link
                                    href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-fit min-w-0 text-neutral-7 inline-flex gap-1 underline items-center"
                                >
                                    <span className="text-sm wrap-break-words flex-1">{fullAddress}</span>
                                    <Icon icon="system-uicons:arrow-top-right" width="16" height="16" className="shrink-0 -ml-0.5" />
                                </Link>
                            </>
                        ) : (
                            <Link
                                href={`${event.event_location.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-fit min-w-0 text-neutral-7 inline-flex gap-1 items-center"
                            >
                                <div className="items-center gap-2 inline-flex justify-center">
                                    <Icon icon="hugeicons:internet" className="size-4 shrink-0 text-accent-6" />
                                    <span className="text-sm font-normal">Online Event</span>
                                </div>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Tickets */}
                {
                    pathName.includes("/marketplace/") ?
                        <button
                            onClick={() => router.push(MARKETPLACE_ROUTES.CHECKOUT.href.replace("[ticket_id]", (event as MarketplaceEventDetails).listing_id.toString()))}
                            className="bg-primary-6 mt-6 hover:bg-primary-7 text-white px-6 py-4 rounded-full font-medium transition-colors"
                        >
                            Purchase Ticket
                        </button>
                        : event.location_type === "tba" ?
                            <div className="mt-6 rounded-3xl border border-neutral-5 bg-neutral-1 p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex items-center justify-center size-9 rounded-full bg-neutral-2 shrink-0 mt-0.5">
                                        <Icon icon="hugeicons:location-06" className="size-5 text-neutral-7" />
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-secondary-9">Location To Be Announced</p>
                                        <p className="text-xs text-neutral-7 mt-1 leading-relaxed">
                                            Event details are still being finalised. Ticket sales will open once the location is confirmed.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    disabled
                                    className="w-full py-3.5 rounded-full bg-neutral-3 text-neutral-5 font-medium text-sm cursor-not-allowed select-none"
                                >
                                    Get Tickets
                                </button>
                            </div>
                            :
                            <>
                                {event.event_status !== "sold-out" && <TicketStatusSection event={event} affiliateCode={affiliateCode} />}
                            </>
                }

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