import { space_grotesk } from "@/lib/fonts";
import { slides_onlyImages } from "@/components-data/auth-pages/slides";
import MobileInfiniteScroll from "../shared/MobileInfiniteScrollCarousel";

export default function YourGatewaySection(){
    return (
        <section className="mt-8 md:mt-12 lg:mt-16">
            <div className="global-px max-w-xl md:max-w-5xl">
                <h2
                    className={`text-2xl sm:text-3xl  md:text-[2rem] font-bold text-secondary-9 ${space_grotesk.className}`}
                >
                    Your gateway to unforgettable experiences
                </h2>
                <p className="text-neutral-8 text-sm mt-5 md:text-base">QavTix is a modern, multi-purpose ticketing platform designed to help you discover, book, and enjoy events with ease. From concerts and nightlife to business events, sports,tours, and theatre, QavTix connects you to everything you love (securely, instantly, and hassle free) anytime, anywhere.</p>
            </div>


            <div className="mt-8 pe-0!">
                <MobileInfiniteScroll images={slides_onlyImages} />
            </div>
        </section>
    )
}