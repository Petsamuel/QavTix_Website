'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import Logo from './Logo'
import { space_grotesk } from '@/lib/fonts'
import { footerData } from '@/components-data/footer-data'
import { usePathname } from 'next/navigation'
import { isHighlightedSocial } from '@/helper-fns/isHighlightedSocial'
import { cn } from '@/lib/utils'
import CurrencySwitcher from '../settings/CurrencySwitcher'
import RegionSwitcher from '../settings/RegionSwitcher'


export default function Footer() {

    const pathName = usePathname()

    return (
        !pathName.match("/auth") &&
        !pathName.match("/checkout") &&
        <footer className="w-full relative bg-primary-1 px-6 lg:px-16 py-12">
            <div className="max-w-7xl mx-auto">
                {/* Main Footer Content */}
                <div className="w-[90%] md:w-1/2 h-full absolute bg-contain bg-no-repeat bg-[url('/images/vectors/logo-bg-element-mobile.svg')] left-0 top-0 bottom-0 mx-auto"></div>
                <div className="grid relative z-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div>
                        <Logo />
                    </div>

                    {/* QavTix Links */}
                    <div>
                        <h3 className="text-neutral-7 font-medium mb-4">
                            {footerData.sections[0].title}
                        </h3>
                        <ul className="space-y-3">
                        {footerData.sections[0].links.map((link) => (
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

                    {/* Support Links */}
                    <div>
                        <h3 className="text-neutral-7 font-medium mb-4">
                            {footerData.sections[1].title}
                        </h3>
                        <ul className="space-y-3">
                        {footerData.sections[1].links.map((link) => (
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

                    {/* Get in Touch */}
                    <div>
                        <h3 className="text-neutral-7 font-medium mb-4">
                        {footerData.contact.title}
                        </h3>
                        <ul className="space-y-3">
                        {footerData.contact.info.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <Icon icon={item.icon} width="20" height="20" className="text-neutral-7 mt-0.5 shrink-0" />
                                {item.href ? (
                                    <Link
                                        href={item.href}
                                        className="text-neutral-8 text-sm font-medium hover:text-primary-6 transition-colors"
                                    >
                                        {item.text}
                                    </Link>
                                ) : (
                                    <span className="text-neutral-8 text-sm font-medium">{item.text}</span>
                                )}
                            </li>
                        ))}
                        </ul>

                        {/* Social Links */}
                        <div className="hidden md:flex gap-4 mt-6">
                            {footerData.social.map((social) => {
                                const isHighlighted =
                                    isHighlightedSocial(social.label) ||
                                    isHighlightedSocial(social.href)
                                return (

                                    <Link
                                        href={social.href}
                                        target="_blank"
                                        key={social.href}
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="flex items-center justify-center hover:scale-105 ease-linear duration-150"
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center py-2 justify-center transition-all',
                                                isHighlighted
                                                ? 'bg-primary-6 text-white rounded-full p-2'
                                                : 'text-primary-6'
                                            )}
                                            >
                                            <Icon
                                                icon={social.icon}
                                                width="24"
                                                height="24"
                                                className={cn(isHighlighted ? "size-7" : "size-9")}
                                            />
                                        </div>
                                    </Link>
                                )
                            }
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="flex gap-4 mt-6 justify-center md:hidden">
                    {footerData.social.map((social) => (
                        <Link
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center hover:scale-110 transition-transform"
                            aria-label={social.label}
                        >
                            <Icon icon={social.icon} width="24" height="24" className='text-primary-6 size-9' />
                        </Link>
                    ))}
                </div>
                <div className="pt-8 border-t border-neutral-3 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className={`${space_grotesk.className} text-neutral-8 order-2 md:order-[unset]`}>
                        © 2025 QavTix
                    </p>

                    {/* Legal Links */}
                    <div className="flex relative order-1 md:order-[unset] z-10 items-center gap-1 text-sm font-medium">
                        {footerData.legal.map((link, index) => (
                        <span key={link.label} className="flex items-center gap-1">
                            <Link
                                href={link.href}
                                className="text-neutral-8 font-bold hover:text-primary-6 transition-colors"
                            >
                            {link.label}
                            </Link>
                            {index < footerData.legal.length - 1 && (
                                <span className="text-neutral-7 mx-2">•</span>
                            )}
                        </span>
                        ))}
                    </div>

                    <div className="flex relative z-10 items-center gap-3 order-3 md:order-[unset]">
                        {/* Region Selector */}
                        <RegionSwitcher />

                        {/* Currency Selector */}
                        <CurrencySwitcher  />
                    </div>
                </div>
            </div>
        </footer>
    )
}