"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Props {
    isFollowing: boolean
    isPending?:  boolean
    onClick:     (e: React.MouseEvent<HTMLButtonElement>) => void
    className?:  string
}

export default function FollowHostBtn1({ isFollowing, isPending, onClick, className }: Props) {
    const [hovered, setHovered] = useState(false)

    return (
        <button
            onClick={onClick}
            disabled={isPending}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "inline-flex items-center justify-center gap-1.5 rounded-3xl font-medium text-sm",
                "w-28 py-2.5 transition-all duration-200 active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isFollowing
                    ? hovered
                        ? "border-[1.5px] border-red-300 text-red-500 bg-red-50"
                        : "border-[1.5px] border-neutral-6 text-secondary-7 bg-transparent"
                    : "bg-secondary-6 text-white hover:bg-secondary-7 hover:shadow-md",
                className,
            )}
        >
            {isPending ? (
                <span className="block w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : isFollowing ? (
                hovered ? "Unfollow" : "Following"
            ) : (
                "Follow"
            )}
        </button>
    )
}