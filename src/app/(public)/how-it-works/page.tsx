"use client"

import { buildPageMetadata } from "@/metadata";
import { Metadata } from "next";
import HowItWorksPageCW from "@/components/page-content-wrappers/HowItWorksPageCW";

export const metadata: Metadata = buildPageMetadata(
    "How It Works",
    "New to QavTix? Learn how to discover events, buy tickets, and host your own events in just a few steps.",
    "/how-it-works",
)

export default function HowItWorksPage(){
    return <HowItWorksPageCW />
}