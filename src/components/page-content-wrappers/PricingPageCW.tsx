"use client"
import PricingContent from "@/components/pricing/PricingContent";
import SectionHeading from "@/components/shared/SectionHeading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect, useRef } from "react";
import LiquidTabs from "../custom-utils/buttons/LiquidTabs";


export default function PricingPageCW() {
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
                    <LiquidTabs
                        value={activePricingTab}
                        onValueChange={(v) => setActivePricingTab(v as AccountType)}
                        options={[
                            { label: "Host", value: "host" },
                            { label: "Attendee", value: "attendee" },
                        ]}
                        className="w-[240px] mx-auto mb-8 lg:mb-20"
                    />
                    <PricingContent />
                </Tabs>
            </div>
        </main>
    )
}