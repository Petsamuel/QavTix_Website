'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { space_grotesk } from '@/lib/fonts'
import Link from 'next/link'
import { AUTH_ROUTES, EVENT_ROUTES, NAV_LINKS } from '@/components-data/navigation/navLinks'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getGuestTicketSession, GuestTicketSession } from '@/actions/util/get-ticket-session'
import AddToCalendarButton from '@/components/custom-utils/buttons/AddToCalendar'
import { formatLocation } from '@/components/custom-utils/cards/resources/event-card-adapter'
import ShareEventModal from '@/components/modals/ShareEventModal'
import { formatCountdown } from '@/helper-fns/date-utils'
import LiquidLink from '@/components/custom-utils/buttons/LiquidGlassLink'

export default function GuestGettingTicketCard({ event }: { event: EventDetails }) {

    const [session, setSession] = useState<GuestTicketSession | null>(null)
    const [showShare, setShowShare] = useState(false)

    const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}`
    const countdown = formatCountdown(event.start_datetime)

    useEffect(() => {
        const s = getGuestTicketSession()
        if (s?.eventId === event.id) setSession(s)
    }, [event.id])

    if (!session) return null

    const handleShare = () => {
        setShowShare(true)
    }

    return (
        <>
            <div className="mt-12">
                <div className="md:flex md:items-stretch space-y-5 md:space-y-0 gap-[4%]">

                    {/* MAIN TICKET CARD */}
                    <div className="bg-accent-1 flex flex-col justify-between rounded-3xl p-5 relative w-full md:w-[60%] md:flex-1 min-h-40">
                        <div>
                            {countdown && (
                                <Badge className="absolute font-medium top-4 right-4 bg-secondary-6 text-white">
                                    Starting in <span className="text-accent-4 ml-1">{countdown}</span>
                                </Badge>
                            )}

                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                                <Icon icon="hugeicons:ticket-03" width="24" height="24" className="text-accent-6" />
                            </div>
                        </div>

                        <div>
                            <h3 className={`${space_grotesk.className} text-xl font-medium text-secondary-9 mb-6`}>
                                Your spot is secured
                            </h3>

                            <div className="flex justify-between gap-2">
                                <div className="flex gap-2">
                                    <AddToCalendarButton
                                        event={{
                                            title: event.title,
                                            description: event.short_description,
                                            location: formatLocation(event.event_location),
                                            startDate: event.start_datetime,
                                            endDate: event.end_datetime,
                                        }}
                                    />

                                    <Link
                                        href={NAV_LINKS.DASHBOARD.href}
                                        target="_blank"
                                        className="rounded-full border p-1 size-9 flex justify-center items-center border-neutral-8 bg-transparent hover:bg-accent-3 hover:border-accent-6 transition-all ease-linear"
                                    >
                                        <Icon icon="hugeicons:qr-code-01" width="23" height="23" />
                                    </Link>
                                </div>

                                {/* SHARE BUTTON */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleShare}
                                    className="rounded-full border p-1 border-neutral-8 bg-transparent hover:bg-accent-3 hover:border-accent-6 transition-all ease-linear"
                                >
                                    <Icon icon="hugeicons:share-08" width="24" height="24" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* SIGN IN PROMPT CARD */}
                    <div className="w-full md:w-[36%] bg-secondary-1 flex flex-col gap-5 justify-between rounded-3xl p-5 min-h-40">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                            <Icon icon="hugeicons:login-square-02" width="24" height="24" />
                        </div>

                        <p className={`${space_grotesk.className} text-base flex items-center gap-1`}>
                            Sign in to manage your ticket
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        aria-label="Why sign in"
                                        className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                    >
                                        <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Sign up with the same email you used on the ticket</p>
                                </TooltipContent>
                            </Tooltip>
                        </p>

                        <Link
                            href={`${AUTH_ROUTES.SIGN_IN.href}?returnTo=${encodeURIComponent(eventUrl)}`}
                            className="flex items-center gap-1 font-medium text-primary-6"
                        >
                            <span>Sign in</span>
                            <Icon icon="hugeicons:login-square-02" width="21" height="21" className="text-primary-8" />
                        </Link>
                    </div>
                </div>

                {/* GET MORE TICKETS — LINKS BACK TO THE EVENT PAGE */}
                <LiquidLink
                    href={`${eventUrl}/checkout`}
                    className="bg-primary-6 inline-block w-fit mt-4 hover:bg-primary-7 text-white px-6 py-4 rounded-full font-medium transition-colors"
                >
                    Get more tickets
                </LiquidLink>
            </div>

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
                title={event.title}
            />
        </>
    )
}