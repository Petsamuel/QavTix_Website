'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import { useRouter } from 'next/navigation'

export default function HostNotFound() {

    const router = useRouter()

    return (
        <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-40 text-center">
            <div className="flex items-center justify-center size-20 rounded-full bg-primary-1 mb-6">
                <Icon
                    icon="hugeicons:user-remove-02"
                    width="36"
                    height="36"
                    className="text-primary-6"
                />
            </div>

            <h1 className={cn(space_grotesk.className, "text-2xl font-bold text-secondary-9 mb-3")}>
                Host not found
            </h1>

            <p className="text-neutral-7 text-sm max-w-sm mb-8">
                This host profile may have been removed, deactivated, or the link might be slightly off.
                Try exploring other hosts instead.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link
                    href={EVENT_ROUTES.EVENTS.href}
                    className="px-6 py-3 rounded-full bg-primary-6 hover:bg-primary-7 text-white text-sm font-medium transition-colors"
                >
                    Browse Events
                </Link>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-full border border-neutral-7 hover:bg-neutral-1 text-secondary-9 text-sm font-medium transition-colors"
                >
                    Go back
                </button>
            </div>
        </main>
    )
}