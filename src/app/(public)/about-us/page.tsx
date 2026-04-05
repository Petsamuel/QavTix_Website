import TeamLeadersSection from "@/components/about-page/TeamLeadersSection";
import WhyChooseUsSection from "@/components/about-page/WhyChooseUsSection";
import YourGatewaySection from "@/components/about-page/YourGatewaySection";
import SectionHeading from "@/components/shared/SectionHeading";
import { buildPageMetadata } from "@/metadata";
import { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata(
    "About Us",
    "Learn about QavTix — our mission, team, and commitment to making event experiences seamless for hosts and attendees across Africa.",
    "/about-us",
)

export default function AboutUsPage(){
    return (
        <main className="">
            <SectionHeading title="About" />

            <YourGatewaySection />
            <WhyChooseUsSection />
            <TeamLeadersSection />
        </main>
    )
}