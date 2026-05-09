import { ATTENDEE_SELL_TICKET, HOST_CREATE_EVENT } from "./navLinks";

export const TICKET_LINKS = {
  SELL_TICKET: {
    label: "Sell ticket",
    href: ATTENDEE_SELL_TICKET
  },
  CREATE_EVENT: {
    label: "Create event",
    href: HOST_CREATE_EVENT
  },
  BUY_TICKET: {
    label: "Buy ticket",
    href: "/events"
  }
} as const
