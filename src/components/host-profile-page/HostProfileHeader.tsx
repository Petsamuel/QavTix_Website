'use client'

import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useFollowHost } from "@/lib/custom-hooks/UseFollowHost"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColor } from "@/helper-fns/getAvatarColor"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"


const PLATFORM_ICONS: Record<string, string> = {
    twitter:   "hugeicons:new-twitter",
    instagram: "hugeicons:instagram",
    instagrame: "hugeicons:instagram",
    youtube:   "mynaui:youtube-solid",
    tiktok:    "ic:baseline-tiktok",
    facebook:  "fa6-brands:facebook",
    website:   "humbleicons:globe",
    linkedin:  "hugeicons:linkedin-01",
}

interface Props {
    host: HostDetails
}

export default function HostProfilePageHeader({ host }: Props) {

    const { isFollowing, toggle } = useFollowHost(host.id, host.is_following)

    const socialLinks = host.relevant_links.flatMap(obj =>
        Object.entries(obj)
            .filter(([, url]) => url && url !== "string")
            .map(([platform, url]) => ({ platform, url }))
    )

    const followBtn = (className?: string) => (
        <button
            onClick={toggle}
            className={cn(
                "p-3 rounded-4xl font-medium text-sm w-34 h-12 transition-all duration-200 hover:shadow-md active:scale-[0.98]",
                isFollowing
                    ? "bg-white text-secondary-7 border-2 border-secondary-3 hover:bg-neutral-2"
                    : "bg-secondary-6 text-white hover:bg-secondary-7",
                className,
            )}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    )

    return (
        <section>
            <div>
                <div className="h-72 md:h-96 relative mb-20 md:mb-16">
                    <div className="rounded-[50px] h-full overflow-hidden bg-linear-to-br from-primary-2 via-primary-3 to-slate-200" />

                    <div className="bg-white p-3 rounded-full -bottom-16 absolute w-fit">
                        <Avatar className="w-[6.25em] md:w-36 aspect-square h-auto rounded-full">
                            <AvatarFallback
                                className={cn(
                                    getAvatarColor(String(host.id)),
                                    "text-white font-bold text-3xl md:text-5xl w-full h-full rounded-full flex items-center justify-center"
                                )}
                            >
                                {getInitialsFromName(host.host)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div>
                    <div className="hidden md:flex justify-end -translate-y-10">
                        {followBtn()}
                    </div>

                    <div className="md:flex justify-between items-start gap-10">
                        <div className="flex-1 max-w-xl">
                            <h1 className={`${space_grotesk.className} text-2xl font-medium text-secondary-9 mb-3`}>
                                {host.host}
                            </h1>
                            <p className="text-neutral-7">{host.description}</p>

                            {socialLinks.length > 0 && (
                                <div className="flex gap-3 mt-5">
                                    {socialLinks.map(({ platform, url }, i) => (
                                        <a
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
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="mt-10 md:mt-0 flex flex-wrap justify-between items-center gap-5">
                            <div className="flex gap-6 font-medium text-neutral-8 items-center">
                                <span className={`${space_grotesk.className} flex flex-col gap-1`}>
                                    <span className="text-neutral-7">{host.followers_count.toLocaleString()}</span>
                                    <span>Followers</span>
                                </span>
                                <hr className="w-px h-8 border border-neutral-6" />
                                <span className="flex flex-col gap-1">
                                    <span className="text-neutral-7">{host.events_count}</span>
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