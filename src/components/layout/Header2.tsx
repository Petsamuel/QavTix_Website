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

export default function Header2() {

    const pathName = usePathname()
    const router = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    const isActive = (href: string) => {
        if (href === '/') return pathName === href
        return pathName.startsWith(href)
    }

    const mainNavLinks = header2NavLinks.filter(link => link.type !== 'cta' && link.type !== "auth")
    const ctaLinks = header2NavLinks.filter(link => link.type === 'cta')

    return (
        pathName !== "/" && 
        !pathName.startsWith("/auth") && 
        !pathName.match("/checkout") && 
        pathsForHeader2(pathName) && (
            <header className="py-8 w-full absolute top-0 left-0 z-100 flex flex-col justify-center">
                <div>
                    <div className="global-px flex items-center justify-between">
                        
                        {/* This Header is being used for the search Page, Due to white background of the search page
                        We will use the colored Logo */}
                        <Logo logo={pathName === NAV_LINKS.SEARCH_PAGE.href ? logoSrc : logoSrcWhite} />

                        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            {mainNavLinks.map((link) => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`
                                            px-4 py-2 text-sm transition-all duration-150
                                            ${active
                                                ? 'text-white'
                                                :
                                                pathName === NAV_LINKS.SEARCH_PAGE.href ?
                                                "text-neutral-7"
                                                : 'text-neutral-6 hover:text-neutral-5'
                                            }
                                            active:scale-[0.98]
                                            focus:outline-none focus:border-b-2 focus:border-neutral-4
                                        `}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="flex items-center gap-6">
                            <div className="hidden lg:flex items-center justify-between gap-2">
                                <button aria-label="Search Event" onClick={() => router.push(NAV_LINKS.SEARCH_PAGE.href)}>
                                    <Icon icon="lineicons:search-1" width="24" height="25" className="size-7 hover:text-primary-7" />
                                </button>
                                {
                                    header2NavLinks.map((v) => {
                                        const active = isActive(v.href)
                                        return (
                                            v.type === "auth" ?
                                            <Link
                                                key={v.href}
                                                href={v.href}
                                                className={`
                                                    px-4 py-2 rounded-lg text-sm transition-all duration-150
                                                    ${active
                                                        ? 'text-primary-7 font-medium'
                                                        : 'text-neutral-8 hover:text-primary-6'
                                                    }
                                                    active:scale-[0.98]
                                                    focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2
                                                `}
                                            >
                                                {v.label}
                                            </Link>
                                            :
                                            null
                                        ) 
                                    })
                                }
                                {ctaLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="px-6 py-3.5 rounded-full bg-primary text-white font-medium text-sm hover:bg-primary-7 hover:shadow-md active:bg-primary-8 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex gap-3 lg:hidden items-center text-secondary-9">
                                <button onClick={() => router.push(NAV_LINKS.SEARCH_PAGE.href)} aria-label="Search Event">
                                    <Icon icon="lineicons:search-1" width="24" height="25" className="size-7" />
                                </button>
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    aria-label="Toggle menu"
                                >
                                    <Icon
                                        icon="lineicons:menu-hamburger-1"
                                        width="30"
                                        height="30"
                                        className="size-8"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <MobileMenu openMobileMenu={showMobileMenu} setOpenMobileMenu={setShowMobileMenu} />
                </div>
            </header>
        )
    )
}