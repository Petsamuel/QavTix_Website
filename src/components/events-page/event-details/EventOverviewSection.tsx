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
}

export default function EventOverviewSection({ event, className }: Props) {

    const [showShare, setShowShare] = useState(false)
    const pathName = usePathname()
    const router = useRouter()

    const { isFavourite, toggle: toggleFavourite, feedbackMsg } = useFavourite(event.id, event.is_favorite)

    const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}`
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
                    <div className="mt-3 flex flex-wrap w-1/2 gap-3 ">
                        <Badge
                            variant="outline"

                            className={`py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize ${statusStyles[event.event_status as keyof StatusStylesRecord]?.bg ?? "bg-neutral-2"
                                } ${statusStyles[event.event_status as keyof StatusStylesRecord]?.text ?? "text-neutral-7"
                                } border border-[#3D4149]! inline-flex items-center justify-center text-[#3D4149] bg`}
                        >
                            <Image src="/Fire.svg" alt="Fire Icon" width={16} height={16}/>
                            {/* {event.event_status === "sold-out" ? "Sold Out" : event.event_status}  */}
                            {new Date(event.end_datetime).getTime() > Date.now() ? "Starts Soon" : event.event_status}
                        </Badge>
                        
                        {/* option 2 */}
                        {event.event_status === "sold-out" && <Badge
                            variant="default"
                            className={`py-1 px-2 rounded-2xl text-center text-[14px] font-medium capitalize ${statusStyles[event.event_status as keyof StatusStylesRecord]?.bg ?? "bg-[#FFFBEB] text-red-900"
                                } ${statusStyles[event.event_status as keyof StatusStylesRecord]?.text ?? "text-red-900"
                                }`}
                        >
                            {event.event_status } 
                        </Badge>}

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
                        {/* Icon */}
                       {event.location_type !== "online" ? <>
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
                       </>:<Link
                            href={`${event.event_location.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-fit min-w-0 text-neutral-7 inline-flex gap-1  items-center"
                        >
                            <div className="items-center gap-2  inline-flex justify-center ">
                                <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                               <div>
                                 <span className="text-sm wrap-break-words flex font-normal">Venue: {event.event_location.venue_name}</span>
                                {/* <span className="text-sm wrap-break-words flex-1 underline">Link: {event.event_location.address}</span> */}
                               </div>
                            </div>
                        </Link>}
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
                        :
                       <>
                       { event.event_status !== "sold-out" && <TicketStatusSection event={event} />}
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