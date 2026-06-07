"use client"

import { usePathname, useRouter } from "next/navigation";
import SearchInput1 from "../custom-utils/inputs/event-search/SearchInput1";
import Logo from "./Logo";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ATTENDEE_PROFILE_SETTINGS, NAV_LINKS, navLinks, navLinksAuthenticated } from "@/components-data/navigation/navLinks";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import logoSrc from "@/public-assets/logo/qavtix-logo.png"
import { pathsForHeader1 } from "@/helper-fns/pathNameResolvers";
import { useAppSelector } from "@/lib/redux/hooks";
import { getDashboardURL } from "@/helper-fns/getDashboardURL";
import CustomAvatar from "../custom-utils/avatars/CustomAvatar";
import { useLogOut } from "@/contexts/UseLogout";
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Header() {

    const pathName = usePathname()
    const router = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const { isAuthenticated, user } = useAppSelector(store => store.auth)
    const { handleLogOut, isLoggingOut } = useLogOut()

    const isActive = (href: string) => {
        if (href === '/') return pathName === href
        return pathName.startsWith(href)
    }

    const dashboardUrl = getDashboardURL(user?.role ?? undefined)
    const activeNavLinks = isAuthenticated ? navLinksAuthenticated : navLinks

    if (
        pathName.startsWith("/auth") ||
        pathName.match("/checkout") ||
        pathName === "/_not-found" ||  // Next.js internal 404 route
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

                    if (link.href.includes('/dashboard')) {
                        return (
                            <Link
                                key="dashboard"
                                href={dashboardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg text-sm transition-all duration-150 text-secondary-4 hover:text-primary-7 active:scale-[0.98] focus:outline-none focus:border-b-2 focus:border-neutral-4"
                            >
                                {link.label}
                            </Link>
                        )
                    }

                    if (link.type === 'cta') {
                        return (
                            <LiquidLink
                                key={link.href}
                                href={link.href}
                                className="bg-primary-6 w-fit py-4 px-5 h-12"
                            >
                                {link.label}
                            </LiquidLink>
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

                {/* Authenticated: Dropdown containing Profile + Sign out */}
                {isAuthenticated && user?.id && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 cursor-pointer focus:outline-none group active:scale-[0.98] transition-transform duration-100">
                                <div className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150">
                                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                                    <CustomAvatar
                                        id={user.id}
                                        profileImg={user.profile_picture}
                                        name={user.full_name}
                                        size="size-8 relative z-10 !ring-0"
                                        textSize="text-base"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-neutral-8 group-hover:text-primary-7 transition-colors duration-150">
                                        {user.full_name}
                                    </span>
                                    <Icon icon="lucide:chevron-down" className="size-4 text-neutral-5 group-hover:text-primary-7 transition-colors duration-150" />
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