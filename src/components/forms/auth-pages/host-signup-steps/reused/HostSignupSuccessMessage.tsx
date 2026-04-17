"use client"

import { space_grotesk } from "@/lib/fonts"
import Image from "next/image"
import ActionButton2 from "@/components/custom-utils/buttons/ActionButton2"
import ActionButton1 from "@/components/custom-utils/buttons/ActionButton1"
import { useRouter } from "next/navigation"
import { AnimatedDialog } from "@/components/custom-utils/AnimatedDialog"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"


export default function HostSignUpSuccessMessage() {
    const router = useRouter()

    return (
        <AnimatedDialog open={true} showCloseButton={false} className="rounded-[40px]" childrenContainerStyles="px-8 pt-0! pb-10">
            <div className="text-center relative overflow-hidden">
                <Image
                    src="/images/vectors/confetti.svg"
                    alt="" aria-hidden="true"
                    width={500} height={400}
                    className="block md:hidden absolute w-full top-0 left-0 pointer-events-none select-none"
                />
                <Image
                    src="/images/vectors/confetti-lg.svg"
                    alt="" aria-hidden="true"
                    width={500} height={400}
                    className="hidden md:block absolute w-full top-0 left-0 pointer-events-none select-none"
                />

                <div className="relative z-10 mt-10">
                    <Image
                        src="/images/vectors/success-indicator2.svg"
                        alt="Success Indicator"
                        width={190} height={190}
                        className="mx-auto mb-4 size-32 lg:size-36"
                    />

                    <DialogTitle className={`text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>
                        Welcome to QavTix.
                    </DialogTitle>
                    <DialogDescription className="text-neutral-7 text-sm">
                        Your QavTix host account is active. You're just a few clicks away from your best experience yet.
                    </DialogDescription>

                    <div className="flex flex-col gap-3 mt-8 sm:flex-row">
                        <ActionButton2
                            buttonText="Go to dashboard"
                            action={() => router.push(NAV_LINKS.DASHBOARD.href)}
                            className="bg-white w-1/2!"
                        />
                        <ActionButton1
                            buttonText="Explore Events"
                            action={() => router.push(NAV_LINKS.EVENTS.href)}
                            className="whitespace-nowrap w-1/2"
                        />
                    </div>

                    <button
                        onClick={() => {}}
                        className="w-fit mx-auto block font-medium text-sm mt-6 text-accent-6"
                    >
                        Watch tutorial video
                    </button>
                </div>
            </div>
        </AnimatedDialog>
    )
}