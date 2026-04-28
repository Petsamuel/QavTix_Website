import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";

export default function CloseBtn({ action, icon, className }: { className?: string, icon?: string, action: () => void }) {
    return (
        <button
            onClick={action}
            aria-label="Close"
            className="w-fit h-fit"
        >
            <Icon
                icon={icon || "grommet-icons:close"}
                width="22"
                height="22"
                className={cn("text-[#1E1E1E] hover:text-red-700", className)}
            />
        </button>
    )
}