import { space_grotesk } from "@/lib/fonts";
import HowItWorksFeatureFilledCard from "../custom-utils/cards/HowItWorksFeatureFilledCard";
import { hostFeatures } from "@/components-data/howItWorks-data";

function HostFeaturesSections() {
    return (
        <section className="mt-16.5 md:mt-28 lg:h-170">
            <div className="max-w-xl md:text-center md:mx-auto">
                <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>For event host</h2>
                <p className="text-neutral-7 mt-4">
                    Whether you're hosting a concert, seminar, party, or tour, QavTix makes publishing your event simple. Customize your event page, add ticket types, set pricing, and go live instantly.
                </p>
            </div>


            <div className="mt-12 md:mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-10 md:gap-6 md:gap-y-20 items-stretch">
                {
                    hostFeatures.map((v,i) => (
                        <HowItWorksFeatureFilledCard feature={v} index={i} key={v.id} />
                    ))
                }
            </div>
        </section>
    )
}

export default HostFeaturesSections;