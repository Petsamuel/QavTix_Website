import { NAV_LINKS } from "@/components-data/navigation/navLinks";

export const pathsForHeader1 = (pathName: string) => (
  pathName === "/" ||
  pathName.startsWith(
    NAV_LINKS.EVENT_LOCATION.href.replace(/\/$/, '')
  ) ||
  pathName.startsWith(
    NAV_LINKS.EVENT_CATEGORY.href.replace(/\/$/, '')
  ) ||
  pathName.startsWith(
    NAV_LINKS.EVENT_TRAVEL_AND_TOUR.href.replace(/\/$/, '')
  ) ||
  pathName.startsWith(
    NAV_LINKS.HOST_PROFILE.href.replace('/[host_id]', '')
  )
)




export const pathsForHeader2 = (pathName: string) => (
    pathName.startsWith(NAV_LINKS.ABOUT.href.replace(/\/$/, "")) ||
    pathName === NAV_LINKS.SEARCH_PAGE.href ||
    pathName.startsWith(NAV_LINKS.EVENTS.href.replace(/\/$/, "")) ||
    pathName.startsWith(NAV_LINKS.CONTACT_US.href.replace(/\/$/, "")) ||
    pathName.startsWith(NAV_LINKS.FAQ.href.replace(/\/$/, "")) ||
    pathName.startsWith(NAV_LINKS.PRICING.href.replace(/\/$/, "")) ||
    pathName.startsWith(NAV_LINKS.HOW_IT_WORKS.href.replace(/\/$/, "")) ||
    pathName.startsWith(NAV_LINKS.SEARCH_EVENTS.href.replace(/\/$/, ""))
)