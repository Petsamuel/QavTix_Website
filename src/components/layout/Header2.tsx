'use client'

import { usePathname, useRouter } from "next/navigation"
import Logo from "./Logo"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { ATTENDEE_PROFILE_SETTINGS, header2NavLinks, NAV_LINKS } from "@/components-data/navigation/navLinks"
import { useState } from "react"
import MobileMenu from "./MobileMenu"
import logoSrcWhite from "@/public-assets/logo/qavtix-logo-white.png"
import logoSrc from "@/public-assets/logo/qavtix-logo.png"
import { pathsForHeader2 } from "@/helper-fns/pathNameResolvers"
import { useAppSelector } from "@/lib/redux/hooks"
import { getDashboardURL } from "@/helper-fns/getDashboardURL"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { useLogOut } from "@/contexts/UseLogout"
import { cn } from "@/lib/utils"
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header2() {

    const pathName = usePathname()
    const router = useRouter()
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
    const ctaLinks = header2NavLinks.filter(link => link.type === 'cta')
    const authLinks = header2NavLinks.filter(link => link.type === 'auth')
    const dashboardUrl = getDashboardURL(user?.role ?? undefined)

    if (
        pathName === "/" ||
        pathName === "/_not-found" ||  // Next.js internal 404 route
        pathName.startsWith("/auth") ||
        pathName.match("/checkout") ||
        !pathsForHeader2(pathName)
    ) return null

    return (
        <header className="h-24 md:h-26 w-full absolute top-0 left-0 z-100 flex flex-col justify-center">
            <div>
                <div className="global-px flex items-center justify-between">

                    <Logo
                        logo={isLightBg ? logoSrc : logoSrcWhite}
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
                                {authLinks.map(link => {
                                    return (
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
                                    )
                                })}
                                {ctaLinks.map(link => {
                                    return (
                                        <LiquidLink
                                            key={link.href}
                                            href={link.href}
                                            className="bg-primary-6 w-fit py-4 px-5 h-12"
                                        >
                                            {link.label}
                                        </LiquidLink>
                                    )
                                })}
                            </>
                        )}

                        {/* Authenticated: Dropdown containing Profile + Sign out */}
                        {isAuthenticated && user?.id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 cursor-pointer focus:outline-none group active:scale-[0.98] transition-transform duration-100">
                                        <CustomAvatar
                                            id={user.id}
                                            profileImg={user.profile_picture}
                                            name={user.full_name}
                                            size="size-8 ring-2 ring-primary-5/20 group-hover:ring-primary-5"
                                            textSize="text-base"
                                        />
                                        <div className="flex items-center gap-1">
                                            <span className={cn(
                                                "text-sm font-medium transition-colors duration-150",
                                                isLightBg ? "text-neutral-8 group-hover:text-primary-7" : "text-white group-hover:text-primary-5"
                                            )}>
                                                {user.full_name}
                                            </span>
                                            <Icon
                                                icon="lucide:chevron-down"
                                                className={cn(
                                                    "size-4 transition-colors duration-150",
                                                    isLightBg ? "text-neutral-5 group-hover:text-primary-7" : "text-neutral-3 group-hover:text-primary-5"
                                                )}
                                            />
                                        </div>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" sideOffset={12} className="w-48 p-1.5 rounded-xl bg-white border border-neutral-2 shadow-lg animate-in fade-in-50 slide-in-from-top-1 duration-150 z-[110]">
                                    <div className="px-2.5 py-1.5">
                                        <p className="text-[9px] font-bold text-neutral-5 uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-semibold text-neutral-8 truncate mt-0.5">{user.full_name}</p>
                                        {user.email && <p className="text-xs text-neutral-6 truncate mt-0.5 font-medium">{user.email}</p>}
                                    </div>
                                    <DropdownMenuSeparator className="bg-neutral-2 my-1" />
                                    <DropdownMenuItem asChild className="focus:bg-primary-5/10 focus:text-primary-7 rounded-md cursor-pointer px-2.5 py-1.5 text-xs font-medium text-neutral-7 transition-colors duration-150">
                                        <Link
                                            href={user.role === 'host' ? `${process.env.NEXT_PUBLIC_HOST_SITE}/dashboard/settings` : ATTENDEE_PROFILE_SETTINGS}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 w-full"
                                        >
                                            <Icon icon="hugeicons:user-circle" className="size-4" />
                                            <span>Profile Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-neutral-2 my-1" />
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleLogOut();
                                        }}
                                        disabled={isLoggingOut}
                                        className="focus:bg-red-50 focus:text-red-600 rounded-md cursor-pointer px-2.5 py-1.5 text-xs font-medium text-neutral-7 hover:text-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 flex items-center gap-2 w-full"
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                                <span>Signing out...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Icon icon="hugeicons:logout-square-02" className="size-4" />
                                                <span>Sign out</span>
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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