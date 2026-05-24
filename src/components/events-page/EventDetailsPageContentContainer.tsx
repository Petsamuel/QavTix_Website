"use client"

import SectionHeading from "@/components/shared/SectionHeading"
import Image from "next/image"
import EventOverviewSection from "./event-details/EventOverviewSection"
import HostNAttendeeDetailsSection from "./event-details/HostNAttendeeSection"
import RelatedEventsYouMightLike from "./event-details/RelatedEventsYouMightLike"
import ContactHostForm from "../forms/host/ContactHostForm"
import { Skeleton } from "../ui/skeleton"


interface Props {
    event: EventDetails | MarketplaceEventDetails
    relatedEvents: PublicPagesEvent[]
}

export default function EventDetailsPageContentContainer({ event, relatedEvents }: Props) {
    const imageSrc = event.event_media?.find(v => v.is_featured)?.image_url || event.event_media?.[0]?.image_url

    return (
        <main className="pb-20">
            <SectionHeading title="Events" />

            <div className="md:flex md:mt-20 global-px justify-between gap-8">

                {/* Left column — desktop only */}
                <div className="hidden md:block md:w-[45%]">
                    <figure>
                        {imageSrc ?
                            <Image
                                src={imageSrc}
                                alt={event.title}
                                width={900}
                                height={900}
                                className="rounded-4xl h-60 object-cover w-full md:h-96"
                            />
                            :
                            <Skeleton className="rounded-4xl h-60 object-cover w-full md:h-96" />
                        }
                    </figure>
                    <HostNAttendeeDetailsSection event={event} className="md:mt-8" />
                    <ContactHostForm event={event} /> 
                </div>

                {/* Right column */}
                <section className="mt-12 md:mt-0 md:w-[50%]">
                    {/* Mobile image */}
                    <figure className="md:hidden">
                        {imageSrc ?
                            <Image
                                src={imageSrc}
                                alt={event.title}
                                width={900}
                                height={900}
                                className="rounded-4xl h-[50%] max-w-full w-[32em] mx-auto object-cover"
                            />
                            :
                            <Skeleton className="rounded-4xl h-[50%] max-w-full w-[32em] mx-auto object-cover" />
                        }
                    </figure>

                    <EventOverviewSection event={event} />

                    <div className="md:hidden">
                        <ContactHostForm event={event} />
                    </div>
                </section>
            </div>

            {/* Mobile related events */}
            <div className="mt-20">
                <RelatedEventsYouMightLike events={relatedEvents} />
            </div>
        </main>
    )
}