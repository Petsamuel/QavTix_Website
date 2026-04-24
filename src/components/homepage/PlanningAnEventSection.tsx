"use client"

import { space_grotesk } from "@/lib/fonts"
import Image from "next/image"
import { HOST_CREATE_EVENT, NAV_LINKS } from "@/components-data/navigation/navLinks"
import Link from "next/link"
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink"

export default function PlanningAnEventSection() {

    return (
        <section className="mb-8 global-px mt-12 md:flex justify-between gap-7 items-center">
            <div className="md:w-[45%]">
                <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                    Planning an event?
                </h2>

                <p className="text-sm text-neutral-8 mt-5">
                    We make it easy to create, promote, and sell tickets for your events, all in one place. Plus, reaching your target audience and onboarding them has never been easier.
                </p>

                <div className="flex items-center mt-8 justify-between sm:justify-start md:mt-14 gap-4">
                    <LiquidLink
                        href={HOST_CREATE_EVENT}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[45%] max-w-[11em] p-4 h-[4em] rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        Create an event
                    </LiquidLink>

                    <Link
                        href={NAV_LINKS.FAQ.href}
                        className="w-[45%] max-w-[11em] text-secondary-8 bg-white p-4 h-[4em] hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                    >
                        Learn More
                    </Link>
                </div>
            </div>

            <div className="max-w-[90%] mt-10 md:mt-0 sm:max-w-[30em] mx-auto md:mx-0 md:max-w-[unset] md:w-[45%]">
                <Image src="/images/vectors/illustration-img1.svg" alt="" aria-hidden="true" width={700} height={700} />
            </div>
        </section>
    )
}