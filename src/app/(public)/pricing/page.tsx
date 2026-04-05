import PricingPageCW from "@/components/page-content-wrappers/PricingPageCW"
import { buildPageMetadata } from "@/metadata"
import { Metadata } from "next"

export const metadata: Metadata = buildPageMetadata(
    "Pricing",
    "Transparent, flexible pricing for hosts and attendees. Start free, upgrade when you're ready. No hidden fees.",
    "/pricing",
)

export default function PricingPage() {
  return <PricingPageCW />
}