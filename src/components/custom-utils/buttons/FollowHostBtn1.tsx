import { cn } from "@/lib/utils"

interface Props {
    isFollowing: boolean
    onClick:     (e: React.MouseEvent<HTMLButtonElement>) => void
    className?:  string
}

export default function FollowHostBtn1({ isFollowing, onClick, className }: Props) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-3 rounded-3xl font-medium text-sm w-36 transition-all duration-200",
                "hover:shadow-md active:scale-[0.98]",
                isFollowing
                    ? "bg-white text-secondary-7 border-2 border-secondary-3 hover:bg-neutral-2 hover:border-secondary-5"
                    : "bg-secondary-6 text-white hover:bg-secondary-7 hover:opacity-95",
                className,
            )}
        >
            {isFollowing ? "Following" : "Follow"}
        </button>
    )
}