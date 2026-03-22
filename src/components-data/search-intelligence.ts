//────────────
// QavTix Search Intelligence
// Determines query intent before hitting the API.
// No AI — pure keyword/pattern matching. Fast, free, offline-capable.
//────────────

import { NAV_LINKS } from "@/components-data/navigation/navLinks"
import { EVENT_CATEGORIES_ARRAY } from "@/components-data/event-category"


// Page map
const PAGE_MAP: Array<{
    keywords: string[]
    label:    string
    desc:     string
    href:     string
    icon:     string
}> = [
    {
        keywords: ['about', 'company', 'who', 'team', 'story'],
        label:    'About Us',
        desc:     'Learn about QavTix and our mission',
        href:     NAV_LINKS.ABOUT.href,
        icon:     'hugeicons:information-circle',
    },
    {
        keywords: ['how', 'works', 'guide', 'start', 'use', 'begin', 'getting started'],
        label:    'How It Works',
        desc:     'Step-by-step guide to using QavTix',
        href:     NAV_LINKS.HOW_IT_WORKS.href,
        icon:     'hugeicons:idea',
    },
    {
        keywords: ['price', 'pricing', 'plan', 'cost', 'fee', 'subscription', 'free', 'pro', 'enterprise'],
        label:    'Pricing',
        desc:     'View host and attendee pricing plans',
        href:     NAV_LINKS.PRICING.href,
        icon:     'hugeicons:money-bag-01',
    },
    {
        keywords: ['faq', 'question', 'help', 'answer', 'common'],
        label:    'FAQ',
        desc:     'Frequently asked questions',
        href:     NAV_LINKS.FAQ.href,
        icon:     'hugeicons:help-circle',
    },
    {
        keywords: ['contact', 'support', 'reach', 'email', 'message', 'talk', 'complaint', 'issue', 'problem', 'refund', 'dispute'],
        label:    'Contact Us',
        desc:     'Get in touch with our support team',
        href:     NAV_LINKS.CONTACT_US.href,
        icon:     'hugeicons:customer-support',
    },
    {
        keywords: ['sign in', 'login', 'log in', 'signin', 'account'],
        label:    'Sign In',
        desc:     'Log in to your QavTix account',
        href:     NAV_LINKS.SIGN_IN.href,
        icon:     'hugeicons:login-01',
    },
    {
        keywords: ['sign up', 'register', 'create account', 'join', 'get started'],
        label:    'Create Account',
        desc:     'Create your free QavTix account',
        href:     NAV_LINKS.SIGN_UP.href,
        icon:     'hugeicons:user-add-01',
    },
    {
        keywords: ['event', 'browse', 'explore', 'discover', 'upcoming'],
        label:    'Explore Events',
        desc:     'Browse all upcoming events',
        href:     NAV_LINKS.EVENTS.href,
        icon:     'hugeicons:calendar-03',
    },
]

// Category map
const CATEGORY_PAGE_MAP = EVENT_CATEGORIES_ARRAY.map(cat => ({
    keywords: [cat.label.toLowerCase(), cat.value.replace(/_/g, ' '), cat.path.replace(/-/g, ' ')],
    label:    cat.label,
    desc:     `Browse ${cat.label} events`,
    href:     `/events/explore/category/${cat.path}`,
    icon:     'hugeicons:ticket-01',
}))

// Support keywords — things that should go to contact/faq 
const SUPPORT_KEYWORDS = [
    'refund', 'cancel', 'dispute', 'fraud', 'scam', 'problem',
    'issue', 'error', 'broken', 'not working', 'complaint', 'help me',
]

// Core function
export function resolveSearchIntent(query: string): SearchResult {
    const q = query.trim().toLowerCase()

    if (!q) return { intent: 'empty', suggestions: [] }

    const suggestions: PageSuggestion[] = []

    //  Check support keywords first — highest priority
    const isSupport = SUPPORT_KEYWORDS.some(k => q.includes(k))
    if (isSupport) {
        return {
            intent: 'support',
            suggestions: [
                { label: 'Contact Us',   description: 'Our support team is ready to help',   href: NAV_LINKS.CONTACT_US.href, icon: 'hugeicons:customer-support' },
                { label: 'FAQ',          description: 'Find answers to common questions',      href: NAV_LINKS.FAQ.href,        icon: 'hugeicons:help-circle'       },
            ],
        }
    }

    // Category match
    for (const cat of CATEGORY_PAGE_MAP) {
        if (cat.keywords.some(k => q.includes(k) || k.includes(q))) {
            suggestions.push({ label: cat.label, description: cat.desc, href: cat.href, icon: cat.icon })
        }
    }

    //  Page match
    for (const page of PAGE_MAP) {
        if (page.keywords.some(k => q.includes(k) || k.includes(q))) {
            suggestions.push({ label: page.label, description: page.desc, href: page.href, icon: page.icon })
        }
    }

    // If we found page/category suggestions, return them
    if (suggestions.length > 0) {
        const intent: SearchIntent = suggestions[0].href.includes('/category/') ? 'category' : 'page'
        return { intent, suggestions: suggestions.slice(0, 4) }
    }

    // Default — treat as event search, hit the API
    return { intent: 'event', suggestions: [] }
}