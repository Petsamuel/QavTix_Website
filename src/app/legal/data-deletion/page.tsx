import LegalDocContent from '@/components/layout/LegalDocContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Data Deletion Policy | QavTix',
    description: 'Learn how QavTix handles the deletion of user accounts and personal information collected through the platform.',
}

export default function DataDeletionPage() {
    return (
        <LegalDocContent
            title="Data Deletion Policy"
            lastUpdated="June 2025"
            intro={`This Data Deletion Policy ("Policy") explains how Qavtix ("Qavtix", "we", "our", or "us") handles the deletion of User Accounts and personal information collected through the Qavtix platform ("Platform"). This Policy forms part of the Platform Terms & Conditions and Privacy Policy and applies to all Registered Users, Buyers, Event Hosts, and other individuals who interact with the Platform.`}
            sections={[
                {
                    heading: 'Introduction',
                    content: 'This Policy forms part of the Platform Terms & Conditions and Privacy Policy and applies to all Registered Users, Buyers, Event Hosts, and other individuals who interact with the Platform.',
                },
                {
                    heading: 'User Account Deletion',
                    subsections: [
                        { content: 'Users may request deletion of their Account at any time through the Platform or by contacting Qavtix through the designated support channels.' },
                        { content: 'Upon receipt of a valid deletion request, Qavtix shall take reasonable steps to delete or anonymise personal information associated with the Account, subject to the exceptions set out in this Policy and applicable law.' },
                        {
                            content: 'Deletion of an Account may result in the loss of access to:',
                        },
                        {
                            content: [
                                'Purchased Tickets',
                                'Event history',
                                'Account preferences',
                                'Communications and notifications',
                                'Other Platform services linked to the Account',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Information Subject to Deletion',
                    content: 'Subject to applicable legal and operational requirements, Qavtix may delete or anonymise the following information:',
                    subsections: [
                        {
                            content: [
                                'Account profile information',
                                'Contact information',
                                'Login credentials',
                                'Device and usage data associated with the Account',
                                'Marketing preferences',
                                'Other personal information no longer required for Platform operations',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Information That May Be Retained',
                    content: 'Notwithstanding any Account deletion request, Qavtix may retain certain information where necessary to:',
                    subsections: [
                        {
                            content: [
                                'Comply with legal, regulatory, tax, accounting, or reporting obligations',
                                'Resolve disputes or enforce contractual rights',
                                'Detect, prevent, or investigate fraud, abuse, security incidents, or unlawful activity',
                                'Maintain transaction records relating to Ticket purchases, refunds, chargebacks, or payments',
                                'Comply with court orders, governmental requests, or law enforcement requirements',
                                'Protect the rights, property, or safety of Qavtix, Users, Event Hosts, or third parties',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Transaction Records',
                    subsections: [
                        { content: 'Information relating to completed transactions may be retained for the period required under applicable laws, regulations, accounting standards, or internal compliance requirements.' },
                        {
                            content: 'Such information may include:',
                        },
                        {
                            content: [
                                'Ticket purchase records',
                                'Payment information and transaction references',
                                'Refund records',
                                'Chargeback records',
                                'Communications relating to transactions and disputes',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Anonymised Data',
                    content: 'Qavtix may retain anonymised, aggregated, or de-identified information that cannot reasonably be used to identify an individual. Such information may be used for analytics, service improvement, business reporting, security monitoring, and research purposes.',
                },
                {
                    heading: 'Processing Period',
                    subsections: [
                        { content: 'Account deletion requests shall be processed within a reasonable period after verification of the User\'s identity.' },
                        { content: 'Certain information may remain in backups, archives, or security systems for a limited period before permanent deletion occurs.' },
                        { content: 'Any personal information retained pending permanent deletion or anonymisation shall remain subject to Qavtix\'s security and confidentiality measures and shall not be disclosed to any third party except where required by law or a lawful governmental or regulatory request.' },
                    ],
                },
                {
                    heading: 'Retention of Information Following Deletion Request',
                    content: 'Notwithstanding any Account deletion request, Qavtix may retain or continue to process information that is reasonably necessary to:',
                    subsections: [
                        {
                            content: [
                                'Comply with legal, regulatory, tax, accounting, or reporting obligations',
                                'Investigate, prevent, or address fraud, security incidents, or unlawful activity',
                                'Resolve disputes, chargebacks, refunds, or complaints',
                                'Enforce contractual rights and obligations',
                                'Participate in ongoing legal, regulatory, or administrative proceedings',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Withdrawal of Consent',
                    content: 'Where personal information is processed based on consent, Users may withdraw such consent at any time. Withdrawal of consent shall not affect the lawfulness of processing carried out before the withdrawal.',
                },
                {
                    heading: 'Changes to this Policy',
                    content: 'Qavtix reserves the right to amend this Policy from time to time. Updated versions shall become effective upon publication on the Platform.',
                },
                {
                    heading: 'Contact',
                    content: 'Questions, requests, or concerns regarding account deletion or personal information may be directed to us using the details below.',
                },
            ]}
        />
    )
}
