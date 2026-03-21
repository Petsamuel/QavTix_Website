import { CONTACT_LINKS, SOCIAL_LINKS, SUPPORT_LINKS } from "./navigation/contact-and-socials";
import { LEGAL_LINKS, NAV_LINKS } from "./navigation/navLinks";
import { TICKET_LINKS } from "./navigation/ticket";

export const footerData = {
  sections: [
    {
      title: 'QavTix',
      links: [
        { label: 'About us', href: NAV_LINKS.ABOUT },
        { label: 'Pricing', href: NAV_LINKS.PRICING },
        { label: 'How it works', href: NAV_LINKS.HOW_IT_WORKS },
        { label: 'Explore event', href: NAV_LINKS.EVENTS },
        { label: 'Sell ticket', href: TICKET_LINKS.SELL_TICKET },
        { label: 'Create event', href: TICKET_LINKS.CREATE_EVENT },
      ]
    },
    {
      title: 'Support',
      links: SUPPORT_LINKS
    }
  ],
  contact: {
    title: 'Get in touch',
    info: Object.values(CONTACT_LINKS.LAGOS)
  },
  social: Object.values(SOCIAL_LINKS), 
  legal: Object.values(LEGAL_LINKS).filter(v => !v.href.includes("commission"))
}