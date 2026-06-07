'use client'

import { useState } from "react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useFollowHost } from "@/lib/custom-hooks/UseFollowHost"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import Link from "next/link"
import Image from "next/image"

const PLATFORM_ICONS: Record<string, string> = {
    twitter: "hugeicons:new-twitter",
    instagram: "hugeicons:instagram",
    instagrame: "hugeicons:instagram",
    youtube: "mynaui:youtube-solid",
    tiktok: "ic:baseline-tiktok",
    facebook: "fa6-brands:facebook",
    website: "humbleicons:globe",
    linkedin: "mdi:linkedin",
}

function getPlatformFromUrl(url: string) {
    const lowerUrl = url.toLowerCase()
    if (lowerUrl.includes('facebook.com')) return 'facebook'
    if (lowerUrl.includes('instagram.com')) return 'instagram'
    if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter.com')) return 'twitter'
    if (lowerUrl.includes('tiktok.com')) return 'tiktok'
    if (lowerUrl.includes('linkedin.com')) return 'linkedin'
    if (lowerUrl.includes('youtube.com')) return 'youtube'
    return 'website'
}

interface Props {
    host: HostDetails
}

export default function HostProfilePageHeader({ host }: Props) {

    const { isFollowing, followersCount, isPending, toggle } = useFollowHost(
        host.id,
        host.is_following,
        host.followers_count,
    )

    const socialLinks = (host.relevant_links || [])
        .map(obj => obj?.url)
        .filter((url): url is string => typeof url === "string" && url.trim().length > 0)
        .map((url) => ({ platform: getPlatformFromUrl(url), url }))

    const followBtn = (className?: string) => (
        <FollowButton
            isFollowing={isFollowing}
            isPending={isPending}
            onClick={toggle}
            className={className}
        />
    )

    return (
        <section>
            <div>
                <div className="h-72 md:h-96 relative mb-20 md:mb-16">
                    <div className="rounded-[50px] h-full overflow-hidden bg-linear-to-br from-primary-2 via-primary-3 to-slate-200">
                        {host.profile_banner && (
                            <Image
                                src={host.profile_banner}
                                alt={`${host.host} banner`}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                    </div>

                    {/* Avatar */}
                    <div className="bg-white p-2 rounded-full -bottom-16 absolute w-fit">
                        <div className="relative p-[3px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                            <Avatar className="w-[6.25em] md:w-36 aspect-square h-auto rounded-full relative z-10 !ring-0">
                                {host.profile_picture && (
                                    <AvatarImage
                                        src={host.profile_picture}
                                        alt={host.host}
                                        className="object-cover rounded-full"
                                    />
                                )}
                                <AvatarFallback className={cn(
                                    getAvatarColor(String(host.id)),
                                    "text-white font-bold text-3xl md:text-5xl w-full h-full rounded-full flex items-center justify-center"
                                )}>
                                    {getInitialsFromName(host.host || "User")}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="hidden md:flex justify-end -translate-y-10">
                        {followBtn()}
                    </div>

                    <div className="md:flex justify-between items-start gap-10">
                        <div className="flex-1 max-w-xl min-w-0">
                            <div className='flex items-center gap-2 mb-3'>
                                <h1 className={`${space_grotesk.className} text-2xl font-medium text-secondary-9`}>
                                    {host.host}
                                </h1>
                                <Icon
                                    icon="ph:seal-check-fill"
                                    width="20"
                                    height="20"
                                    className={cn(
                                        "shrink-0",
                                        !host.is_subscribed && !host.is_verified && "hidden",
                                        host.is_subscribed && "text-[#FFCC00]" || host.is_verified && "text-primary-5"
                                    )}
                                />
                            </div>
                            <p className="text-neutral-7 wrap-break-words overflow-hidden">{host.description}</p>

                            {socialLinks.length > 0 && (
                                <div className="flex gap-3 mt-5">
                                    {socialLinks.map(({ platform, url }, i) => (
                                        <Link
                                            key={i}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-neutral-7 hover:text-secondary-9 transition-colors"
                                        >
                                            <Icon
                                                icon={PLATFORM_ICONS[platform.toLowerCase()] ?? "humbleicons:globe"}
                                                className="size-5.5"
                                            />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-10 md:mt-0 flex flex-wrap justify-between items-center gap-5">
                            <div className="flex gap-6 font-medium text-neutral-8 items-center">
                                <span className={`${space_grotesk.className} flex flex-col gap-1`}>
                                    <span className="text-neutral-7">{followersCount?.toLocaleString() ?? "--"}</span>
                                    <span>Followers</span>
                                </span>
                                <hr className="w-px h-8 border border-neutral-6" />
                                <span className="flex flex-col gap-1">
                                    <span className="text-neutral-7">{host.events_count || "--"}</span>
                                    <span>Events</span>
                                </span>
                            </div>

                            {followBtn("md:hidden shrink-0 py-3 px-6 w-fit")}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


function FollowButton({
    isFollowing,
    isPending,
    onClick,
    className,
}: {
    isFollowing: boolean
    isPending: boolean
    onClick: () => void
    className?: string
}) {
    const [hovered, setHovered] = useState(false)

    return (
        <button
            onClick={onClick}
            disabled={isPending}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "p-3 rounded-4xl font-medium text-sm w-34 h-12",
                "transition-all duration-200 active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isFollowing
                    ? hovered
                        ? "bg-red-50 text-red-500 border-2 border-red-300"
                        : "bg-white text-secondary-7 border-2 border-secondary-3 hover:bg-neutral-2"
                    : "bg-secondary-6 text-white hover:bg-secondary-7 hover:shadow-md",
                className,
            )}
        >
            {isPending ? (
                <span className="flex items-center justify-center">
                    <span className="block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                </span>
            ) : isFollowing ? (
                hovered ? "Unfollow" : "Following"
            ) : (
                "Follow"
            )}
        </button>
    )
}