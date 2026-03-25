"use client"

import SectionHeading from "@/components/shared/SectionHeading"
import Image from "next/image"
import EventOverviewSection from "./event-details/EventOverviewSection"
import HostNAttendeeDetailsSection from "./event-details/HostNAttendeeSection"
import RelatedEventsYouMightLike from "./event-details/RelatedEventsYouMightLike"
import ContactHostForm from "../forms/host/ContactHostForm"


interface Props {
    event: EventDetails
    relatedEvents: PublicPagesEvent[]
}

export default function EventDetailsPageContentContainer({ event, relatedEvents }: Props) {
    return (
        <main className="pb-20">
            <SectionHeading title="Events" />

            <div className="md:flex md:mt-20 global-px justify-between gap-8">

                {/* Left column — desktop only */}
                <div className="hidden md:block md:w-[45%]">
                    <figure>
                        <Image
                            src="/images/demo-images/event-detail-img.png"
                            alt={event.title}
                            width={900}
                            height={900}
                            className="rounded-4xl h-60 object-cover md:h-96"
                        />
                    </figure>
                    <HostNAttendeeDetailsSection event={event} className="md:mt-8" />
                    <ContactHostForm event={event} />
                </div>

                {/* Right column */}
                <section className="mt-12 md:mt-0 md:w-[50%]">
                    {/* Mobile image */}
                    <figure className="md:hidden">
                        <Image
                            src="/images/demo-images/event-detail-img.png"
                            alt={event.title}
                            width={900}
                            height={900}
                            className="rounded-4xl h-[50%] max-w-full w-[32em] mx-auto object-cover"
                        />
                    </figure>

                    <EventOverviewSection event={event} />

                    {/* Mobile host section */}
                    <div className="mt-10 md:hidden">
                        <HostNAttendeeDetailsSection event={event} />
                    </div>

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