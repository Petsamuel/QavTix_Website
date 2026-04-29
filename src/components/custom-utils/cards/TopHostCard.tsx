'use client'

import Link from 'next/link'
import { space_grotesk } from '@/lib/fonts'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import FollowHostBtn1 from '@/components/custom-utils/buttons/FollowHostBtn1'
import { NAV_LINKS } from '@/components-data/navigation/navLinks'
import { getAvatarColor } from '@/helper-fns/getAvatarColor'
import { getInitialsFromName } from '@/helper-fns/getInitialFromName'
import { useFollowHost } from '@/lib/custom-hooks/UseFollowHost'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import CustomAvatar from '../avatars/CustomAvatar'

interface Props {
    host: TrendingHost
    onMouseOver?: () => void
    onMouseLeave?: () => void
    className?: string
}

export default function TopHostCard({ host, onMouseOver, onMouseLeave, className = '' }: Props) {

    const { isFollowing, followersCount, isPending, toggle } = useFollowHost(
        host.id,
        host.is_following,
        host.followers,
    )

    const hostUrl = NAV_LINKS.HOST_PROFILE.href.replace("[host_id]", String(host.id))

    return (
        <Link
            href={hostUrl}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            className={`flex-[0_0_85%] sm:flex-[0_0_30%] lg:flex-[0_0_20%] min-w-0 flex justify-between items-center flex-col bg-secondary-1 rounded-3xl py-6 min-h-[19em] hover:shadow-lg hover:border hover:border-neutral-4 transition-all duration-200 focus:outline-none focus:ring-[1.5px] focus:ring-accent-5 focus:ring-offset-[1.5px] ${className}`}
            aria-label={`View ${host.business_name}'s profile`}
        >
            <CustomAvatar size="size-28" profileImg={host.profile_picture} id={host.id.toString()} name={host.business_name} />

            <div className='flex flex-col justify-center items-center'>
                <div className='flex items-center text-center gap-2 mb-1'>
                    <h3 className={`${space_grotesk.className} text-center text-lg font-medium text-secondary-9`}>
                        {host.business_name}
                    </h3>
                    <Icon
                        icon="ph:seal-check-fill"
                        width="20"
                        height="20"
                        className={cn(
                            "shrink-0",
                            !host.is_subscribed && !host.is_verified && "hidden",
                            (host.is_verified && host.is_subscribed) ? "text-[#FFCC00]" : host.is_verified ? "text-primary-5" : "text-neutral-5"
                        )}
                    />
                </div>
                <div className={`${space_grotesk.className} flex gap-3 text-xs font-medium text-neutral-8 items-center justify-center`}>
                    <span>
                        {/* Live local count — updates optimistically */}
                        <span className="text-neutral-7">{followersCount.toLocaleString()}</span> Followers
                    </span>
                    <hr className="w-px h-2 border border-neutral-6" />
                    <span>
                        <span className="text-neutral-7">{host.events_count}</span> Events
                    </span>
                </div>
            </div>

            <FollowHostBtn1
                isFollowing={isFollowing}
                isPending={isPending}
                onClick={(e) => {
                    e.preventDefault()
                    toggle()
                }}
            />
        </Link>
    )
}