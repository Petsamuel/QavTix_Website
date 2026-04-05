"use client"
import PricingContent from "@/components/pricing/PricingContent";
import SectionHeading from "@/components/shared/SectionHeading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";


export default function PricingPageCW(){
    const [activePricingTab, setActivePricingTab] = useState<AccountType>("host")
    const tabsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (tabsRef.current) {
                const yOffset = -15;
                const element = tabsRef.current;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                })
            }
        }, 800)

        return () => clearTimeout(timer)
    }, [])

    return (
        <main>
            <SectionHeading title="Pricing" />
            <div className="global-px pb-20 mt-16">
                <Tabs 
                    ref={tabsRef}
                    value={activePricingTab} 
                    onValueChange={(v) => setActivePricingTab(v as AccountType)} 
                    className="w-full max-w-7xl mx-auto"
                >
                    <TabsList className="grid max-w-full w-[14em] h-16 mx-auto border border-secondary-9 rounded-full grid-cols-2 mb-8 gap-2 bg-gray-50 p-1 lg:mb-20">
                        <TabsTrigger 
                            value="host" 
                            className="data-[state=active]:bg-primary-6 data-[state=active]:text-white text-secondary-9 shadow-none! drop-shadow-none font-medium rounded-full transition-all"
                        >
                            Host
                        </TabsTrigger>
                        <TabsTrigger 
                            value="attendee"
                            className="data-[state=active]:bg-primary-6 data-[state=active]:text-white text-secondary-9 shadow-none! drop-shadow-none font-medium rounded-full transition-all"
                        >
                            Attendee
                        </TabsTrigger>
                    </TabsList>
                    <PricingContent />
                </Tabs>
            </div>
        </main>
    )
}