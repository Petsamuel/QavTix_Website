import { space_grotesk } from "@/lib/fonts"
import Image from "next/image"
import { format } from "date-fns"

interface Props {
    event: EventDetails
}

export default function EventDetailsPreview({ event }: Props) {
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
        (event as any).cover_image ??
        (event as any).banner_image ??
        "/images/placeholders/event-placeholder.png"

    return (
        <div
            className="flex gap-3 w-full rounded-[27px] p-2 border border-neutral-5"
            data-testid="event-details-preview"
        >
            <figure className="shrink-0">
                <Image
                    src={imageSrc}
                    alt={event.title}
                    width={300}
                    height={300}
                    className="rounded-3xl h-full w-24 md:w-32 object-cover"
                />
            </figure>

            <div className="min-w-0">
                <h3 className={`${space_grotesk.className} text-secondary-9 leading-5.5 line-clamp-3`}>
                    {event.title}
                </h3>
                {dateString && (
                    <p className="text-xs mt-3 text-neutral-7">{dateString}</p>
                )}
                {event.event_location?.address && (
                    <p className="text-xs mt-1 text-neutral-5 truncate">
                        {event.event_location.address}
                    </p>
                )}
            </div>
        </div>
    )
}