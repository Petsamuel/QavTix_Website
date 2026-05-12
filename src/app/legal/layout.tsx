import LegalLayout from '@/components/layout/LegalLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Legal Documentation | QavTix',
    description: 'Read QavTix legal documentation including our Privacy Policy, Terms of Service, Refund Policy, and Ticket Services Agreement.',
}

export default function LegalRootLayout({ children }: { children: React.ReactNode }) {
    return <LegalLayout>{children}</LegalLayout>
}
