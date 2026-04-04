import { NAV_LINKS } from "@/components-data/navigation/navLinks";
import SectionHeading from "@/components/shared/SectionHeading";
import FAQAccordionTab from "@/components/tabs/FAQAccordionTab";
import { space_grotesk } from "@/lib/fonts";
import Link from "next/link";


export default function FAQPage(){
    return (
        <main>
            <SectionHeading title="FAQ" />

            <div className="global-px pb-20">
                <section className="my-14 max-w-xl md:mb-20">
                    <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>Got questions about your tickets and events?</h2>
                    <p className="text-neutral-8 mt-4">
                        Get clear answers on buying tickets, accessing events, managing payments, and using our ticketing platform with ease. If you need further assistance, feel free to <Link href={NAV_LINKS.CONTACT_US.href} className="text-accent-6 font-medium">reach out</Link> — we’re here to help.
                    </p>
                </section>


                <FAQAccordionTab />
            </div>
        </main>
    )
}