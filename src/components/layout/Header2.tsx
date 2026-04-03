'use client'

import { usePathname, useRouter } from "next/navigation"
import Logo from "./Logo"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { header2NavLinks, NAV_LINKS } from "@/components-data/navigation/navLinks"
import { useState } from "react"
import MobileMenu from "./MobileMenu"
import logoSrcWhite from "@/public-assets/logo/qavtix-logo-white.svg"
import logoSrc from "@/public-assets/logo/qavtix-logo.svg"
import { pathsForHeader2 } from "@/helper-fns/pathNameResolvers"
import { useAppSelector } from "@/lib/redux/hooks"
import { getDashboardURL } from "@/helper-fns/getDashboardURL"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { useLogOut } from "@/contexts/UseLogout"
import { cn } from "@/lib/utils"

export default function Header2() {

    const pathName = usePathname()
    const router   = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const { isAuthenticated, user } = useAppSelector(store => store.auth)
    const { handleLogOut, isLoggingOut } = useLogOut()

    const isActive = (href: string) => {
        if (href === '/') return pathName === href
        return pathName.startsWith(href)
    }

    const isLightBg =
        pathName === NAV_LINKS.SEARCH_PAGE.href ||
        pathName.startsWith(NAV_LINKS.EVENT_CATEGORY.href.replace("[category_name]/", "")) ||
        pathName.startsWith(NAV_LINKS.EVENT_LOCATION.href) ||
        pathName.startsWith(NAV_LINKS.EVENT_TRAVEL_AND_TOUR.href)

    const mainNavLinks = header2NavLinks.filter(link => link.type !== 'cta' && link.type !== "auth")
    const ctaLinks     = header2NavLinks.filter(link => link.type === 'cta')
    const authLinks    = header2NavLinks.filter(link => link.type === 'auth')
    const dashboardUrl = getDashboardURL(user?.role ?? undefined)

    if (
        pathName === "/"              ||
        pathName === "/_not-found"    ||  // Next.js internal 404 route
        pathName.startsWith("/auth")  ||
        pathName.match("/checkout")   ||
        !pathsForHeader2(pathName)
    ) return null

    return (
        <header className="h-24 md:h-26 w-full absolute top-0 left-0 z-100 flex flex-col justify-center">
            <div>
                <div className="global-px flex items-center justify-between">

                    <Logo
                        logo={isLightBg ? logoSrc : logoSrcWhite}
                        className="size-17 md:size-20"
                    />

                    {/* Desktop — centered nav */}
                    <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        {mainNavLinks.map(link => {
                            const active = isActive(link.href)
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 text-sm transition-all duration-150 active:scale-[0.98] focus:outline-none focus:border-b-2 focus:border-neutral-4",
                                        active
                                            ? !isLightBg ? "text-white" : "text-secondary-9"
                                            : isLightBg ? "text-neutral-7 hover:text-neutral-9" : "text-neutral-6 hover:text-neutral-5"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Desktop — right side */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button aria-label="Search Event" onClick={() => router.push(NAV_LINKS.SEARCH_PAGE.href)}>
                            <Icon icon="lineicons:search-1" className="size-6 hover:text-primary-7" />
                        </button>

                        {isAuthenticated && (
                            <Link
                                href={dashboardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn("px-4 py-2 rounded-lg text-sm transition-all duration-150 hover:text-primary-7 active:scale-[0.98] text-neutral-7")}
                            >
                                Dashboard
                            </Link>
                        )}

                        {!isAuthenticated && (
                            <>
                                {authLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            px-4 py-2 rounded-lg text-sm transition-all duration-150
                                            ${isActive(link.href) ? 'text-primary-7 font-medium' : 'text-neutral-8 hover:text-primary-6'}
                                            active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2
                                        `}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {ctaLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="px-6 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-7 hover:shadow-md active:bg-primary-8 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </>
                        )}

                        {isAuthenticated && user?.id && (
                            <div className="flex items-center gap-2">
                                <CustomAvatar id={user.id} name={user.full_name} size="size-7 ring-2!" textSize="text-base" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-medium text-neutral-8">
                                        {user.full_name}
                                    </span>
                                    <button
                                        onClick={handleLogOut}
                                        disabled={isLoggingOut}
                                        className="flex items-center gap-1 text-xs text-neutral-6 hover:text-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                                    >
                                        {isLoggingOut
                                            ? <><Icon icon="eos-icons:three-dots-loading" className="size-3" /> Signing out</>
                                            : "Sign out"
                                        }
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile controls */}
                    <div className="flex gap-3 lg:hidden items-center text-secondary-9">
                        <button onClick={() => router.push(NAV_LINKS.SEARCH_PAGE.href)} aria-label="Search Event">
                            <Icon icon="lineicons:search-1" className="size-7" />
                        </button>
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle menu">
                            <Icon icon="lineicons:menu-hamburger-1" className="size-8" />
                        </button>
                    </div>
                </div>

                <MobileMenu openMobileMenu={showMobileMenu} setOpenMobileMenu={setShowMobileMenu} />
            </div>
        </header>
    )
}