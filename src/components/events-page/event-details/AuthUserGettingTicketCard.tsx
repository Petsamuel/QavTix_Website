'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { space_grotesk } from '@/lib/fonts'
import { useTicketUser } from '@/contexts/TicketUserProvider'
import Link from 'next/link'
import { EVENT_ROUTES, NAV_LINKS } from '@/components-data/navigation/navLinks'
import { useState } from 'react'
import CancelTicketPrompt from '@/components/modals/CancelTicketPrompt'
import { formatCountdown } from '@/helper-fns/date-utils'
import CustomAvatar from '@/components/custom-utils/avatars/CustomAvatar'
import AddToCalendarButton from '@/components/custom-utils/buttons/AddToCalendar'
import { formatLocation } from '@/components/custom-utils/cards/resources/event-card-adapter'
import ShareEventModal from '@/components/modals/ShareEventModal'
import { useRouter } from 'next/navigation'
import LiquidLink from '@/components/custom-utils/buttons/LiquidGlassLink'


export default function AuthUserGettingTicketCard({ event }: { event: EventDetails }) {

    const [showCancelTicketPrompt, setShowCancelTicketPrompt] = useState(false)
    const { user } = useTicketUser()
    const [showShare, setShowShare] = useState(false)
    const router = useRouter()
    const eventUrl = `${process.env.NEXT_PUBLIC_APP_DOMAIN}${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", event.id)}`


    const handleShare = () => {
        setShowShare(true)
    }

    return (
        <div className="mt-12">
            <div className="md:flex md:items-stretch space-y-5 md:space-y-0 gap-[4%]">
                <div className="bg-accent-1 flex flex-col justify-between rounded-3xl p-5 relative w-full md:w-[60%] md:flex-1 min-h-40">
                    <div>
                        <Badge className="absolute font-medium top-4 right-4 bg-secondary-6 text-white">
                            Starting in <span className='text-accent-4'>{formatCountdown(event.start_datetime)}</span>
                        </Badge>

                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                            <Icon icon="hugeicons:ticket-03" width="24" height="24" className='text-accent-6' />
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

                <div className="w-full md:w-[36%] bg-secondary-1 flex flex-col gap-5 justify-between rounded-3xl p-5 min-h-40">
                    <CustomAvatar id={user?.id!} name={user?.full_name || "User"} textSize='14' profileImg="/images/demo-images/host-img.png" size="size-14" />

                    <p className={`${space_grotesk.className} text-base`}>
                        Won't make it for the event,{' '}
                        <button onClick={() => setShowCancelTicketPrompt(true)} className="text-orange-500 font-medium">cancel ticket</button>
                    </p>

                    <Link target="_blank" href={NAV_LINKS.DASHBOARD.href} className='flex items-center gap-1 font-medium text-primary-6'>
                        <span>Go to dashboard</span>
                        <Icon icon="mdi:arrow-up" width="21" height="21" className='text-primary-8 rotate-45' />
                    </Link>
                </div>
            </div>

            <LiquidLink
                href={`${EVENT_ROUTES.CHECKOUT.href.replace("[event_id]", event.id)}?returnTo=${encodeURIComponent(eventUrl)}`}
                className="bg-primary-6 w-fit mt-4 hover:bg-primary-7 text-white px-6 py-4 rounded-full font-medium transition-colors"
            >
                Get more tickets
            </LiquidLink>



            <CancelTicketPrompt
                open={showCancelTicketPrompt}
                setOpen={setShowCancelTicketPrompt}
                user_ticket_summary={event.user_ticket_summary || null}
            />

            <ShareEventModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                shareUrl={eventUrl}
                title={event.title}
            />
        </div>
    )
}