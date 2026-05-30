"use client"

import { space_grotesk } from "@/lib/fonts"
import ActionButton1 from "../custom-utils/buttons/ActionButton1"
import { useRouter } from "next/navigation"
import { Icon } from "@iconify/react"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import EventsCard from "../custom-utils/cards/EventCards"
import { fromPublicPagesEvent } from "../custom-utils/cards/resources/event-card-adapter"
import { useEffect, useState } from "react"
import { TRENDING_EVENTS_ENDPOINT } from "@/endpoints"

interface Props {
    events: PublicPagesEvent[]
    city?: string
}

const MAX_DISPLAY = 8

export default function EventsNearYouSection({ events }: Props) {

    const router = useRouter()
    const [fallbackEvents, setFallbackEvents] = useState<PublicPagesEvent[]>([])
    const [isLoadingFallback, setIsLoadingFallback] = useState(false)

    const isFallback = events.length === 0
    const displayed = isFallback ? fallbackEvents : events.slice(0, MAX_DISPLAY)
    const heading = isFallback ? "Trending events" : "Events near you"

    useEffect(() => {
        if (isFallback) {
            setIsLoadingFallback(true)
            const fetchFallback = async () => {
                try {
                    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "")
                    const res = await fetch(`${base}/${TRENDING_EVENTS_ENDPOINT}`)
                    if (res.ok) {
                        const json = await res.json()
                        const data = json.data ?? json
                        setFallbackEvents((data.results ?? data).slice(0, MAX_DISPLAY))
                    }
                } catch (e) {
                    // ignore
                } finally {
                    setIsLoadingFallback(false)
                }
            }
            fetchFallback()
        }
    }, [isFallback])

    return (
        <section className="global-px">
            <div className="flex items-center justify-between gap-5">
                <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                    {heading}
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

            {isLoadingFallback ? (
                <div className="mt-10 flex items-center justify-center py-16">
                    <Icon icon="eos-icons:three-dots-loading" className="size-12 text-primary" />
                </div>
            ) : displayed.length === 0 ? (
                <div className="mt-10 flex flex-col items-center justify-center py-16 gap-3 text-center">
                    <Icon icon="hugeicons:location-01" className="size-8 text-neutral-4" />
                    <p className="text-sm font-medium text-secondary-7">No events found</p>
                    <p className="text-xs text-neutral-6">Try exploring all events instead</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-center items-center flex-wrap gap-6 lg:gap-8 md:grid grid-cols-3 lg:grid-cols-4 2xl:flex mt-10">
                        {displayed.map(event => (
                            <EventsCard
                                key={event.id}
                                {...fromPublicPagesEvent(event)}
                            />
                        ))}
                    </div>

                    {(isFallback ? fallbackEvents.length : events.length) > MAX_DISPLAY && (
                        <div className="flex justify-center mt-10">
                            <ActionButton1
                                buttonText="View More Events"
                                iconPosition="right"
                                icon="iconoir:arrow-right"
                                action={() => router.push(NAV_LINKS.EVENTS.href)}
                            />
                        </div>
                    )}
                </>
            )}
        </section>
    )
}