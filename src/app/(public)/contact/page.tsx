import ContactUsForm from "@/components/forms/contact-page/ContactUsForm";
import SectionHeading from "@/components/shared/SectionHeading";
import OfficeLocationTabs from "@/components/tabs/OfficeLocationTabs";
import { space_grotesk } from "@/lib/fonts";
import { buildPageMetadata } from "@/metadata";
import { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata(
    "Contact Us",
    "Get in touch with the QavTix support team. We're here to help with ticket issues, refunds, and event hosting enquiries.",
    "/contact",
)

export default function ContactPage(){
    return (
        <main>
            <SectionHeading title="Contact" />

            <div className="global-px pb-20">
                <section className="my-14 max-w-xl md:mb-20">
                    <h2 className={`${space_grotesk.className} font-bold text-2xl md:text-3xl lg:text-[2.5rem] text-secondary-9`}>We are always ready to help you, and answer your questions</h2>
                    <p className="text-neutral-8 mt-4">Do you have a question? A complaint? Or need any help regarding QavTix services. Feel free to reach out to us.</p>
                </section>


                <div className="md:flex flex-row-reverse lg:flex-row justify-between gap-8 lg:gap-16">
                    <div className="md:w-[45%]">
                        <ContactUsForm />
                    </div>
                    <div className="md:w-[45%]">
                        <OfficeLocationTabs />
                    </div>
                </div>
            </div>
        </main>
    )
}