import { space_grotesk } from "@/lib/fonts"
import CurrencySwitcher from "../settings/CurrencySwitcher"
import { hostPricingData, attendeePricingData } from "@/components-data/pricing-plans"
import PricingCard from "../custom-utils/cards/PricingCard"
import { TabsContent } from "../ui/tabs"
import MobileFeatureComparison from "./MobileFeatureComparison"
import { attendeesFaq, hostFaqData } from "@/components-data/faq-data"
import DesktopFeatureComparison from "./DesktopFeatureComparison"
import PricingFAQs from "./PricingFAQs"

export default function PricingContent() {
    return (
        <>
            {/* Host Tab*/}
            <TabsContent value="host">
                <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>
                    Pricing that grows with your events
                </h2>
                <p className="text-neutral-8 mt-4">
                    Start free and upgrade anytime. Whether you're hosting your first event or managing hundreds, QavTix offers flexible, fair pricing designed for organizers at every level.
                </p>

                <div className="my-12 flex justify-center items-center">
                    <CurrencySwitcher className="bg-primary-1!" />
                </div>

                <div className="grid grid-cols-1 gap-y-32 gap-x-10 sm:grid-cols-2 md:grid-cols-3">
                    {hostPricingData.plans.map((v, i) => (
                        <PricingCard index={i} key={v.id} plan={v} />
                    ))}
                </div>

                <div className="mt-24 md:mt-32">
                    <h2 className={`${space_grotesk.className} text-center text-xl md:text-2xl lg:text-[2rem] font-medium text-secondary-9 mb-6`}>
                        Feature comparison
                    </h2>
                    <MobileFeatureComparison data={hostPricingData} />
                    <DesktopFeatureComparison data={hostPricingData} />
                </div>

                <PricingFAQs data={hostFaqData} />
            </TabsContent>

            {/*Attendee Tab */}
            <TabsContent value="attendee">
                <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>
                    Pricing that fits every experience
                </h2>
                <p className="text-neutral-8 mt-4 max-w-3xl">
                    From free events to premium experiences — pay only for what you enjoy. Whether you're attending your first gathering or joining hundreds, QavTix gives you clear, fair pricing designed for attendees like you.
                </p>

                <div className="my-12 flex justify-center items-center">
                    <CurrencySwitcher className="bg-primary-1!" />
                </div>

                <div className="grid grid-cols-1 gap-y-32 gap-x-10 sm:grid-cols-2 md:grid-cols-3">
                    {attendeePricingData.plans.map((v, i) => (
                        <PricingCard index={i} key={v.id} plan={v} />
                    ))}
                </div>

                <div className="mt-24 md:mt-32">
                    <h2 className={`${space_grotesk.className} text-center text-xl md:text-2xl lg:text-[2rem] font-medium text-secondary-9 mb-6`}>
                        Feature comparison
                    </h2>
                    <MobileFeatureComparison data={attendeePricingData} />
                    <DesktopFeatureComparison data={attendeePricingData} />
                </div>

                <PricingFAQs data={attendeesFaq} />
            </TabsContent>
        </>
    )
}