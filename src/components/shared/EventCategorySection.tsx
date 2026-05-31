import { EVENT_CATEGORIES_ARRAY } from "@/components-data/event-category";
import EventCategoryBox from "../custom-utils/cards/EventCategoryBox";
import { space_grotesk } from "@/lib/fonts";

export default function EventCategorySection(){
    return (
        <section className="md:mt-20 global-px">
            <div className="text-center">
                <h2 className={`${space_grotesk.className} font-bold text-[2rem] text-secondary-9 mb-3`}>We’ve got you!</h2>
                <p className="text-sm text-neutral-8">No one gets left out. We’ve got something for everyone, and finding events that make your vibe has never been easier.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 lg:gap-x-7 gap-y-7 mt-14">
                {
                    EVENT_CATEGORIES_ARRAY.map((v,index) => (
                        <EventCategoryBox value={v.value} key={`${v.value}-${index}`} />
                    ))
                }
            </div>
        </section>
    )
}