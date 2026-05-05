'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { AUTH_ROUTES, MARKETPLACE_ROUTES } from '@/components-data/navigation/navLinks'

export default function MarketplaceAuthError() {
    return (
        <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="flex items-center justify-center size-20 rounded-full bg-amber-100 mb-6">
                <Icon icon="hugeicons:lock" width="36" height="36" className="text-amber-600" />
            </div>

            <h1 className="text-2xl font-bold text-secondary-9 mb-3">
                Authentication Required
            </h1>

            <p className="text-neutral-7 max-w-sm mb-8">
                You need to be logged in to view this ticket or marketplace item.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href={`${AUTH_ROUTES.SIGN_IN.href}?returnTo=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    className="px-8 py-3 rounded-full bg-primary-6 text-white font-medium hover:bg-primary-7 transition-colors"
                >
                    Login to continue
                </Link>
                <Link
                    href={MARKETPLACE_ROUTES.DASHBOARD_MARKETPLACE.href}
                    target='_blank'
                    className="px-8 py-3 rounded-full border border-neutral-7 hover:bg-neutral-1 font-medium transition-colors"
                >
                    Back to Marketplace
                </Link>
            </div>
        </main>
    )
}