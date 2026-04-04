import type { Metadata, Viewport } from "next"

const SITE_NAME    = "QavTix"
const SITE_URL     = process.env.NEXT_PUBLIC_APP_URL ?? "https://qavtix.com"
const SITE_TAGLINE = "Discover, Book & Experience Events"
const DESCRIPTION  = "QavTix is your one-stop platform to discover concerts, festivals, sports, business events and more. Buy tickets, host events, and connect with your community."
const OG_IMAGE     = `${SITE_URL}/images/og-default.png`

const KEYWORDS = [
    "event tickets", "buy tickets online", "concerts Nigeria", "festivals Lagos",
    "event booking", "event management", "ticket platform", "live events",
    "QavTix", "event hosting", "sell tickets", "event discovery",
    "Nigeria events", "Africa events", "ticket marketplace", "corporate events", "music concerts",
]

// Base metadata applied to every page
export const siteMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),

    title: {
        default:  `${SITE_NAME} — ${SITE_TAGLINE}`,
        template: `%s | ${SITE_NAME}`,
    },

    description: DESCRIPTION,
    keywords:    KEYWORDS,
    authors:     [{ name: "QavTix" }],
    creator:     "QavTix",
    publisher:   "QavTix",

    openGraph: {
        type:        "website",
        locale:      "en_NG",
        url:         SITE_URL,
        siteName:    SITE_NAME,
        title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: DESCRIPTION,
        images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — ${SITE_TAGLINE}` }],
    },

    twitter: {
        card:        "summary_large_image",
        site:        "@qavtix",
        creator:     "@qavtix",
        title:       `${SITE_NAME} — ${SITE_TAGLINE}`,
        description: DESCRIPTION,
        images:      [OG_IMAGE],
    },

    robots: {
        index:          true,
        follow:         true,
        googleBot: {
            index:               true,
            follow:              true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet":       -1,
        },
    },

    manifest: "/site.webmanifest",

    alternates: {
        canonical: SITE_URL,
    },
}

export const siteViewport: Viewport = {
    themeColor:    "#0052CC",
    width:         "device-width",
    initialScale:  1,
    maximumScale:  5,
}

// Per-page metadata helpers

export function buildPageMetadata(
    title:          string,
    description?:   string,
    path?:          string,
    imageUrl?:      string,
): Metadata {
    const url    = path ? `${SITE_URL}${path}` : SITE_URL
    const image  = imageUrl ?? OG_IMAGE
    const desc   = description ?? DESCRIPTION

    return {
        title,
        description: desc,
        alternates:  { canonical: url },
        openGraph: {
            title,
            description: desc,
            url,
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            title,
            description: desc,
            images: [image],
        },
    }
}

/** For event detail pages — rich structured data (JSON-LD) */
export function buildEventJsonLd(event: {
    id:             string
    title:          string
    full_description: string
    start_datetime: string
    end_datetime?:  string
    event_location: { venue_name: string; address: string; city: string; country: string }
    tickets?:       { price: string }[]
    organizer_display_name: string
}) {
    const minPrice = event.tickets?.length
        ? Math.min(...event.tickets.map(t => parseFloat(t.price)))
        : undefined

    return {
        "@context":   "https://schema.org",
        "@type":      "Event",
        name:         event.title,
        description:  event.full_description,
        startDate:    event.start_datetime,
        endDate:      event.end_datetime,
        eventStatus:  "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
            "@type":  "Place",
            name:     event.event_location.venue_name,
            address: {
                "@type":          "PostalAddress",
                streetAddress:    event.event_location.address,
                addressLocality:  event.event_location.city,
                addressCountry:   event.event_location.country,
            },
        },
        organizer: {
            "@type": "Organization",
            name:    event.organizer_display_name,
        },
        url: `${SITE_URL}/events/details/${event.id}`,
        ...(minPrice != null && {
            offers: {
                "@type":       "Offer",
                priceCurrency: "NGN",
                price:         minPrice,
                availability:  "https://schema.org/InStock",
                url:           `${SITE_URL}/events/details/${event.id}`,
            }
        }),
    }
}