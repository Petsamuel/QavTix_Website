"use client"

import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import ActionButton2 from "../custom-utils/buttons/ActionButton2";
import ActionButton1 from "../custom-utils/buttons/ActionButton1";
import { useRouter } from "next/navigation";
import Logo from "../layout/Logo";
import { NAV_LINKS } from "@/components-data/navigation/navLinks";

export default function SignUpSuccessMessage() {

    const router = useRouter()

    return (
        <div className="flex h-full justify-center w-full items-center flex-col pt-8 pb-12">
            <Image src="/images/vectors/confetti.svg" alt="" aria-hidden="true" width={500} height={400} className="block md:hidden absolute w-full top-0 left-0 right-0 mx-auto pointer-events-none select-none" />
            <Image src="/images/vectors/confetti-lg.svg" alt="" aria-hidden="true" width={500} height={400} className="hidden md:block absolute w-full top-0 left-0 right-0 mx-auto pointer-events-none select-none" />
            
            <div className="max-w-lg mx-auto global-px relative z-10">
                <div className="flex justify-center mb-10 md:mb-20">
                    <Logo />
                </div>
                <Image src="/images/vectors/success-indicator2.svg" alt="Success Indicator" width={190} height={190} className="mx-auto my-4 size-36 lg:size-40" />
                <div className="max-w-md mx-auto lg:mt-12">
                    <h2 className={`text-center text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>Welcome to QavTix.</h2>
                    <p className="text-center text-neutral-7 text-sm">
                        Your QavTix account is active.You’re just a few clicks away from your best experience yet.
                    </p>
                </div>


                <div className="flex flex-col gap-4 mt-12 w-full md:flex-row">
                    <ActionButton2 buttonText="Go to dashboard" action={() => router.push(NAV_LINKS.DASHBOARD.href)} className="bg-white"   />
                    <ActionButton1 buttonText="Explore Events" action={() => router.push(NAV_LINKS.EVENTS.href)} className="whitespace-nowrap" />
                </div>

                <button onClick={() => router.push(NAV_LINKS.FORGOT_PASSWORD.href)} className="w-fit mx-auto block font-medium text-sm mt-6 text-accent-6 text-center">Watch tutorial video</button>
            </div>
        </div>
    )
}