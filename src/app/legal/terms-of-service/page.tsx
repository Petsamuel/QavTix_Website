import LegalDocContent from '@/components/layout/LegalDocContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service | QavTix',
    description: 'Read the QavTix Platform Terms and Conditions governing your use of our ticketing platform.',
}

export default function TermsOfServicePage() {
    return (
        <LegalDocContent
            title="Terms of Service"
            lastUpdated="March 2025"
            intro={`These Terms and Conditions ("Terms") govern access to and use of the ticketing platform operated by Qavtix Limited ("Qavtix", "Platform", "we", "us", or "our"), including the purchase and sale of tickets, creation of user accounts, and listing of events. By creating an Account, listing an Event, purchasing a Ticket, or otherwise accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, together with our Privacy Policy and Refund Policy, which are incorporated herein by reference. If you do not agree to these Terms, you must not access or use the Platform.`}
            sections={[
                {
                    heading: 'Introduction and Acceptance of Terms',
                    content: 'These Terms govern access to and use of the Qavtix Platform. By using the Platform, you agree to be bound by these Terms together with our Privacy Policy and Refund Policy.',
                },
                {
                    heading: 'Definitions',
                    content: 'In these Terms, unless the context otherwise requires:',
                    subsections: [
                        { heading: '"Account"', content: 'A registered account created on the Platform.' },
                        { heading: '"Buyer"', content: 'Any individual or entity that purchases a Ticket through the Platform.' },
                        { heading: '"Registered User"', content: 'Any user who creates an Account on the Platform.' },
                        { heading: '"Event Host" or "Organizer"', content: 'Any individual or entity that lists, promotes, or sells Tickets for an Event through the Platform.' },
                        { heading: '"Event"', content: 'Any concert, show, conference, exhibition, seminar, or activity listed on the Platform.' },
                        { heading: '"Ticket"', content: 'A valid entry pass to an Event, whether electronic or physical.' },
                        { heading: '"Ticket Proceeds"', content: 'Revenue generated from Ticket sales, less applicable fees, refunds, chargebacks, and deductions permitted under applicable agreements.' },
                    ],
                },
                {
                    heading: 'Eligibility and Account Registration',
                    subsections: [
                        { content: 'To use the Platform, you must be at least eighteen (18) years old or have the consent of a parent or legal guardian and possess the legal capacity to enter into a binding contract under Nigerian law.' },
                        { content: 'Where an Account is created on behalf of a legal entity, the individual creating the Account represents that they are duly authorised.' },
                        { content: 'Users are responsible for maintaining the confidentiality of Account credentials and for all activities conducted through their Account.' },
                        { content: 'Qavtix reserves the right to suspend or terminate any Account that provides false information, engages in misconduct, or breaches these Terms.' },
                    ],
                },
                {
                    heading: 'Nature of the Platform',
                    subsections: [
                        { content: 'The Platform operates solely as a technology, ticketing, and payment intermediary connecting Event Hosts and Buyers.' },
                        { content: 'Qavtix is not the organiser, promoter, partner, agent, or producer of any Event unless expressly stated.' },
                        { content: 'The Event Host bears full responsibility for the planning, execution, safety, legality, and delivery of each Event.' },
                    ],
                },
                {
                    heading: 'Ticket Purchase, Use and Related Features',
                    subsections: [
                        { heading: '5.1 Purchase & Delivery', content: 'Tickets may be purchased through the Platform upon successful completion of payment using the available payment methods. A Ticket shall be deemed issued only upon payment confirmation and delivery of an electronic ticket or confirmation notice. Tickets are typically delivered electronically via email, QR code, or other digital means linked to the User\'s account.' },
                        { heading: '5.2 Ticket Rules', content: 'Each Ticket is valid only for the specified Event and for one person, unless expressly stated otherwise. Tickets must not be duplicated, altered, tampered with, or fraudulently obtained.' },
                        {
                            heading: '5.3 Affiliate Marketing',
                            content: 'Where affiliate marketing is enabled, Users may promote Tickets using affiliate links or tools provided. To qualify for commission:',
                        },
                        {
                            content: [
                                'The User must comply with all instructions provided for use of affiliate links and tools',
                                'Only valid ticket sales completed through the User\'s affiliate link shall qualify for commission',
                                'Commissions shall be calculated based on the sale amount displayed on the Platform and may be subject to deductions for applicable fees, refunds, or chargebacks',
                                'Commissions shall only be paid after the corresponding ticket sale is fully completed and not cancelled or refunded',
                                'The Platform reserves the right to withhold, adjust, or cancel commissions where fraud, misuse, or violation of these Terms is detected',
                            ],
                        },
                        { heading: '5.4 Group Buy', content: 'The Platform offers a group ticket purchase option ("Group Buy"), subject to ticket availability and any limitations imposed at the Platform\'s discretion.' },
                        { heading: '5.5 Group Buy Completion', content: 'A Group Buy shall only be considered successful where full payment for all tickets within the group is completed no later than one (1) week before the scheduled Event date. Tickets shall not be issued or delivered until full payment for the entire Group Buy has been received.' },
                        { heading: '5.6 Group Buy Cancellation', content: 'Where full payment is not received within the required timeframe, the Group Buy shall be automatically cancelled and any amounts paid shall be refunded in accordance with applicable law, subject to a 15% refund fee to be deducted from the amount paid.' },
                    ],
                },
                {
                    heading: 'Pricing, Fees, and Payments',
                    subsections: [
                        { content: 'Ticket prices shall be displayed in Naira (₦) unless otherwise stated and may include service charges, processing fees, or taxes disclosed prior to payment.' },
                        { content: 'Payments are processed through third-party payment processors, and Qavtix shall not be liable for failures arising from external payment systems.' },
                    ],
                },
                {
                    heading: 'Refunds, Cancellations, and Event Changes',
                    subsections: [
                        { content: 'Refunds and cancellations shall be governed by the Refund Policy.' },
                        { content: 'Where an Event is postponed or rescheduled, Tickets may remain valid or be addressed in accordance with applicable law or the Event Host\'s policy.' },
                        { content: 'Where Ticket Proceeds have been disbursed to the Event Host, the Event Host shall remain responsible for funding any refunds, and Qavtix may facilitate enforcement.' },
                    ],
                },
                {
                    heading: 'Event Host General Obligations',
                    content: 'Event Hosts warrant that:',
                    subsections: [
                        {
                            content: [
                                'Event information is accurate and not misleading',
                                'All required permits and approvals have been obtained',
                                'Events comply with applicable laws',
                                'Tickets sold will be honoured',
                            ],
                        },
                        { content: 'Commercial and operational obligations of Event Hosts are governed separately by the Ticket Service Agreement.' },
                    ],
                },
                {
                    heading: 'Platform Enforcement Rights',
                    content: 'Qavtix may investigate Events, Accounts, or transactions and may suspend listings, withhold funds, reverse transactions, terminate Accounts, or report misconduct to authorities where necessary to protect Users or the Platform.',
                },
                {
                    heading: 'Intellectual Property',
                    content: 'All Platform content remains the intellectual property of Qavtix or its licensors. Event Hosts grant Qavtix a non-exclusive licence to use Event materials for promotional purposes.',
                },
                {
                    heading: 'Prohibited Conduct',
                    content: 'Users shall not engage in fraud, chargeback abuse, unlawful activity, unauthorised resale, or interference with the Platform\'s operation or security.',
                },
                {
                    heading: 'Limitation of Liability',
                    content: 'To the fullest extent permitted by law, Qavtix shall not be liable for losses arising from attendance, non-attendance, or Event performance.',
                    subsections: [
                        {
                            content: [
                                'Buyer claims shall be limited to the Ticket value',
                                'Host-related liability shall be limited to service fees earned by Qavtix',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Indemnity',
                    content: 'Users agree to indemnify Qavtix against claims, losses, or expenses arising from breach of these Terms or misuse of the Platform. Event Hosts further indemnify Qavtix against claims arising from the Event.',
                },
                {
                    heading: 'Data Protection',
                    content: 'Personal data shall be processed in accordance with the Privacy Policy and applicable Nigerian data protection laws.',
                },
                {
                    heading: 'Suspension and Termination',
                    content: 'Qavtix may suspend Accounts, cancel Tickets, or restrict access where breach, fraud, risk, or legal requirements arise.',
                },
                {
                    heading: 'Governing Law and Dispute Resolution',
                    content: 'These Terms shall be governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved by arbitration in Nigeria, and the decision shall be final and binding.',
                },
                {
                    heading: 'Miscellaneous',
                    content: 'These Terms constitute the entire agreement, may be amended by Qavtix, and shall remain effective notwithstanding invalidity of any provision.',
                },
            ]}
        />
    )
}
