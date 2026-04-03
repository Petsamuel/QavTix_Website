'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { MARKETPLACE_ROUTES } from '@/components-data/navigation/navLinks'

export default function MarketplaceTicketNotFound() {

    const router = useRouter()

    return (
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-40 text-center">
            <div className="flex items-center justify-center size-20 rounded-full bg-primary-1 mb-6">
                <Icon
                    icon="hugeicons:ticket-02"
                    width="36"
                    height="36"
                    className="text-primary-6"
                />
            </div>

            <h1 className={cn(space_grotesk.className, "text-2xl font-bold text-secondary-9 mb-3")}>
                Ticket not found
            </h1>

            <p className="text-neutral-7 text-sm max-w-sm mb-8">
                This ticket may have been sold, removed, or the link might be incorrect.
                Browse other available tickets in the marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href={MARKETPLACE_ROUTES.DASHBOARD_MARKETPLACE.href}
                    target='_blank'
                    className="px-6 py-3 rounded-full bg-primary-6 hover:bg-primary-7 text-white text-sm font-medium transition-colors"
                >
                    Browse marketplace
                </Link>
                <button
                    onClick={() => router.push("/")}
                    className="px-6 py-3 rounded-full border border-neutral-7 hover:bg-neutral-1 text-secondary-9 text-sm font-medium transition-colors"
                >
                    Visit Homepage
                </button>
            </div>
        </main>
    )
}