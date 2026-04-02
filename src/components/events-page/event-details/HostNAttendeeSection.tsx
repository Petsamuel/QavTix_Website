import { EVENT_ROUTES, NAV_LINKS } from "@/components-data/navigation/navLinks"
import FollowHostBtn1 from "@/components/custom-utils/buttons/FollowHostBtn1"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { useFollowHost } from "@/lib/custom-hooks/UseFollowHost"
import { mockAttendees } from "@/components-data/mock-attendees"

interface Props {
    event:      EventDetails
    className?: string
}

function AttendeeAvatars({ count, eventId }: { count: number; eventId: string }) {
    if (count === 0) return null

    const displayCount = Math.min(count, 3)

    return (
        <Link
            href={`${EVENT_ROUTES.EVENTS_DETAILS.href.replace("[event_id]", eventId)}/attendees`}
            aria-label="View event attendees"
            className="inline-flex focus:outline-none"
        >
            <div className="flex -space-x-1.5 shrink-0">
                {mockAttendees.slice(0, displayCount).map((attendee) => (
                    <Avatar key={attendee.id} className="ring-2 ring-background size-8">
                        {attendee.profile_picture && <AvatarImage src={attendee.profile_picture} alt={attendee.full_name} />}
                        <AvatarFallback className={`${getAvatarColor(attendee.id.toString())} text-white font-medium text-[10px]`}>
                            {getInitialsFromName(attendee.full_name)}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {count > 3 && (
                    <Avatar className="ring-2 ring-background size-9">
                        <AvatarFallback className="bg-primary-1 font-medium text-secondary-7 text-xs">
                            +{count - 3}
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        </Link>
    )
}

const HostNAttendeeDetailsSection = ({ event, className }: Props) => {

    const { isFollowing, toggle } = useFollowHost(event.organizer_id, event.is_following)

    return (
        <div className={cn(className)}>
            {/* Host row */}
            <div className={cn(
                "flex flex-wrap justify-between items-center gap-4",
                "md:justify-start md:gap-6"
            )}>
                <div className="flex items-center gap-2">
                    <Avatar className="ring-2 ring-background size-12">
                        <AvatarFallback className={`${getAvatarColor(event.organizer_display_name)} text-white font-medium`}>
                            {getInitialsFromName(event.organizer_display_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xs text-neutral-7">Hosted by</p>
                        <Link 
                            className="flex items-center text-secondary-9 text-sm"
                            href={NAV_LINKS.HOST_PROFILE.href.replace('[host_id]', event.organizer_id)}
                            >
                            <strong className="font-normal whitespace-nowrap capitalize">{event.organizer_display_name}</strong>
                            <Icon icon="line-md:chevron-right" width="20" height="20" />
                        </Link>
                    </div>
                </div>
                <FollowHostBtn1
                    isFollowing={isFollowing}
                    onClick={(e) => { e.preventDefault(); toggle() }}
                    className={cn("w-auto! px-4", "md:px-6")}
                />
            </div>

            {/* Attendees */}
            <h3 className={cn(space_grotesk.className, "text-secondary-9 font-medium mt-8 mb-4")}>
                Attendees
            </h3>

            {event.attendees_count > 0 ? (
                <>
                    <AttendeeAvatars count={event.attendees_count} eventId={event.id} />
                    <p className="text-neutral-7 mt-1 text-sm">
                        {event.attendees_count} {event.attendees_count === 1 ? "person is" : "people are"} attending
                    </p>
                </>
            ) : (
                <p className="text-neutral-6 text-sm">Be the first to attend!</p>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center mt-7">
                    {event.tags.map((tag, i) => (
                        <Badge
                            key={`${tag}-${i}`}
                            variant="default"
                            className="py-1 px-2 bg-accent-1 text-accent-7 rounded-2xl text-center text-sm font-medium capitalize"
                        >
                            #{tag.replace(/\s+/g, "")}
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}

export default HostNAttendeeDetailsSection;