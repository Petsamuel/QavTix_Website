"use client"

import { space_grotesk } from "@/lib/fonts"
import ActionButton1 from "../custom-utils/buttons/ActionButton1"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import EventsCard from "../custom-utils/cards/EventCards"
import { fromPublicPagesEvent } from "../custom-utils/cards/resources/event-card-adapter"

interface Props {
  events:  PublicPagesEvent[],
  city?: string
}

export default function EventsNearYouSection({ events }: Props) {

  const router = useRouter()

  return (
    <section className="global-px">
      <div className="flex items-center justify-between gap-5">
        <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
          Events near you
        </h2>

        <ActionButton1
          buttonText="Explore Events"
          className="hidden! md:flex!"
          iconPosition="right"
          icon="iconoir:arrow-right"
          action={() => router.push(NAV_LINKS.EVENTS.href)}
        />
        <button
          onClick={() => router.push(NAV_LINKS.EVENTS.href)}
          className="text-sm md:hidden bg-primary hover:bg-primary-7 active:bg-primary-8 text-white p-2 rounded-full h-12 aspect-square font-medium transition-colors inline-flex items-center justify-center"
        >
          <Icon icon="lucide:arrow-up-right" width="20" height="20" className="text-white" />
        </button>
      </div>

      {events.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Icon icon="hugeicons:location-01" className="size-8 text-neutral-4" />
          <p className="text-sm font-medium text-secondary-7">No events found near you</p>
          <p className="text-xs text-neutral-6">Try exploring all events instead</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(14em,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-[repeat(auto-fit,minmax(16em,1fr))] gap-6 lg:gap-8 mt-10 justify-items-center md:justify-items-start">
          {events.map(event => (
            <EventsCard
              key={event.id}
              {...fromPublicPagesEvent(event)}
            />
          ))}
        </div>
      )}
    </section>
  )
}