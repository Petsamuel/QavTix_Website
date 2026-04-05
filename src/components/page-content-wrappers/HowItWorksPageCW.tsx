"use client"

import { EVENT_ROUTES } from "@/components-data/navigation/navLinks";
import AttendeeFeaturesSections from "@/components/how-it-works/AttendeeFeaturesSections";
import HostFeaturesSections from "@/components/how-it-works/HostFeaturesSection";
import SectionHeading from "@/components/shared/SectionHeading";
import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HowItWorksPageCW(){

    const router = useRouter()

    return (
        <main className="pb-24">
            <SectionHeading title="How It Works" />

            <div className="global-px max-w-[95em] mx-auto">
                <div className="mt-8 md:mt-12 md:flex justify-between gap-7 items-center">
                    <div className="md:w-[45%]">
                        <div className="max-w-xl">
                            <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>Your all-in-one ticketing platform</h2>
                            <p className="text-neutral-7 mt-4">
                                QavTix makes event ticketing simple for both organizers and attendees.  Browse or sell tickets in three easy steps, with a seamless, secure experience from start to finish. Ready to jump in?
                            </p>
                            <button
                                onClick={() => router.push("/event/create")}
                                className="w-fit mt-10 md:mt-14 p-4 h-[4em] rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                            >
                                Get started for free
                            </button>
                        </div>
                    </div>

                    <div className="max-w-[98%] mt-20 md:mt-0 sm:max-w-[30em] mx-auto md:mx-0 md:max-w-[unset] md:w-[45%]">
                        <Image src="/images/vectors/illustration-img2.svg" alt="" aria-hidden="true" width={700} height={700} className="hidden md:block" />
                        <Image src="/images/vectors/illustration-img2-mobile.svg" alt="" aria-hidden="true" width={700} height={700} className="md:hidden" />
                    </div>
                </div>


                <AttendeeFeaturesSections />
                <HostFeaturesSections />


                <div className="max-w-lg sm:mx-auto sm:text-center mt-20">
                    <h2
                        className={`font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9 ${space_grotesk.className}`}
                    >
                        Ready to get started and experience QavTix?
                    </h2>

                    <p className="text-sm text-neutral-8 mt-5">
                        Join thousands of organizers and attendees who trust QavTix for hassle-free events. Create Event and Browse Events to unlock the full experience today!
                    </p>

                    <div className="flex items-center mt-8 sm:justify-center md:mt-14 gap-4">
                        <button
                            onClick={() => router.push(EVENT_ROUTES.EVENTS.href)}
                            className="w-[45%] max-w-[11em] p-4 h-[4em] rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                        >
                            Explore event
                        </button>


                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="w-[45%] max-w-[11em] text-secondary-8 bg-white p-4 h-[4em] hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                        >
                            Create Event
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}