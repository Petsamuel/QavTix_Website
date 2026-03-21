import { cn } from "@/lib/utils";
import { useState } from "react";

export default function FollowHostBtn1({ className }:{ className?: string }){

    const [openModal,setOpenModal] = useState(false)

    return (
        <>
            <button onClick={() => setOpenModal(true)} className={cn(
                className,
                "p-3 rounded-3xl bg-secondary-6 text-white font-medium text-sm w-36",
                "hover:bg-secondary-7 hover:shadow-md hover:opacity-95"
            )}
            >
                Follow
            </button>
        </>
    )
}