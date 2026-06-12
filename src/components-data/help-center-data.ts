export interface HelpSection {
    id: string
    heading: string
    content?: string
    bullets?: string[]
    steps?: string[]
    subsections?: { heading: string; content?: string; bullets?: string[] }[]
}

export interface HelpTopic {
    id: string
    label: string
    icon: string
    sections: HelpSection[]
}

// ─── HOST TOPICS ──────────────────────────────────────────────────────────────

export const HOST_TOPICS: HelpTopic[] = [
    {
        id: 'event-setup',
        label: 'Event Setup',
        icon: 'hugeicons:tent-01',
        sections: [
            {
                id: 'what-you-can-do',
                heading: 'Create and Manage Your Event',
                content: 'QavTix allows hosts to create, customize, and manage events from a single dashboard.',
            },
            {
                id: 'capabilities',
                heading: 'What You Can Do',
                bullets: [
                    'Create unlimited events (depending on your plan)',
                    'Add multiple ticket categories',
                    'Customize event schedules and descriptions',
                    'Upload banners and promotional media',
                    'Configure attendee limits',
                    'Set ticket pricing and sales periods',
                    'Enable referral and promotional tools',
                ],
            },
            {
                id: 'how-to-setup',
                heading: 'How to Set Up an Event',
                steps: [
                    'Log in to your QavTix Host Account',
                    'Go to Dashboard',
                    'Click Create Event',
                    'Enter event details: event name, venue or online link, date & time, ticket categories, pricing',
                    'Upload event banner',
                    'Review your setup',
                    'Click Publish Event',
                ],
            },
            {
                id: 'important-notes',
                heading: 'Important Notes',
                bullets: [
                    'Event setup features depend on your subscription plan',
                    'Draft events can be edited before publishing',
                    'Published events can still be updated unless ticket sales are locked',
                ],
            },
        ],
    },
    {
        id: 'pricing',
        label: 'Pricing & Plans',
        icon: 'hugeicons:credit-card',
        sections: [
            {
                id: 'intro',
                heading: 'Learn about QavTix Pricing & Plans',
                content: 'QavTix offers subscription plans that help event hosts be more productive and scale their events.',
            },
            {
                id: 'pro-plan',
                heading: 'Professional Plan',
                bullets: [
                    'Unlimited Event Creation',
                    'Unlimited Ticket Categories',
                    'Max Ticket Sales (2,500 tickets)',
                    'Exclusive Discount Codes (Up to 100)',
                    'Referral Sales Program',
                    'Customer Profile Insights',
                    'Downloadable Attendee List (Up to 1,000)',
                    'QR Code Check-In System',
                    'Real-Time Sales Insights',
                    'Revenue Performance Chart',
                    'Integrated Marketing Dashboard',
                    'Built-in Email Campaigns (400 Sends/Month)',
                    'Priority Email Support',
                    'Fraud Detection',
                ],
            },
            {
                id: 'enterprise-plan',
                heading: 'Enterprise Plan',
                bullets: [
                    'Unlimited Event Creation',
                    'Unlimited Ticket Categories',
                    'Unlimited Resale Volume',
                    'Exclusive Discount Codes (Up to 500)',
                    'Referral Sales Program',
                    'Customer Profile Insights',
                    'Unlimited downloadable Attendee List',
                    'QR Code Check-In System',
                    'Included Featured Event Listing (2 Weeks)',
                    'Real-Time Sales Insights',
                    'Revenue Performance Chart',
                    'Geographical Breakdown',
                    'Week-Based Analysis',
                    'Integrated Marketing Dashboard',
                    'Built-in Email Campaigns (4,600 Sends/Month)',
                    'SMS Send (100 Send)',
                    'Sponsored Email Campaign',
                    'Dedicated Account Manager',
                    'Priority Customer Support',
                    'Fraud Detection',
                ],
            },
            {
                id: 'availability',
                heading: 'Available Countries & Regions',
                bullets: ['USA', 'UK', 'Europe', 'Nigeria', 'Ghana', 'South Africa', 'Kenya'],
            },
            {
                id: 'subscribe',
                heading: 'Subscribe to QavTix Plans',
                content: 'You can sign up for a 14-day trial of QavTix Pricing & Plan, and a 2-day trial of featured events on your QavTix Host Account. When you sign up, you can select a monthly or annual subscription. After your trial ends, your subscription begins automatically.',
            },
            {
                id: 'cancel',
                heading: 'Cancel Your Subscription',
                content: 'You can cancel your QavTix Pricing & Plan subscription at any time. When you cancel, you\'ll stop future payments. Subscriptions to QavTix pricing & plan are nonrefundable.',
                steps: [
                    'Go to your profile dashboard',
                    'Navigate to Settings > Account > Manage Subscription',
                    'Under Subscription Plan, click "Cancel subscription"',
                    'Answer prompts',
                    'Click "Continue to cancel"',
                ],
            },
            {
                id: 'resume',
                heading: 'Resume Your Subscription',
                steps: [
                    'Go to your profile dashboard',
                    'Navigate to Settings > Account > Manage Subscription',
                    'Under "Subscription status", click Resume subscription then Resume',
                ],
            },
            {
                id: 'auto-renew',
                heading: 'Automatic Renewals',
                content: 'Your plan renews automatically on your selected billing cycle (monthly or annual). If auto-renew fails, a seven-day grace period applies. If you don\'t update your payment method within seven days, your subscription will auto-cancel.',
            },
            {
                id: 'refund-policy',
                heading: 'Refund Policy',
                content: 'QavTix Pricing & Plan subscription purchases are non-refundable. Plan features are yours to use for the length of your subscription period, even if you decide to cancel.',
            },
            {
                id: 'upgrade',
                heading: 'Upgrade Your Plan',
                steps: [
                    'Log in to your QavTix Host Account',
                    'Navigate to your Dashboard',
                    'Go to Settings > Account > Manage Subscription',
                    'Select Upgrade Plan',
                    'Choose your preferred plan (Professional or Enterprise)',
                    'Select your billing cycle (Monthly or Annual)',
                    'Confirm your payment method',
                    'Click Upgrade / Subscribe',
                ],
            },
            {
                id: 'change-card',
                heading: 'Change Your Debit Card',
                steps: [
                    'Go to your profile dashboard',
                    'Navigate to Settings > Account > Payment',
                    'Click "Change Default Card"',
                    'Choose the card you want to update',
                    'Click "Save Change"',
                ],
            },
        ],
    },
    {
        id: 'promotions',
        label: 'Promotions',
        icon: 'hugeicons:megaphone-01',
        sections: [
            {
                id: 'promo-codes',
                heading: 'Create and Use Promo Codes',
                content: 'Promo codes help event organizers increase ticket sales and reward attendees.',
            },
            {
                id: 'promo-features',
                heading: 'Available Promo Features',
                bullets: [
                    'Percentage discounts',
                    'Fixed amount discounts',
                    'Limited-use promo codes',
                    'Time-based campaigns',
                    'Exclusive referral campaigns',
                ],
            },
            {
                id: 'promo-limits',
                heading: 'Promo Code Limits by Plan',
                subsections: [
                    { heading: 'Professional Plan', bullets: ['Up to 100 discount codes'] },
                    { heading: 'Enterprise Plan', bullets: ['Up to 500 discount codes'] },
                ],
            },
            {
                id: 'create-promo',
                heading: 'How to Create Promo Codes',
                steps: [
                    'Go to Dashboard',
                    'Select your event',
                    'Navigate to Marketing > Promo Codes',
                    'Click Create Promo Code',
                    'Configure: discount amount, expiration date, usage limit',
                    'Save changes',
                ],
            },
            {
                id: 'featured',
                heading: 'Featured Event Promotion (Add-On Plan)',
                content: 'QavTix offers a Featured Event Plan to help you promote events and increase visibility. Plans available: Daily, 3-Day, 1-Week, Monthly.',
            },
        ],
    },
    {
        id: 'operations',
        label: 'Operations',
        icon: 'hugeicons:ticket-01',
        sections: [
            {
                id: 'checkin',
                heading: 'QR Code Check-In System',
                content: 'QavTix includes a QR code check-in system to simplify attendee entry and improve event security.',
            },
            {
                id: 'checkin-features',
                heading: 'Check-In Features',
                bullets: [
                    'Fast QR code scanning',
                    'Real-time attendee validation',
                    'Duplicate ticket detection',
                    'Attendance tracking',
                    'Live check-in monitoring',
                ],
            },
            {
                id: 'checkin-steps',
                heading: 'How to Check In Attendees',
                steps: [
                    'Open the QavTix Host Check-In Tool',
                    'Select your event',
                    'Scan attendee QR code',
                    'Verify attendee details',
                    'Approve entry',
                ],
            },
            {
                id: 'transfer',
                heading: 'Ticket Transfer',
                content: 'QavTix allows attendees to securely transfer eligible tickets to another user.',
            },
            {
                id: 'transfer-rules',
                heading: 'Transfer Rules',
                bullets: [
                    'Some event organizers may disable ticket transfers',
                    'Transferred tickets cannot be duplicated',
                    'Transfer history is recorded for fraud prevention',
                ],
            },
            {
                id: 'resale',
                heading: 'Ticket Resale Marketplace',
                content: 'QavTix provides a secure resale marketplace where attendees can resell tickets they can no longer use. QavTix charges a 20% commission fee on completed resale transactions.',
            },
            {
                id: 'payouts',
                heading: 'Organizer Payouts',
                content: 'QavTix securely processes event earnings and payouts for hosts.',
            },
            {
                id: 'payout-process',
                heading: 'Payout Process',
                bullets: [
                    'Ticket sales are collected securely',
                    'Verification checks are completed',
                    'Funds become eligible for payout',
                    'Organizer receives payment to registered account',
                ],
            },
            {
                id: 'payout-requirements',
                heading: 'Payout Requirements',
                bullets: [
                    'Verified organizer account',
                    'Valid payout details',
                    'No unresolved fraud or dispute cases',
                ],
            },
        ],
    },
    {
        id: 'analytics',
        label: 'Analytics',
        icon: 'hugeicons:analytics-01',
        sections: [
            {
                id: 'analytics-overview',
                heading: 'Event Performance Analytics',
                content: 'QavTix provides real-time analytics tools to help organizers monitor event growth and ticket performance.',
            },
            {
                id: 'analytics-features',
                heading: 'Available Analytics Features',
                bullets: [
                    'Real-time ticket sales',
                    'Revenue performance charts',
                    'Customer profile insights',
                    'Referral tracking',
                    'Marketing performance metrics',
                    'Geographical breakdowns (Enterprise)',
                    'Week-based analysis (Enterprise)',
                ],
            },
            {
                id: 'analytics-access',
                heading: 'How to Access Analytics',
                steps: [
                    'Log in to Dashboard',
                    'Select your event',
                    'Open Analytics',
                ],
            },
            {
                id: 'analytics-metrics',
                heading: 'Metrics You Can Track',
                bullets: [
                    'Tickets sold',
                    'Revenue generated',
                    'Conversion performance',
                    'Attendee locations',
                    'Marketing campaign effectiveness',
                ],
            },
        ],
    },
    {
        id: 'policies',
        label: 'Policies',
        icon: 'hugeicons:document-validation',
        sections: [
            {
                id: 'commission',
                heading: 'Platform Commission Structure',
                content: 'QavTix charges commissions for platform services and optional promotional features.',
            },
            {
                id: 'fees',
                heading: 'Standard Platform Fees',
                bullets: [
                    'Ticket sales',
                    'Ticket resale transactions',
                    'Featured event promotions',
                    'Marketing add-on services',
                ],
            },
            {
                id: 'resale-fee',
                heading: 'Ticket Resale Commission',
                bullets: ['20% commission fee on completed resale marketplace transactions'],
            },
            {
                id: 'privacy',
                heading: 'Privacy & Data Protection',
                content: 'QavTix is committed to protecting organizer and attendee data.',
            },
            {
                id: 'privacy-measures',
                heading: 'Security Measures',
                bullets: [
                    'Encrypted transactions',
                    'Secure authentication systems',
                    'Fraud detection monitoring',
                    'Controlled access permissions',
                ],
            },
            {
                id: 'organizer-responsibilities',
                heading: 'Organizer Responsibilities',
                bullets: [
                    'Use attendee data responsibly',
                    'Avoid unauthorized data sharing',
                    'Comply with applicable privacy regulations',
                ],
            },
            {
                id: 'refund-policy',
                heading: 'Refund Policy',
                content: 'QavTix subscription purchases are non-refundable. Event ticket refund policies depend on the event organizer\'s settings.',
            },
            {
                id: 'refund-types',
                heading: 'Types of Refunds',
                bullets: [
                    'Full refunds',
                    'Partial refunds',
                    'Event cancellation refunds',
                    'Organizer-approved refunds',
                ],
            },
        ],
    },
]

// ─── ATTENDEE TOPICS ──────────────────────────────────────────────────────────

export const ATTENDEE_TOPICS: HelpTopic[] = [
    {
        id: 'tickets-events',
        label: 'Tickets & Events',
        icon: 'hugeicons:ticket-02',
        sections: [
            {
                id: 'buying',
                heading: 'Buying Tickets',
                content: 'QavTix makes it easy to discover and purchase tickets for events in your area.',
            },
            {
                id: 'ticket-types',
                heading: 'Ticket Types Available',
                bullets: [
                    'Standard tickets',
                    'VIP tickets',
                    'Early bird tickets',
                    'Group tickets',
                ],
            },
            {
                id: 'ticket-transfer',
                heading: 'Ticket Transfer',
                content: 'QavTix allows attendees to securely transfer eligible tickets to another user.',
            },
            {
                id: 'transfer-how',
                heading: 'How Ticket Transfer Works',
                steps: [
                    'Original ticket owner selects Transfer Ticket',
                    'Recipient receives a transfer notification',
                    'Once accepted, ticket ownership updates automatically',
                    'QR code refreshes for security purposes',
                ],
            },
            {
                id: 'resale',
                heading: 'Ticket Resale Marketplace',
                content: 'QavTix provides a secure resale marketplace where you can resell tickets you can no longer use. QavTix charges a 20% commission fee on completed resale transactions.',
            },
            {
                id: 'resale-features',
                heading: 'Resale Features',
                bullets: [
                    'Secure buyer-to-buyer ticket transfers',
                    'Fraud protection verification',
                    'Real-time ticket ownership updates',
                    'Automated commission deductions',
                ],
            },
        ],
    },
    {
        id: 'event-entry',
        label: 'Event Entry & Check-In',
        icon: 'hugeicons:qr-code',
        sections: [
            {
                id: 'qr-checkin',
                heading: 'QR Code Check-In',
                content: 'Your ticket includes a unique QR code used for entry verification at the event.',
            },
            {
                id: 'checkin-process',
                heading: 'What Happens During Check-In',
                bullets: [
                    'Tickets are validated instantly',
                    'Duplicate scans are blocked automatically',
                    'Entry time is recorded in the system',
                ],
            },
            {
                id: 'qr-not-working',
                heading: 'QR Code Not Working',
                bullets: [
                    'Ensure internet connection is active',
                    'Refresh scanner session',
                    'Confirm the ticket has not already been used',
                ],
            },
            {
                id: 'invalid-ticket',
                heading: 'Invalid Ticket',
                bullets: [
                    'Verify ticket was purchased through QavTix',
                    'Check if the ticket was refunded, canceled, or transferred',
                ],
            },
        ],
    },
    {
        id: 'refunds-cancellation',
        label: 'Refunds & Cancellation',
        icon: 'hugeicons:money-receive-02',
        sections: [
            {
                id: 'refund-policy',
                heading: 'Refund Policy',
                content: 'QavTix subscription purchases are non-refundable. Event ticket refund policies depend on the event organizer\'s settings.',
            },
            {
                id: 'refund-types',
                heading: 'Types of Refunds',
                bullets: [
                    'Full refunds',
                    'Partial refunds',
                    'Event cancellation refunds',
                    'Organizer-approved refunds',
                ],
            },
            {
                id: 'refund-process',
                heading: 'How Refund Requests Work',
                steps: [
                    'Attendee submits refund request',
                    'Organizer reviews request',
                    'Approved refunds are processed to the original payment method',
                ],
            },
            {
                id: 'event-cancellation',
                heading: 'Event Cancellation',
                bullets: [
                    'Attendees may receive a full refund',
                    'Refund notifications are sent automatically',
                    'Ticket QR codes become invalid immediately',
                ],
            },
        ],
    },
    {
        id: 'account-security',
        label: 'Account & Security',
        icon: 'hugeicons:shield-user',
        sections: [
            {
                id: 'account-overview',
                heading: 'Your QavTix Account',
                content: 'Your QavTix account keeps all your tickets, event history, and preferences in one place.',
            },
            {
                id: 'data-protection',
                heading: 'Data We Protect',
                bullets: [
                    'Personal account information',
                    'Payment information',
                    'Ticket purchase history',
                    'Event attendance records',
                    'Marketing preferences',
                ],
            },
            {
                id: 'security-measures',
                heading: 'Security Measures',
                bullets: [
                    'Encrypted transactions',
                    'Secure authentication systems',
                    'Fraud detection monitoring',
                    'Controlled access permissions',
                ],
            },
            {
                id: 'account-deletion',
                heading: 'Account Deletion',
                content: 'You may request deletion of your account at any time through the Platform or by contacting support. See our Data Deletion Policy for full details.',
            },
        ],
    },
]

// ─── SEARCH QUICK-FILTER TAGS ─────────────────────────────────────────────────

export const HOST_QUICK_FILTERS = [
    'Ticket resale',
    'Check-in',
    'Promo codes',
    'Plans & Pricing',
    'Refunds',
    'Payouts',
]

export const ATTENDEE_QUICK_FILTERS = [
    'Ticket transfer',
    'QR code',
    'Refunds',
    'Account',
    'Event entry',
    'Cancellation',
]
