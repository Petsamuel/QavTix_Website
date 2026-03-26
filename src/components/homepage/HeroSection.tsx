"use client"

import { space_grotesk } from "@/lib/fonts";
import { EventSearchFilters } from "./EventSearchFilter";
import InfiniteScrollImages from "./InfiniteScrollImages";
import { Icon } from "@iconify/react";
import SlantedCardCarousel from "./SlantedCardCarousel";
import { useRef } from "react";
import { slides_onlyImages } from "@/components-data/auth-pages/slides";
import { ApiCategory } from "@/actions/filters";

export default function HeroSection({ categories }:{ categories: ApiCategory[] }){

    const mobileInfiniteScrollRef = useRef(null)
    
    const handleScrollDown = () => {
        window.scrollBy({
            top: 600,
            behavior: 'smooth',
        })
    }
    
    return (
        <section className="md:pe-0! md:flex justify-between min-h-svh overflow-x-hidden">
            <div className="md:w-[48%] py-32">
                <div className="global-px">
                    <h1 className={`${space_grotesk.className} leading-tight text-primary-6 text-center text-[clamp(2.5rem,4vw,4.5rem)] md:leading-[1.1] md:text-left font-medium`}>
                        Discover <span className="text-secondary-9 md:block">Your Next</span> Experience
                    </h1>
                    <p className="text-neutral-8 text-center mt-[2vh] md:text-left text-[clamp(0.875rem,1vw,1.125rem)] md:max-w-sm">
                        From Concerts to travel, find and book tickets for everything you love
                    </p>
                    <button 
                        onClick={handleScrollDown} 
                        className="flex md:hidden mx-auto flex-col items-center justify-center text-neutral-7 mt-[3vh]"
                    >
                        <Icon icon="iconamoon:mouse-thin" width="32" height="32" />
                        <span className="text-xs">Tap to scroll</span>
                    </button>
                </div>
                <SlantedCardCarousel 
                    className="md:hidden" 
                    images={slides_onlyImages} 
                    ref={mobileInfiniteScrollRef} 
                />
                <div className="global-px">
                    <EventSearchFilters categories={categories} />
                </div>
            </div>
            <div className='hidden relative md:block w-[48%] bg-primary-1 py-[12vh] md:pb-0 md:pt-[22vh]'>
                <InfiniteScrollImages />
            </div>
        </section>
    )
}