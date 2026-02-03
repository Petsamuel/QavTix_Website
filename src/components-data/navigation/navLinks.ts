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

  SEARCH_EVENTS: { label: '', href: '/events/search' },
  EVENT_LOCATION: { label: '', href: '/events/explore/location/' },
  EVENT_CATEGORY: { label: '', href: '/events/explore/category/' },
  EVENT_TRAVEL_AND_TOUR: { label: '', href: '/events/explore/travel-and-tours/' },
  EVENTS_DETAILS: { label: '', href: '/events/details/[event_id]' },
  EVENTS_GET_TICKETS_CHECKOUT: { label: '', href: '/events/details/[event_id]/checkout' },


  HOST_PROFILE: { label: '', href: '/host/profile/[host_id]' },
  DASHBOARD: { label: '', href: '/' },

  SEARCH_PAGE: { label: '', href: '/search' },
} as const satisfies Record<string, NavLink>

export const navLinks: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.PRICING,
  NAV_LINKS.SIGN_IN,
  NAV_LINKS.SIGN_UP,
]

export const navLinksMobileMenu: NavLink[] = [
  NAV_LINKS.ABOUT,
  NAV_LINKS.CONTACT_US,
  NAV_LINKS.HOW_IT_WORKS,
  NAV_LINKS.EVENTS,
  NAV_LINKS.PRICING,
  NAV_LINKS.FAQ
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
  CHECKOUT: NAV_LINKS.EVENTS_GET_TICKETS_CHECKOUT
} as const