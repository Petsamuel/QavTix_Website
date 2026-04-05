import SearchPage from "@/components/page-content-wrappers/SearchPageCW";
import { buildPageMetadata } from "@/metadata";
import { Metadata } from "next";

export const metadata: Metadata = buildPageMetadata(
    "Search Events",
    "Search for events, categories, or organizers on QavTix. Find what you're looking for.",
    "/search",
)

export default function PricingPage() {
    return <SearchPage />
}