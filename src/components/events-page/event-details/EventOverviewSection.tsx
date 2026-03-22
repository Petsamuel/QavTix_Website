import { EventIconActionButton } from "@/components/shared/EventIconActionButton";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@iconify/react";
import Link from "next/link";
import MapEmbed from "@/components/custom-utils/maps/MapEmbed";
import { copyToClipboard } from "@/helper-fns/copyToClipboard";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";
import HostNAttendeeDetailsSection from "./HostNAttendeeSection";
import TicketStatusSection from "./TicketStatusSection";
import { statusStyles, StatusStylesRecord } from "@/components/custom-utils/cards/resources/event-status-styles";

export default function EventOverviewSection({ className }:{ className?: string }){
    return (
        <section className={cn(
            className,
            "mt-4 md:mt-0"
        )}>
            <h1 className={`${space_grotesk.className} font-bold text-[2rem] leading-9.5 text-secondary-9`}>Learn to create visually appealing  and user-friendly interfaces.</h1>

            <div className="flex items-center flex-wrap gap-8 gap-y-4 md:justify-between">
                <div className="mt-3 space-x-3">
                    <Badge variant="outline" className="py-1.5 px-3 outline outline-secondary-9 border-0">
                        <Icon icon="noto:fire" width="128" height="128" />Trending
                    </Badge>
                    <Badge variant="default" className={`py-1 px-2 rounded-2xl text-center text-[14px] font-medium ${statusStyles["filling-fast" as keyof StatusStylesRecord].bg} ${statusStyles["filling-fast" as keyof StatusStylesRecord].text} capitalize`}>
                        Filling Fast
                    </Badge>
                </div>

                <div className="flex justify-end text-secondary-9 gap-3 items-center">
                    <EventIconActionButton 
                        icon="hugeicons:share-08" 
                        onClick={() => {}} 
                        className="hover:text-white"
                        feedback=""
                    />
                    <EventIconActionButton 
                        icon="ph:link-bold" 
                        onClick={() => copyToClipboard("Hello")} 
                        className="hover:text-white"
                        feedback="Event link copied"
                    />
                    <EventIconActionButton 
                        icon="hugeicons:favourite" 
                        onClick={() => {}} 
                        className="hover:text-white"
                        feedback="Added to favourites"
                    />
                </div>
            </div>

            {/* Date/Location */}
            <div className="space-y-3 mb-2 mt-7">
                <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                        <Icon icon="hugeicons:calendar-04" className="size-4 shrink-0 text-accent-6" />
                        <hr className="w-px h-2 border border-neutral-6" />
                        <Icon icon="hugeicons:clock-01" className="size-4 shrink-0 text-accent-6" />
                    </div>
                    <span className="text-neutral-7 text-sm truncate flex-1">
                        Tomorrow, March 22, 9AM - 12PM WAT
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    <Icon icon="hugeicons:location-01" className="size-4 shrink-0 text-accent-6" />
                    <Link href="" className="flex-1 text-neutral-7 flex items-center gap-1">
                        <span className="text-sm truncate">
                            1234, Shima Road, Victoria Island, Lagos
                        </span>
                        <Icon icon="system-uicons:arrow-top-right" width="21" height="21" />
                    </Link>
                </div>
            </div>


            <TicketStatusSection eventId={"123"} />



            {/* Event Overview [Temp] */}
            <article className="mt-12">
                <h2 className={`${space_grotesk.className} font-bold text-xl uppercase text-secondary-9 leading-5.5`}>EVENT OVERVIEW</h2>

                <p className="mt-7 leading-relaxed text-neutral-8">
                    Lagos, get ready!
                    On Saturday, December 13, 2025, the city comes alive as Burna Boy — the global icon, Grammy-winning artist, and pioneer of Afro Fusion — returns home for the most anticipated concert of the year.
                    This isn’t just a show.
                    It’s a movement, a celebration, and an unforgettable night of sound, culture, and pure African excellence.
                    From the booming bass to the synchronized lights and electrifying dance performances, everything is designed to pull you into a world where music becomes emotion and energy becomes connection.
                    Step into a night where:
                    Thousands of voices sing along to every line
                    The lights shimmer across the Lagos skyline
                    Special guest artists take the stage for surprise performances
                    Burna Boy delivers a show crafted to shake the city to its core
                    If you’ve ever wanted to experience a concert that leaves you speechless, energized, and inspired — this is the one.
                </p>
            </article>

            <div className="mt-10 md:hidden">
                <HostNAttendeeDetailsSection />
            </div>

            <MapEmbed location="Lagos, NG" className="mt-14 rounded-4xl" />
        </section>
    )
}