import { CONTACT_LINKS, SOCIAL_LINKS, SUPPORT_LINKS } from "./navigation/contact-and-socials";
import { LEGAL_LINKS, NAV_LINKS } from "./navigation/navLinks";
import { TICKET_LINKS } from "./navigation/ticket";

export const footerData = {
  sections: [
    {
      title: 'QavTix',
      links: [
        { label: 'About us', href: NAV_LINKS.ABOUT.href },
        { label: 'Pricing', href: NAV_LINKS.PRICING.href },
        { label: 'How it works', href: NAV_LINKS.HOW_IT_WORKS.href },
        { label: 'Explore event', href: NAV_LINKS.EVENTS.href },
        { label: 'Sell ticket', href: TICKET_LINKS.SELL_TICKET.href },
        { label: 'Create event', href: TICKET_LINKS.CREATE_EVENT.href },
      ]
    },
    {
      title: 'Support',
      links: SUPPORT_LINKS
    },
    {
      title: 'Legal',
      links: [
        LEGAL_LINKS.PRIVACY,
        LEGAL_LINKS.REFUND,
        LEGAL_LINKS.TERMS
      ]
    }
  ],
  contact: {
    title: 'Get in touch',
    info: Object.values(CONTACT_LINKS.LAGOS)
  },
  social: Object.values(SOCIAL_LINKS), 
  legal: [
    LEGAL_LINKS.PRIVACY,
    LEGAL_LINKS.REFUND,
    LEGAL_LINKS.TERMS
  ]
}