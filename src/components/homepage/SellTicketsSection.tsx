"use client"

import { space_grotesk } from "@/lib/fonts"
import { ATTENDEE_SELL_TICKET, NAV_LINKS } from "@/components-data/navigation/navLinks"
import Link from "next/link"
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink"


export default function SellTicketsSection() {

    return (
        <section className="global-px mt-24 md:mt-14 mb-28 flex flex-col justify-center">
            <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}>
                Do you have tickets to sell?
            </h2>

            <p className="text-sm text-neutral-8 mt-4 max-w-sm mx-auto">
                Selling ticket has never been easier. Your one sure place to sell your tickets with no hassle.
            </p>

            <div className="w-full flex items-center mt-8 sm:justify-center md:mt-14 gap-4">
                <LiquidLink
                    href={ATTENDEE_SELL_TICKET}
                    target="_blank"
                    className="w-[45%] max-w-[10em] h-14 p-4 rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                >
                    Sell Ticket
                </LiquidLink>

                <Link
                    href={NAV_LINKS.FAQ.href}
                    className="w-[45%] max-w-[10em] h-14 text-secondary-8 bg-white p-4 hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                >
                    Learn More
                </Link>
            </div>
        </section>
    )
}