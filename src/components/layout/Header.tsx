"use client"

import { usePathname, useRouter } from "next/navigation";
import SearchInput1 from "../custom-utils/inputs/event-search/SearchInput1";
import Logo from "./Logo";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { NAV_LINKS, navLinks, navLinksAuthenticated } from "@/components-data/navigation/navLinks";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import logoSrc from "@/public-assets/logo/qavtix-logo.png"
import { pathsForHeader1 } from "@/helper-fns/pathNameResolvers";
import { useAppSelector } from "@/lib/redux/hooks";
import { getDashboardURL } from "@/helper-fns/getDashboardURL";
import CustomAvatar from "../custom-utils/avatars/CustomAvatar";
import { useLogOut } from "@/contexts/UseLogout";


export default function Header() {

    const pathName    = usePathname()
    const router      = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const { isAuthenticated, user } = useAppSelector(store => store.auth)
    const { handleLogOut, isLoggingOut } = useLogOut()

    const isActive = (href: string) => {
        if (href === '/') return pathName === href
        return pathName.startsWith(href)
    }

    const dashboardUrl   = getDashboardURL(user?.role ?? undefined)
    const activeNavLinks = isAuthenticated ? navLinksAuthenticated : navLinks

    if (
        pathName.startsWith("/auth") ||
        pathName.match("/checkout") ||
        pathName === "/_not-found"  ||  // Next.js internal 404 route
        !pathsForHeader1(pathName)
    ) return null

    return (
        <header className="h-24 md:h-26 w-full absolute top-0 left-0 z-100 flex justify-between items-center global-px">
            <div className="flex items-center gap-8">
                <Logo logo={logoSrc} />
                <SearchInput1 className="hidden lg:block" />
            </div>

            {/* Desktop Nav */}
            <nav className="items-center gap-1 hidden lg:flex">
                {activeNavLinks.map((link) => {
                    const active = isActive(link.href)

                    if (link.type === 'cta') {
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="ml-4 px-6 py-4 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-7 hover:shadow-md active:bg-primary-8 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150"
                            >
                                {link.label}
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                px-4 py-2 rounded-lg text-sm transition-all duration-150
                                ${active ? 'text-neutral-8' : 'text-secondary-4 hover:text-primary-7'}
                                active:scale-[0.98]
                                focus:outline-none focus:border-b-2 focus:border-neutral-4
                            `}
                        >
                            {link.label}
                        </Link>
                    )
                })}

                {/* Authenticated: Avatar + Username + Sign out */}
                {isAuthenticated && user?.id && (
                    <Link
                        href={process.env.NEXT_PUBLIC_ATTENDEE_SITE || "/"}
                        aria-label="Go to your dashboard"
                        className="flex items-center gap-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary transition-opacity hover:opacity-80 active:opacity-60"
                    >
                        <CustomAvatar id={user.id} name={user.full_name} size="size-9 ring-2!" textSize="text-base" />
                    </Link>
                )}
            </nav>

            {/* Mobile Controls */}
            <div className="flex gap-3 lg:hidden items-center text-secondary-9">
                <button onClick={() => router.push(NAV_LINKS.SEARCH_PAGE.href)}>
                    <Icon icon="lineicons:search-1" width="24" height="25" className="size-7" />
                    <span className="sr-only">Search</span>
                </button>

                <button onClick={() => setShowMobileMenu(true)}>
                    <Icon icon="lineicons:menu-hamburger-1" width="25" height="30" className="size-9" />
                    <span className="sr-only">Toggle Menu</span>
                </button>
            </div>

            <MobileMenu openMobileMenu={showMobileMenu} setOpenMobileMenu={setShowMobileMenu} />
        </header>
    )
}