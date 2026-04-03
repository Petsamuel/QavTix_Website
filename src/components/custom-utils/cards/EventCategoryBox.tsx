'use client'

import Link from "next/link"
import { CustomIcons } from "../../Svg-Icons"
import { space_grotesk } from "@/lib/fonts"
import { EventCategory, getEventCategoryLabel } from "@/components-data/event-category"
import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import { cn } from "@/lib/utils"

const categoryIcons = {
    [EventCategory.ConcertAndMusic.value]:      CustomIcons.musicConcerts,
    [EventCategory.SportAndFitness.value]:      CustomIcons.sportAndFitness,
    [EventCategory.ArtAndTheater.value]:        CustomIcons.artsAndTheater,
    [EventCategory.FoodAndDrinking.value]:      CustomIcons.foodAndDrink,
    [EventCategory.Festivals.value]:            CustomIcons.festival,
    [EventCategory.BusinessAndNetworking.value]:CustomIcons.briefCase,
    [EventCategory.TravelsAndTours.value]:      CustomIcons.travel,
    [EventCategory.NightlifeAndParties.value]:  CustomIcons.djIcon,
} as const

const iconStyles = cn(
    'text-secondary-9 size-14 md:size-16',
    'group-hover:scale-110 group-hover:text-white',
    'transition-transform duration-300 ease-out'
)

interface EventCategoryBoxProps {
    value: keyof typeof categoryIcons
}

export default function EventCategoryBox({ value }: EventCategoryBoxProps) {
    const IconComponent = categoryIcons[value]

    // Find the path for this category value
    const categoryEntry = Object.values(EventCategory).find(c => c.value === value)
    const href = categoryEntry
        ? NAV_LINKS.EVENT_CATEGORY.href.replace("[category_name]", categoryEntry.path)
        : "#"

    return (
        <Link
            href={href}
            className="group relative bg-neutral-3 rounded-[18.4px] flex flex-col items-center justify-end h-52 sm:h-60 px-6 pt-4 pb-10 overflow-hidden hover:scale-104 ease-in-out duration-150"
            aria-label={`Browse ${getEventCategoryLabel(value)} events`}
        >
            <div className="absolute inset-0 bg-secondary-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out rounded-[18.4px]" />

            <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                {IconComponent && (
                    <IconComponent className={iconStyles} />
                )}

                <h3 className={cn(
                    space_grotesk.className,
                    'text-neutral-9 text-sm sm:text-lg lg:text-xl text-center capitalize font-medium',
                    'group-hover:text-white group-hover:font-bold sm:group-hover:text-xl lg:group-hover:text-2xl',
                    'transition-all duration-300 ease-out'
                )}>
                    {getEventCategoryLabel(value)}
                </h3>
            </div>

            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-300 ease-out rounded-[18.4px]" />
        </Link>
    )
}