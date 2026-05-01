"use server"

import { resolveCountryLabel } from "@/helper-fns/resolveCountryCode";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/cache-tags";

// ─── user location (never cached — reads request headers) ────────────────────

export async function getUserLocation(): Promise<{ city: string; country: string }> {
    const headersList = await headers()
    const city = headersList.get("x-vercel-ip-city") ?? "Lagos"
    const countryCode = headersList.get("x-vercel-ip-country") ?? "NG"
    return {
        city: decodeURIComponent(city),
        country: resolveCountryLabel(countryCode),
    }
}

// ─── revalidation helpers (call these from mutations) ────────────────────────

export async function revalidateEventCards() {
    revalidateTag(CACHE_TAGS.EVENT_CARDS, "max")
}

export async function revalidateEventDetails() {
    revalidateTag(CACHE_TAGS.EVENT_DETAILS, "max")
}