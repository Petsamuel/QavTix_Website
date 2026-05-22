import LegalDocContent from '@/components/layout/LegalDocContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Refund Policy | QavTix',
    description: 'Understand QavTix\'s refund, cancellation, and rescheduling rules for tickets purchased on our platform.',
}

export default function RefundPolicyPage() {
    return (
        <LegalDocContent
            title="Refund Policy"
            lastUpdated="March 2025"
            intro={`This Refund Policy ("Policy") sets out the rules governing refunds, cancellations, rescheduling, and related matters for Tickets purchased through the Qavtix ticketing platform ("Platform"). This Policy forms part of the Platform Terms & Conditions and applies to all Buyers, Registered Users, and Event Hosts.`}
            sections={[
                {
                    heading: 'Introduction',
                    content: 'This Policy forms part of the Platform Terms & Conditions and applies to all Buyers, Registered Users, and Event Hosts.',
                },
                {
                    heading: 'Role of the Platform',
                    subsections: [
                        { content: 'Qavtix acts solely as a technology, ticketing, and payment intermediary connecting Buyers and Event Hosts.' },
                        { content: 'The Event Host is responsible for organising, delivering, cancelling, postponing, or modifying Events.' },
                        {
                            content: 'Accordingly, refund eligibility is primarily determined by:',
                        },
                        {
                            content: [
                                'Applicable law',
                                'The Event Host\'s stated policy',
                                'The circumstances of the Event',
                            ],
                        },
                    ],
                },
                {
                    heading: 'General Refund Rule',
                    subsections: [
                        { content: 'Unless expressly stated otherwise, Tickets are non-refundable and non-exchangeable.' },
                        {
                            content: 'Refunds may be issued only where:',
                        },
                        {
                            content: [
                                'Required by law',
                                'The Event is cancelled',
                                'The Event is materially changed',
                                'The Event Host authorises refunds',
                                'Qavtix determines a refund is necessary to protect Users or address fraud',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Event Cancellation',
                    subsections: [
                        { content: 'Where an Event is cancelled and not rescheduled, Buyers shall be entitled to a refund of the Ticket price, subject to applicable deductions where permitted by law.' },
                        { content: 'Where Ticket Proceeds remain in Qavtix\'s possession, Qavtix may process refunds directly.' },
                        { content: 'Where Ticket Proceeds have been disbursed, the Event Host remains responsible for funding refunds, and Qavtix may facilitate enforcement.' },
                    ],
                },
                {
                    heading: 'Event Postponement or Rescheduling',
                    subsections: [
                        {
                            content: 'Where an Event is postponed or rescheduled:',
                        },
                        {
                            content: [
                                'Tickets may remain valid for the new date; or',
                                'Refunds may be offered in accordance with applicable law or the Event Host\'s policy',
                            ],
                        },
                        { content: 'Failure of a Buyer to attend the rescheduled Event does not automatically entitle the Buyer to a refund.' },
                    ],
                },
                {
                    heading: 'Material Event Changes',
                    content: 'A refund may be considered where there is a material change affecting the nature or value of the Event, including:',
                    subsections: [
                        {
                            content: [
                                'Venue change to a significantly different location',
                                'Major lineup/headliner change',
                                'Substantial reduction in event experience',
                            ],
                        },
                        { content: 'Refund decisions in such circumstances shall be made by the Event Host, subject to applicable law.' },
                    ],
                },
                {
                    heading: 'Buyer Non-Attendance',
                    subsections: [
                        { content: 'Failure or inability of a Buyer to attend an Event does not entitle the Buyer to a refund.' },
                        { content: 'Buyers may resell Tickets through authorised Platform features where available.' },
                    ],
                },
                {
                    heading: 'Fraud, Errors, and Duplicate Transactions',
                    content: 'Qavtix may issue refunds where:',
                    subsections: [
                        {
                            content: [
                                'Duplicate payments occur',
                                'A transaction error is identified',
                                'Tickets are fraudulently issued',
                                'The Event is determined to be fraudulent or non-existent',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Refund Process',
                    subsections: [
                        { content: 'Refund requests must be submitted through the Platform within the timeframe specified for the Event.' },
                        { content: 'Approved refunds shall be processed using the original payment method where possible.' },
                        { content: 'Processing timelines may vary depending on payment providers and banks.' },
                    ],
                },
                {
                    heading: 'Fees and Deductions',
                    subsections: [
                        { content: 'Where permitted by law, certain service or processing fees may be non-refundable.' },
                        { content: 'Qavtix may deduct applicable fees from refunded amounts where the refund is not caused by Platform error.' },
                    ],
                },
                {
                    heading: 'Host Refund Obligations',
                    subsections: [
                        { content: 'Event Hosts remain financially responsible for refunds arising from cancellation, non-delivery, or material misrepresentation of Events.' },
                        { content: 'Where Ticket Proceeds have been disbursed, the Event Host must fund refunds promptly upon request.' },
                        { content: 'Qavtix may recover refund amounts from future payouts, reserves, or other sums owed to the Event Host.' },
                    ],
                },
                {
                    heading: 'Chargebacks',
                    subsections: [
                        { content: 'Buyers are encouraged to use the Platform refund process before initiating Chargebacks.' },
                        { content: 'Event Hosts remain responsible for Chargebacks attributable to their Events.' },
                        { content: 'Qavtix may suspend payouts or Accounts where excessive disputes occur.' },
                    ],
                },
                {
                    heading: 'Exceptional Circumstances',
                    content: 'Qavtix may determine refund eligibility in exceptional circumstances, including:',
                    subsections: [
                        {
                            content: [
                                'Public safety issues',
                                'Regulatory intervention',
                                'Force majeure events',
                                'Fraud or consumer protection concerns',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Contact',
                    content: 'Refund enquiries may be submitted via the Platform or by contacting us using the details below.',
                },
            ]}
        />
    )
}
