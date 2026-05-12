import LegalDocContent from '@/components/layout/LegalDocContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Ticket Services Agreement | QavTix',
    description: 'Read the QavTix Ticket Service Agreement that governs Event Hosts listing and selling tickets on our platform.',
}

export default function TicketServicesAgreementPage() {
    return (
        <LegalDocContent
            title="Ticket Services Agreement"
            lastUpdated="March 2025"
            intro={`This Ticket Service Agreement ("Agreement") governs the listing, promotion, sale of event tickets, payment processing, and disbursement of Ticket Proceeds through Qavtix's ticketing platform (the "Platform"). This Agreement is entered into between Qavtix Limited and the Event Organizer/Host creating an organizer account and/or listing an Event on the Platform. The Effective Date is the date you click "I Agree", execute this Agreement electronically, or otherwise list an Event or sell Tickets via the Platform, whichever occurs first.`}
            sections={[
                {
                    heading: 'Definitions and Interpretation',
                    content: 'In this Agreement, unless the context otherwise requires:',
                    subsections: [
                        { heading: '"Account"', content: 'Your Organizer account on the Platform.' },
                        { heading: '"Buyer"', content: 'Any person who purchases a Ticket for your Event via the Platform.' },
                        { heading: '"Chargeback"', content: 'A reversal of a card payment initiated by a Buyer through their bank or payment provider.' },
                        { heading: '"Event"', content: 'The concert, show, conference, exhibition, seminar, or activity listed by you on the Platform.' },
                        { heading: '"Event Content"', content: 'All descriptions, images, videos, logos, publicity materials, and other content provided by you for the Event.' },
                        { heading: '"Fees"', content: 'Qavtix service fees, payment processing fees, and any other charges applicable to your use of the Platform.' },
                        { heading: '"Featured Event"', content: 'An optional promotional placement service offered by Qavtix for enhanced visibility on the Platform, subject to separate pricing.' },
                        { heading: '"Payout"', content: 'Disbursement of Ticket Proceeds to your nominated bank account.' },
                        { heading: '"Ticket"', content: 'A valid entry pass to an Event sold via the Platform (electronic or physical).' },
                        { heading: '"Ticket Proceeds"', content: 'Gross Ticket sales revenue less applicable Fees, refunds, Chargebacks, taxes/withholding (if any), disputes, promotional charges, and other deductions permitted under this Agreement.' },
                        { heading: '"Verification Badge"', content: 'A badge that Qavtix may display on your organizer profile to indicate verification status under Qavtix\'s internal criteria.' },
                    ],
                },
                {
                    heading: 'Relationship to Platform Terms',
                    subsections: [
                        { content: 'This Agreement applies in addition to the Platform Terms & Conditions, Privacy Policy, and Refund Policy.' },
                        { content: 'If there is a conflict between this Agreement and the Platform Terms & Conditions regarding Organizer obligations, this Agreement prevails to the extent of that conflict.' },
                    ],
                },
                {
                    heading: 'Eligibility, Authority, and Account Security',
                    content: 'You represent and warrant that:',
                    subsections: [
                        {
                            content: [
                                'You are at least 18 years old and have legal capacity',
                                'Where you act for a legal entity, the entity is duly registered and you are duly authorized',
                                'All information you provide to Qavtix is true, accurate, current, and complete',
                            ],
                        },
                        { content: 'You are responsible for maintaining the confidentiality of your Account credentials and all activity conducted under your Account.' },
                        { content: 'You must promptly notify Qavtix of any suspected unauthorised access or security incident.' },
                    ],
                },
                {
                    heading: 'Scope of Services',
                    content: 'Qavtix provides a technology platform that enables:',
                    subsections: [
                        {
                            content: [
                                'Creation and listing of Events',
                                'Ticket sales and issuance',
                                'Payment processing through third-party processors',
                                'Basic reporting tools',
                                'Payout of Ticket Proceeds subject to this Agreement',
                            ],
                        },
                        { content: 'Qavtix may add, modify, or discontinue Platform features at its discretion, provided such changes do not materially deprive you of paid-for services without reasonable notice.' },
                    ],
                },
                {
                    heading: 'Organizer Responsibilities and Warranties',
                    subsections: [
                        {
                            heading: '5.1 Responsibilities',
                            content: 'You are solely responsible for the Event, including:',
                        },
                        {
                            content: [
                                'Planning, production, content, venue, staffing, safety, security, access control, crowd management, and compliance with laws',
                                'Ensuring Tickets sold are honoured',
                                'Ensuring the Event is delivered as advertised',
                            ],
                        },
                        {
                            heading: '5.2 Warranties',
                            content: 'You warrant that:',
                        },
                        {
                            content: [
                                'All Event information is accurate, lawful, and not misleading',
                                'The Event is genuine and capable of being delivered',
                                'You have obtained all necessary permits, licences, consents, and approvals',
                                'You will comply with all applicable Nigerian laws and regulations',
                                'You will not oversell Tickets or misrepresent capacity/availability',
                                'You will comply with Qavtix\'s anti-fraud measures and reasonable instructions',
                            ],
                        },
                        { heading: '5.3 Material Changes', content: 'You must promptly notify Qavtix of any material change affecting the Event, including postponement, cancellation, venue change, schedule change, or headliner/major participant changes.' },
                    ],
                },
                {
                    heading: 'Event Listings, Review, and Approval',
                    subsections: [
                        { content: 'Qavtix may, at its discretion, review, approve, reject, suspend, or delist any Event listing.' },
                        { content: 'Qavtix may request documentation for verification, including identification, CAC documents, venue booking evidence, permits, or other information reasonably required for compliance, fraud prevention, or risk control.' },
                        { content: 'You grant Qavtix the right to display your Event listing, Organizer profile, and Event Content on the Platform and marketing channels in accordance with this Agreement.' },
                    ],
                },
                {
                    heading: 'Plans, Packages, and Add-On Services',
                    subsections: [
                        { heading: 'Hosting Plans', content: 'Qavtix offers hosting plans (e.g., Standard, Pro, Enterprise) with different features and pricing. The features and fees for each plan are as published on the Platform from time to time.' },
                        { content: 'Subscription fees for plans or add-on services are payable in advance and are non-refundable except where required by law or expressly stated otherwise.' },
                        { heading: 'Featured Event', content: 'Featured Event placement may be purchased separately (unless included in your plan). Featured Event does not guarantee ticket sales or Event success.' },
                        { heading: 'Verification Badge', content: 'Verification Badges may be issued at Qavtix\'s discretion based on internal criteria (including successful Events). A badge is not an endorsement and may be removed at any time.' },
                    ],
                },
                {
                    heading: 'Ticket Pricing, Categories, and Rules',
                    subsections: [
                        { content: 'You are responsible for setting Ticket prices, categories, availability, and any special conditions (e.g., age restrictions, dress code), subject to Platform rules and applicable law.' },
                        { content: 'You must ensure pricing is transparent and that any restrictions are clearly disclosed in the Event listing.' },
                        {
                            content: 'You must not:',
                        },
                        {
                            content: [
                                'Sell Tickets for illegal events or unlawful activities',
                                'List counterfeit events',
                                'Use deceptive marketing or pricing practices',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Fees and Deductions',
                    subsections: [
                        { content: 'You authorise Qavtix to charge and deduct applicable Fees from Ticket sales or otherwise invoice you, as stated on the Platform or agreed in writing.' },
                        {
                            content: 'Fees may include:',
                        },
                        {
                            content: [
                                'Platform service fees',
                                'Payment processing fees',
                                'Featured Event fees',
                                'Dispute/chargeback handling fees (where applicable)',
                                'Any taxes/withholding required by law',
                            ],
                        },
                        { content: 'Qavtix may update Fees with prior notice via the Platform, email, or your Account dashboard.' },
                    ],
                },
                {
                    heading: 'Payouts and Disbursement of Ticket Proceeds',
                    subsections: [
                        { heading: '10.1', content: 'Subject to the conditions below, Qavtix shall disburse Ticket Proceeds to the bank account you provide.' },
                        { heading: '10.2 Payout Schedule', content: 'Ticket Proceeds shall be automatically disbursed every five (5) days excluding weekends, provided there are no unresolved disputes, fraud flags, compliance holds, Chargebacks, or other risk factors.' },
                        {
                            heading: '10.3 Conditions for Payout',
                            content: 'Qavtix may delay or withhold Payout where:',
                        },
                        {
                            content: [
                                'A transaction is under investigation',
                                'There is a pending dispute, refund claim, or Chargeback risk',
                                'Qavtix reasonably suspects fraud or illegality',
                                'Required verification/KYC is incomplete',
                                'Qavtix is required to do so by law, regulator, or payment processor',
                                'You have breached this Agreement or the Platform Terms',
                            ],
                        },
                        { heading: '10.4 Reserve', content: 'Qavtix may hold a reasonable reserve from Ticket Proceeds to cover anticipated refunds, Chargebacks, disputes, and related losses. The reserve amount and duration may vary based on risk assessment.' },
                        { heading: '10.5 Bank Details', content: 'You are responsible for providing accurate bank details. Qavtix shall not be liable for Payout failures resulting from incorrect details you provided.' },
                        { heading: '10.6 Set-Off', content: 'Qavtix may set off any amounts you owe to Qavtix against Ticket Proceeds or other sums payable to you.' },
                    ],
                },
                {
                    heading: 'Refunds, Cancellations, Postponements, and Chargebacks',
                    subsections: [
                        { content: 'You remain solely responsible for your Event and for refund obligations arising from cancellation, postponement/rescheduling, material changes, or failure to deliver the Event as advertised.' },
                        { content: 'Where refunds are required and Ticket Proceeds have not been paid out, Qavtix may process refunds directly from funds in its possession.' },
                        { content: 'Where refunds are required after Ticket Proceeds have been disbursed, you shall promptly reimburse Qavtix or fund the refunds through the Platform mechanism specified by Qavtix.' },
                        { content: 'You authorise Qavtix to recover refund amounts from future Ticket Proceeds, reserves, and/or direct debit/charge mechanisms permitted by the payment processor and law.' },
                        { heading: 'Chargebacks', content: 'You are liable for Chargebacks and related costs attributable to your Event, misrepresentation, cancellation, non-delivery, or disputes. You shall cooperate fully in providing evidence to contest fraudulent Chargebacks.' },
                        { content: 'Qavtix may suspend or delist your Event, withhold Payouts, or apply additional reserves where refund/Chargeback risk is elevated.' },
                    ],
                },
                {
                    heading: 'Fraud Prevention, Investigation, and Enforcement',
                    subsections: [
                        { content: 'Qavtix may monitor transactions and investigate any Event, Account, or Ticket sale.' },
                        {
                            content: 'Where Qavtix reasonably suspects fraud, illegality, or material misrepresentation, Qavtix may:',
                        },
                        {
                            content: [
                                'Suspend or delist the Event',
                                'Suspend or terminate the Account',
                                'Withhold Ticket Proceeds',
                                'Reverse or recover funds',
                                'Report the matter to relevant authorities',
                            ],
                        },
                        { content: 'You shall provide prompt cooperation, documentation, and information reasonably requested for investigations.' },
                    ],
                },
                {
                    heading: 'Marketing, Content Licence, and Publicity',
                    subsections: [
                        {
                            content: 'You grant Qavtix a worldwide, non-exclusive, royalty-free licence to host, use, reproduce, adapt, and display Event Content solely for:',
                        },
                        {
                            content: ['Listing and sale of Tickets', 'Platform marketing and promotional materials', 'Internal analytics and reporting'],
                        },
                        { content: 'You warrant you have all necessary rights to grant the licence above and that Event Content does not infringe any third-party rights.' },
                    ],
                },
                {
                    heading: 'Data Protection',
                    subsections: [
                        { content: 'Each party shall comply with applicable data protection laws, including the Nigeria Data Protection Act.' },
                        {
                            content: 'To the extent you receive Buyer data, you shall:',
                        },
                        {
                            content: [
                                'Use it only for legitimate Event purposes (e.g., entry validation, essential communications)',
                                'Keep it secure',
                                'Not sell, misuse, or unlawfully disclose it',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Representations on Platform Role',
                    subsections: [
                        { content: 'Qavtix acts solely as a technology and payment intermediary. Nothing in this Agreement creates a partnership, joint venture, agency, or employment relationship.' },
                        { content: 'You may not represent that Qavtix is the organizer, co-organizer, promoter, or sponsor of your Event unless expressly agreed in writing.' },
                    ],
                },
                {
                    heading: 'Limitation of Liability',
                    subsections: [
                        { content: 'To the fullest extent permitted by law, Qavtix shall not be liable for any loss, damage, or liability arising from or in connection with your Event, including cancellation, postponement, venue issues, safety incidents, or third-party acts.' },
                        { content: 'Where Qavtix is found legally liable, Qavtix\'s total liability shall be limited to the total service fees earned by Qavtix in respect of the relevant Event giving rise to the claim.' },
                        { content: 'Qavtix shall not be liable for indirect, incidental, special, consequential, or punitive damages, including loss of profit, revenue, goodwill, or business opportunity.' },
                    ],
                },
                {
                    heading: 'Indemnity',
                    content: 'You shall indemnify and hold harmless Qavtix, its officers, employees, agents, and partners from and against all claims, liabilities, losses, damages, penalties, and expenses arising from or relating to:',
                    subsections: [
                        {
                            content: [
                                'Your Event, including injury, loss, or property damage',
                                'Cancellation, postponement, or failure to deliver the Event',
                                'Breach of this Agreement or the Platform Terms',
                                'Misrepresentation or inaccurate Event information',
                                'Infringement of intellectual property rights in Event Content',
                                'Refunds, disputes, and Chargebacks attributable to your Event or conduct',
                                'Your breach of applicable laws',
                            ],
                        },
                    ],
                },
                {
                    heading: 'Suspension, Banned and Termination',
                    subsections: [
                        {
                            content: 'Qavtix may suspend or terminate this Agreement and/or your Account immediately where:',
                        },
                        {
                            content: [
                                'You breach this Agreement',
                                'Fraud, illegality, or material misrepresentation is suspected',
                                'Required verification is not provided',
                                'Continued access poses risk to Buyers, Qavtix, or payment partners',
                            ],
                        },
                        {
                            content: 'Upon termination: existing refund/Chargeback obligations survive; Qavtix may continue holding reserves for a reasonable period to cover disputes; you remain liable for outstanding amounts owed to Qavtix.',
                        },
                    ],
                },
                {
                    heading: 'Taxes',
                    subsections: [
                        { content: 'You are responsible for your taxes arising from Ticket sales and Event operations, unless otherwise required by law.' },
                        { content: 'Qavtix may deduct withholding taxes or comply with tax reporting obligations if required by applicable law.' },
                    ],
                },
                {
                    heading: 'Notices',
                    subsections: [
                        { content: 'Notices may be provided via email, Platform notifications, or your Account dashboard.' },
                        { content: 'You must keep contact details current.' },
                    ],
                },
                {
                    heading: 'Assignment',
                    subsections: [
                        { content: 'You may not assign this Agreement without Qavtix\'s prior written consent.' },
                        { content: 'Qavtix may assign this Agreement to an affiliate or successor upon notice to you.' },
                    ],
                },
                {
                    heading: 'Governing Law and Dispute Resolution',
                    subsections: [
                        { content: 'This Agreement is governed by the laws of the Federal Republic of Nigeria.' },
                        { content: 'Parties shall attempt amicable resolution in good faith.' },
                        { content: 'Failing amicable resolution, disputes shall be referred to arbitration in Nigeria in accordance with applicable arbitration laws. The arbitral decision shall be final and binding.' },
                    ],
                },
                {
                    heading: 'Severability',
                    content: 'If any provision is held invalid or unenforceable, the remaining provisions remain in full force and effect.',
                },
                {
                    heading: 'Entire Agreement',
                    content: 'This Agreement, together with the Platform Terms & Conditions, Privacy Policy, and Refund Policy, constitutes the entire agreement between the Parties regarding its subject matter and supersedes prior understandings.',
                },
                {
                    heading: 'Contact',
                    content: 'For enquiries regarding this Agreement, please contact us using the details below.',
                },
            ]}
        />
    )
}
