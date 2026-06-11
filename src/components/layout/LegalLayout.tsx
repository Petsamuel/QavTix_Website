'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import logoSrc from '@/public-assets/logo/qavtix-logo.png'
import Image from 'next/image'
import { space_grotesk } from '@/lib/fonts'

const LEGAL_NAV = [
    {
        label: 'Refund Policy',
        href: '/legal/refund-policy',
        icon: 'hugeicons:credit-card',
    },
    {
        label: 'Terms of Service',
        href: '/legal/terms-of-service',
        icon: 'hugeicons:agreement-02',
    },
    {
        label: 'Privacy Policy',
        href: '/legal/privacy-policy',
        icon: 'solar:lock-linear',
    },
    {
        label: 'Ticket Services Agreement',
        href: '/legal/ticket-services-agreement',
        icon: 'hugeicons:ticket-01',
    },
    {
        label: 'Data Deletion',
        href: '/legal/data-deletion',
        icon: 'hugeicons:delete-02',
    },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileNavOpen, setMobileNavOpen] = useState(false)

    const currentDoc = LEGAL_NAV.find(n => n.href === pathname)

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="sticky top-0 z-50 bg-white border-b border-neutral-5 h-20 flex items-center px-4 md:px-8 justify-between">
                <div className="flex items-center gap-3">
                    <button
                        className="lg:hidden p-1 -ml-1 text-secondary-7 hover:text-secondary-9 transition-colors"
                        onClick={() => setMobileNavOpen(true)}
                        aria-label="Open navigation"
                    >
                        <Icon icon="charm:menu-kebab" className="size-6" />
                    </button>

                    <Link href="/" className="inline-block">
                        <Image src={logoSrc} alt="Qavtix Logo" width={90} height={45} priority />
                    </Link>
                </div>

                <h1 className={cn(space_grotesk.className, "hidden lg:block text-2xl font-medium text-secondary-8 absolute left-1/2 -translate-x-1/2")}>
                    Legal Documentation
                </h1>

                <button
                    onClick={() => router.push("/")}
                    className="p-1.5 rounded-full text-secondary-6 hover:text-secondary-9 hover:bg-neutral-4 transition-all"
                    aria-label="Go back"
                >
                    <Icon icon="lucide:x" className="size-5" />
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">

                {mobileNavOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                )}

                <aside
                    className={cn(
                        // Base
                        'fixed top-0 left-0 z-50 h-full bg-white border-r border-neutral-5 flex flex-col pt-20 pb-8 px-4',
                        // Mobile: slide in/out
                        'w-72 transition-transform duration-300 ease-in-out lg:translate-x-0',
                        // Desktop: sticky sidebar (scrolls with page but stays in view)
                        'lg:static lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-[280px] lg:shrink-0 lg:pt-8 lg:overflow-y-auto',
                        mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    )}
                >
                    {/* Mobile header inside sidebar */}
                    <div className="flex items-center justify-between mb-6 lg:hidden px-1">
                        <span className="text-xs font-semibold uppercase tracking-widest text-secondary-5">Menu</span>
                        <button
                            onClick={() => setMobileNavOpen(false)}
                            className="p-1 text-secondary-6 hover:text-secondary-9"
                        >
                            <Icon icon="lucide:x" className="size-4" />
                        </button>
                    </div>

                    <p className="text-sm font-medium uppercase text-secondary-10 mb-4 px-3">
                        Legal Documentation
                    </p>

                    <nav className="flex flex-col gap-1">
                        {LEGAL_NAV.map((item) => {
                            const active = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileNavOpen(false)}
                                    className={cn(
                                        space_grotesk.className,
                                        'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                                        active
                                            ? 'bg-primary-1 text-primary-6 font-semibold'
                                            : 'text-secondary-7 hover:bg-neutral-3 hover:text-secondary-9'
                                    )}
                                >
                                    <Icon
                                        icon={item.icon}
                                        className={cn('size-5 shrink-0', active ? 'text-primary-6' : 'text-secondary-5')}
                                    />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-6 md:px-10 py-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
