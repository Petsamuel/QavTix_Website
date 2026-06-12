import HelpCenterPage from '@/components/help-center/HelpCenterPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Help Center | QavTix',
    description: 'Everything you need to know about ticketing, events, payouts, and your QavTix account — all in one place.',
}

export default function HelpPage() {
    return <HelpCenterPage />
}
