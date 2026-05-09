export interface NavLink {
  label: string
  href: string
  type?: 'default' | 'auth' | 'cta'
}

export const NAV_LINKS = {
  HOME: { label: 'Home', href: '/' },
  ABOUT: { label: 'About', href: '/about-us' },
  HOW_IT_WORKS: { label: 'How it works', href: '/how-it-works' },
  FAQ: { label: 'FAQ', href: '/faq' },
  CONTACT_US: { label: 'Contact Us', href: '/contact' },
  PRICING: { label: 'Pricing', href: '/pricing' },
  EVENTS: { label: 'Events', href: '/events' },

  SIGN_IN: { label: 'Sign in', href: '/auth/signin', type: 'auth' as const },
  SIGN_UP: { label: 'Get Started', href: '/auth/signup', type: 'cta' as const },
  FORGOT_PASSWORD: { label: 'Forgot password', href: '/auth/forgot-password' },
  RESET_PASSWORD: { label: 'Reset password', href: '/auth/reset-password' },

  // Role-based dashboard URLs — resolved at runtime using getDashboardUrl()
  DASHBOARD: { label: 'Dashboard', href: `${process.env.NEXT_PUBLIC_ATTENDEE_SITE}/dashboard`, type: 'auth' as const },

  SEARCH_EVENTS: { label: '', href: '/events/search' },
  EVENT_LOCATION: { label: '', href: '/events/explore/location/' },
  EVENT_CATEGORY: { label: '', href: '/events/explore/category/[category_name]/' },
  EVENT_TRAVEL_AND_TOUR: { label: '', href: '/events/explore/travel-and-tours/' },
  EVENTS_DETAILS: { label: '', href: '/events/details/[event_id]' },
  EVENTS_GET_TICKETS_CHECKOUT: { label: '', href: '/events/details/[event_id]/checkout' },

  HOST_PROFILE: { label: '', href: '/host/profile/[host_id]' },

  MARKETPLACE_EVENT_DETAILS: { label: '', href: '/events/marketplace/[event_id]' },
  MARKETPLACE_CHECKOUT: { label: '', href: '/events/marketplace/[ticket_id]/checkout' },
  DASHBOARD_MARKETPLACE: { label: '', href: `${process.env.NEXT_PUBLIC_ATTENDEE_SITE}/dashboard/marketplace` },

  SEARCH_PAGE: { label: '', href: '/search' },
} as const satisfies Record<string, NavLink>


// Unauthenticated nav
export const navLinks: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.PRICING,
  NAV_LINKS.SIGN_IN,
  NAV_LINKS.SIGN_UP,
]

// Authenticated nav — Sign In becomes Dashboard, Get Started becomes avatar (handled in Header)
export const navLinksAuthenticated: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.PRICING,
  NAV_LINKS.DASHBOARD,
]

export const navLinksMobileMenu: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.CONTACT_US,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.EVENTS,
  NAV_LINKS.PRICING,
  NAV_LINKS.DASHBOARD,
  NAV_LINKS.FAQ,
]

export const header2NavLinks: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.EVENTS,
  NAV_LINKS.PRICING,
  NAV_LINKS.SIGN_IN,
  NAV_LINKS.SIGN_UP,
]

export const AUTH_ROUTES = {
  SIGN_IN: NAV_LINKS.SIGN_IN,
  SIGN_UP: NAV_LINKS.SIGN_UP,
  FORGOT_PASSWORD: NAV_LINKS.FORGOT_PASSWORD,
  RESET_PASSWORD: NAV_LINKS.RESET_PASSWORD,
} as const

export const EVENT_ROUTES = {
  EVENTS: NAV_LINKS.EVENTS,
  SEARCH_EVENTS: NAV_LINKS.SEARCH_EVENTS,
  EVENTS_DETAILS: NAV_LINKS.EVENTS_DETAILS,
  CHECKOUT: NAV_LINKS.EVENTS_GET_TICKETS_CHECKOUT,
} as const


export const MARKETPLACE_ROUTES = {
  EVENT_DETAILS: NAV_LINKS.MARKETPLACE_EVENT_DETAILS,
  DASHBOARD_MARKETPLACE: NAV_LINKS.DASHBOARD_MARKETPLACE,
  CHECKOUT: NAV_LINKS.MARKETPLACE_CHECKOUT
} as const


export const LEGAL_LINKS = {
  PRIVACY: { label: "Privacy Policy", href: "/legal/privacy-policy" },
  REFUND: { label: "Refund Policy", href: "/legal/refund-policy" },
  TERMS: { label: "Terms of Use", href: "/legal/terms-of-use" },
  COMMISSION: { label: "Commission", href: "/legal/commission" }
} as const;


export const FOOTER_LEGAL_LINKS = {
  PRIVACY: LEGAL_LINKS.PRIVACY,
  TERMS: LEGAL_LINKS.TERMS
}


export const ATTENDEE_SELL_TICKET = `${process.env.NEXT_PUBLIC_ATTENDEE_SITE}/dashboard/`;
export const ATTENDEE_PROFILE_SETTINGS = `${process.env.NEXT_PUBLIC_ATTENDEE_SITE}/dashboard/account-settings/profile`;

export const HOST_DASHBOARD = `${process.env.NEXT_PUBLIC_HOST_SITE}/dashboard/`;
export const HOST_EVENTS = `${process.env.NEXT_PUBLIC_HOST_SITE}/events/`;
export const HOST_CREATE_EVENT = `${process.env.NEXT_PUBLIC_HOST_SITE}/dashboard/events/create`;
