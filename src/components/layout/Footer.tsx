'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Logo from './Logo'
import { space_grotesk } from '@/lib/fonts'
import { footerData } from '@/components-data/footer-data'
import { usePathname } from 'next/navigation'
import RegionSwitcher from '../settings/RegionSwitcher'


export default function Footer() {

    const pathName = usePathname()

    return (
        pathName !== "/_not-found" &&
        !pathName.match("/auth") &&
        !pathName.match("/checkout") &&
        <div className="px-4 md:px-8 py-4">
            <footer className="w-full rounded-3xl relative bg-primary-1 px-6 lg:px-16 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="w-[90%] md:w-1/2 h-full absolute bg-contain bg-no-repeat bg-[url('/images/vectors/logo-bg-element-mobile.svg')] left-0 top-0 bottom-0 mx-auto pointer-events-none opacity-50"></div>
                    <div className="grid relative z-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div>
                            <Logo />
                        </div>

                        {/* Dynamic Footer Sections (QavTix, Support, Legal) */}
                        {footerData.sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-neutral-7 font-medium mb-4">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-neutral-8 text-sm font-medium hover:text-primary-6 transition-colors inline-block relative group"
                                            >
                                                {link.label}
                                                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-primary-6 group-hover:w-full transition-all duration-300"></span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="pt-8 border-t border-neutral-3 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                        {/* Social Icons (Left on Desktop, Center on Mobile) */}
                        <div className="flex gap-6 items-center md:order-1">
                            {footerData.social.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-6 hover:scale-110 transition-transform"
                                    aria-label={social.label}
                                >
                                    <Icon icon={social.icon} width="28" height="28" className="size-8" />
                                </Link>
                            ))}
                        </div>

                        {/* Copyright (Center) */}
                        <p className={`${space_grotesk.className} text-neutral-8 md:order-2 text-center`}>
                            © 2025 QavTix
                        </p>

                        {/* Region Selector (Right) */}
                        <div className="flex items-center gap-3 md:order-3">
                            <RegionSwitcher />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}