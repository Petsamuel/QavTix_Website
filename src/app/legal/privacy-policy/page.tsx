import LegalDocContent from '@/components/layout/LegalDocContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy | QavTix',
    description: 'Learn how QavTix collects, uses, stores, and protects your personal data on our ticketing platform.',
}

export default function PrivacyPolicyPage() {
    return (
        <LegalDocContent
            title="Privacy Policy"
            lastUpdated="March 2025"
            intro={`This Privacy Policy ("Policy") explains how Qavtix Limited ("Qavtix", "we", "us", or "our") collects, uses, stores, shares, and protects personal data when you access or use our ticketing platform ("Platform"). This Policy applies to Buyers, Registered Users, Event Hosts, and visitors to the Platform. By using the Platform, you acknowledge that your personal data will be processed in accordance with this Policy.`}
            sections={[
                {
                    heading: 'Personal Data We Collect',
                    content: 'We may collect the following categories of personal data:',
                    subsections: [
                        {
                            heading: '1.1 Identity Information',
                            content: ['Name', 'Username', 'Date of birth (where required)', 'Government identification (for verification)'],
                        },
                        {
                            heading: '1.2 Contact Information',
                            content: ['Email address', 'Phone number', 'Billing address'],
                        },
                        {
                            heading: '1.3 Account Information',
                            content: ['Login credentials', 'Profile details', 'Organizer business information (where applicable)'],
                        },
                        {
                            heading: '1.4 Transaction Information',
                            content: ['Tickets purchased or listed', 'Payment confirmations', 'Refund and dispute history'],
                        },
                        {
                            heading: '1.5 Device and Usage Information',
                            content: ['IP address', 'Browser type', 'Device identifiers', 'Platform activity logs'],
                        },
                        {
                            heading: '1.6 Marketing Preferences',
                            content: ['Communication preferences', 'Event interests'],
                        },
                    ],
                },
                {
                    heading: 'How We Collect Data',
                    content: 'We collect personal data when you:',
                    subsections: [
                        {
                            content: [
                                'Create an Account',
                                'Purchase or sell Tickets',
                                'Contact support',
                                'Subscribe to communications',
                                'Browse the Platform',
                                'Participate in promotions or affiliate features',
                            ],
                        },
                        {
                            content: 'We may also receive data from payment processors and Event Hosts where necessary.',
                        },
                    ],
                },
                {
                    heading: 'How We Use Personal Data',
                    content: 'We process personal data to:',
                    subsections: [
                        {
                            content: [
                                'Provide ticketing services',
                                'Create and manage Accounts',
                                'Process payments and refunds',
                                'Verify identities and prevent fraud',
                                'Communicate event updates',
                                'Provide customer support',
                                'Improve Platform functionality',
                                'Comply with legal obligations',
                                'Send marketing communications (where permitted)',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Legal Basis for Processing',
                    content: 'We process personal data based on:',
                    subsections: [
                        {
                            content: [
                                'Performance of a contract',
                                'Compliance with legal obligations',
                                'Legitimate business interests (including fraud prevention and service improvement)',
                                'User consent where required',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Sharing of Personal Data',
                    content: 'We may share personal data with:',
                    subsections: [
                        {
                            content: [
                                'Payment processors and financial institutions',
                                'Event Hosts (limited to necessary event administration information)',
                                'Service providers (hosting, analytics, communications)',
                                'Regulators or law enforcement where required',
                                'Professional advisers',
                            ],
                        },
                        {
                            content: 'We do not sell personal data.',
                        },
                    ],
                },
                {
                    heading: 'Data Retention',
                    content: 'We retain personal data only for as long as necessary to:',
                    subsections: [
                        {
                            content: ['Provide services', 'Resolve disputes', 'Enforce agreements', 'Comply with legal and regulatory requirements'],
                        },
                        {
                            content: 'Retention periods may vary depending on the nature of the data and applicable law.',
                        },
                    ],
                },
                {
                    heading: 'Data Security',
                    content: 'We implement reasonable technical and organisational measures to protect personal data, including:',
                    subsections: [
                        {
                            content: ['Access controls', 'Encryption where appropriate', 'Monitoring for security risks'],
                        },
                        {
                            content: 'However, no system is completely secure.',
                        },
                    ],
                },
                {
                    heading: 'User Rights',
                    content: 'Subject to applicable law, you may:',
                    subsections: [
                        {
                            content: [
                                'Request access to your personal data',
                                'Request correction of inaccurate data',
                                'Request deletion of personal data',
                                'Withdraw consent where processing relies on consent',
                                'Object to certain processing',
                                'Request data portability',
                                'Lodge a complaint with the Nigeria Data Protection Commission',
                            ],
                        },
                        {
                            content: 'Requests may be submitted using the contact details below.',
                        },
                    ],
                },
                {
                    heading: 'Cookies and Tracking',
                    content: 'The Platform uses cookies and similar technologies to:',
                    subsections: [
                        {
                            content: ['Enable core functionality', 'Remember preferences', 'Analyse usage', 'Improve performance'],
                        },
                        {
                            content: 'You may adjust browser settings to manage cookies, though this may affect functionality.',
                        },
                    ],
                },
                {
                    heading: "Children's Data",
                    content: 'The Platform is not intended for children under 18 without parental or guardian involvement. We do not knowingly collect personal data from children unlawfully.',
                },
                {
                    heading: 'International Transfers',
                    content: 'Where personal data is transferred outside Nigeria, we implement safeguards consistent with applicable data protection laws.',
                },
                {
                    heading: 'Changes to this Policy',
                    content: 'We may update this Policy from time to time. Updates will be published on the Platform, and continued use constitutes acceptance.',
                },
                {
                    heading: 'Contact',
                    content: 'For privacy enquiries or data requests, please reach us via the contact details below.',
                },
            ]}
        />
    )
}
