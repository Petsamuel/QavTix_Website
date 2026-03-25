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
                "inline-flex items-center justify-center gap-1.5 rounded-3xl font-medium text-sm px-5 py-2.5 transition-all duration-200 active:scale-[0.98]",
                isFollowing
                    ? "bg-transparent! text-secondary-7 border-[1.5px] border-neutral-6 group"
                    : "bg-secondary-6 text-white hover:bg-secondary-7 hover:shadow-md",
                className,
            )}
        >
            {isFollowing ? (
                <span className="group-hover:hidden">Following</span>
            ) : (
                <span>Follow</span>
            )}
        </button>
    )
}