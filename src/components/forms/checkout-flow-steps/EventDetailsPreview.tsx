"use client"

import { space_grotesk } from "@/lib/fonts"
import Image from "next/image"
import { format } from "date-fns"
import { useState } from "react"
import { Play, X } from "lucide-react"

interface Props {
    event: EventDetails
}

export default function EventDetailsPreview({ event }: Props) {

    const [videoOpen, setVideoOpen] = useState(false)

    const startDate = event.start_datetime
        ? format(new Date(event.start_datetime), "MMMM d, h:mmaaa")
        : null
    const endDate = event.end_datetime
        ? format(new Date(event.end_datetime), "h:mmaaa zzz")
        : null

    const dateString = startDate && endDate
        ? `${startDate} – ${endDate}`
        : startDate ?? ""

    const imageSrc =
        event.event_media?.find(v => v.is_featured)?.image_url ||
        event.event_media[0].image_url

    const hasVideo = !!event.event_media?.find(v => v.video_url)

    return (
        <>
            <div
                className="flex gap-3 w-full rounded-[27px] p-2 border border-neutral-5"
                data-testid="event-details-preview"
            >
                {/* Image + optional Watch Video pill */}
                <figure className="shrink-0 relative">
                    <Image
                        src={imageSrc}
                        alt={event.title}
                        width={300}
                        height={300}
                        className="rounded-3xl h-25 w-24 md:w-32 object-cover"
                    />
                    {hasVideo && (
                        <button
                            onClick={() => setVideoOpen(true)}
                            className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/70 hover:bg-black/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm transition-colors whitespace-nowrap"
                        >
                            <Play className="w-2.5 h-2.5 fill-white" />
                            Watch
                        </button>
                    )}
                </figure>

                <div className="min-w-0 flex py-1 flex-col justify-between gap-3">
                    <h3 className={`${space_grotesk.className} text-lg font-medium text-secondary-9 leading-5.5 line-clamp-3`}>
                        {event.title}
                    </h3>
                    <div>
                        {dateString && (
                            <p className="text-xs mt-3 text-neutral-7">{dateString}</p>
                        )}
                        {event.event_location?.address && (
                            <p className="text-xs mt-1 text-neutral-7 truncate">
                                {event.event_location.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Video modal */}
            {videoOpen && hasVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setVideoOpen(false)}
                >
                    <div
                        className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <video
                            src={event.event_media.find(v => v.video_url)?.video_url}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                        <button
                            onClick={() => setVideoOpen(false)}
                            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}