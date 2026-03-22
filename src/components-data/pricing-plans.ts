// 
// QavTix Pricing Plans
// Source: QAVTIX PROJECT PRICING & RBAC document (March 2026)
// Plan IDs match the keys used in PricingFeature — do not rename without
// updating DesktopFeatureComparison and MobileFeatureComparison too.
// 

//  Host Plans 

export const hostPricingData: PricingData = {
    plans: [
        {
            id:           'standard',
            name:         'Standard Plan',
            price:        0,
            currency:     '₦',
            perTicketFee: 0,
            description:  'Start hosting with no monthly fee. Perfect for testing the waters with up to 2 active events at a time.',
            features: [
                '2 active events at a time',
                'Single ticket type per event',
                'Basic event setup',
                'Real-time sales insights',
                'Downloadable attendee list (up to 250)',
                'QR code check-in system',
                'Fraud detection',
                'Email support',
                'Group sharing',
            ],
            buttonText:    'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id:            'pro',
            name:          'Pro Plan',
            price:         25000,
            currency:      '₦',
            perTicketFee:  0,
            description:   'Everything you need to grow. Unlock advanced analytics, marketing tools, and team access. First 30 days FREE.',
            features: [
                'Everything in Free Plan',
                'Unlimited event creation',
                'Unlimited ticket categories',
                'Advanced event setup',
                'Revenue performance chart',
                'Week-based sales analysis',
                'Integrated marketing dashboard',
                'Built-in email campaigns (100 sends/month)',
                'Exclusive discount codes (up to 100)',
                'Referral sales program',
                'Team permissions (1 team member)',
                'Downloadable attendee list (up to 1,000)',
                'Priority email support',
            ],
            buttonText:    'Start free trial',
            buttonVariant: 'primary',
            highlighted:   true,
            trial:         'First 30 days FREE',
        },
        {
            id:            'enterprise',
            name:          'Enterprise Plan',
            price:         0,
            currency:      'Custom',
            perTicketFee:  0,
            description:   'Maximum power for large-scale organisations. Full analytics, resale controls, dedicated support, and custom pricing.',
            features: [
                'Everything in Pro Plan',
                'Unlimited team members (3 included)',
                'Geographical breakdown analytics',
                'Customer profile insights',
                'Exclusive discount codes (up to 500)',
                'Sponsored email campaigns',
                'Featured event listing (2 weeks included)',
                'Bulk refunds (where applicable)',
                'Dedicated account manager',
                'Ticket resale controls (up to +20%)',
                'Fraud detection & resale controls',
                'Advanced security options',
                'Priority customer support',
                'Custom integrations & workflows',
            ],
            buttonText:    'Contact sales',
            buttonVariant: 'secondary',
        },
    ],

    // Feature comparison table
    // ✅  = true  (check icon)
    // 🔒  = false (lock icon)
    // string = specific value shown as text
    features: [
        //  Event Management 
        { category: 'Event Management', name: 'Active Events',                 free: '2 max',       pro: 'Unlimited',     enterprise: 'Unlimited'         },
        { category: 'Event Management', name: 'Event Setup',                   free: 'Basic',       pro: 'Advanced',      enterprise: 'Advanced'          },
        { category: 'Event Management', name: 'Ticket Categories',             free: 'Single type', pro: 'Unlimited',     enterprise: 'Unlimited'         },
        { category: 'Event Management', name: 'Discount & Promo Codes',        free: false,         pro: 'Up to 100',     enterprise: 'Up to 500'         },
        { category: 'Event Management', name: 'Referral / Affiliate Program',  free: false,         pro: true,            enterprise: true                },
        { category: 'Event Management', name: 'QR Code Check-In',             free: true,          pro: true,            enterprise: true                },
        { category: 'Event Management', name: 'Bulk Refunds',                  free: false,         pro: false,           enterprise: 'Where applicable'  },
        { category: 'Event Management', name: 'Ticket Resale Controls',        free: false,         pro: false,           enterprise: 'Up to +20%'        },
        { category: 'Event Management', name: 'Group Sharing',                 free: true,          pro: true,            enterprise: true                },

        //  Team & Access
        { category: 'Team & Access',    name: 'Team Permissions',              free: false,         pro: '1 member',      enterprise: '3 members'         },

        //  Analytics & Reports 
        { category: 'Analytics',        name: 'Real-Time Sales Insights',      free: true,          pro: true,            enterprise: true                },
        { category: 'Analytics',        name: 'Revenue Performance Chart',     free: false,         pro: true,            enterprise: true                },
        { category: 'Analytics',        name: 'Week-Based Sales Analysis',     free: false,         pro: true,            enterprise: true                },
        { category: 'Analytics',        name: 'Geographical Breakdown',        free: false,         pro: false,           enterprise: true                },
        { category: 'Analytics',        name: 'Customer Profile Insights',     free: false,         pro: false,           enterprise: true                },
        { category: 'Analytics',        name: 'Attendee List Export',          free: 'Up to 250',   pro: 'Up to 1,000',   enterprise: 'Unlimited'         },

        //  Marketing 
        { category: 'Marketing',        name: 'Integrated Marketing Dashboard',free: false,         pro: true,            enterprise: true                },
        { category: 'Marketing',        name: 'Built-in Email Campaigns',      free: false,         pro: '100/month',     enterprise: '100/month'         },
        { category: 'Marketing',        name: 'Sponsored Email Campaign',      free: false,         pro: false,           enterprise: true                },
        { category: 'Marketing',        name: 'Featured Event Listing',        free: false,         pro: false,           enterprise: '2 weeks free'      },

        //  Support & Security
        { category: 'Support',          name: 'Email Support',                 free: 'Standard',    pro: 'Priority',      enterprise: 'Priority'          },
        { category: 'Support',          name: 'Dedicated Account Manager',     free: false,         pro: false,           enterprise: true                },
        { category: 'Support',          name: 'Fraud Detection',               free: true,          pro: true,            enterprise: true                },
        { category: 'Support',          name: 'Advanced Security Options',     free: false,         pro: false,           enterprise: true                },
    ],
}

//  Attendee Plans
// Attendees pay per ticket only — no monthly subscription.
// Source: Individual Pricing Plan section of the doc.

export const attendeePricingData: PricingData = {
    plans: [
        {
            id:           'standard',
            name:         'Standard',
            price:        0,
            currency:     '₦',
            perTicketFee: 0,
            description:  'Discover and attend free events with no cost. Enjoy basic ticketing and event discovery.',
            features: [
                'Browse all public events',
                'Ticket purchase & QR code delivery',
                'Group ticket sharing',
                'Basic event reminders',
                'Standard customer support',
            ],
            buttonText:    'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id:            'pro',
            name:          'Pro',
            price:         2500,
            currency:      '₦',
            perTicketFee:  0,
            description:   'Unlock ticket resale, group savings, and early access. Built for frequent event-goers.',
            features: [
                'Everything in Free',
                'Ticket resale marketplace access',
                'Early bird & exclusive event access',
                'Group sharing & split payments',
                'Priority customer support',
                'Monthly event digest',
            ],
            buttonText:    'Upgrade to Pro',
            buttonVariant: 'primary',
            highlighted:   true,
        },
        {
            id:            'enterprise',
            name:          'Corporate',
            price:         10000,
            currency:      '₦',
            perTicketFee:  0,
            description:   'For companies and organisations buying tickets in bulk. Centralised billing, team accounts, and reporting.',
            features: [
                'Everything in Pro',
                'Bulk ticket purchasing',
                'Centralised team billing',
                'Dedicated corporate account manager',
                'Custom team access & permissions',
                'Event spend reporting & export',
                'Priority access to sponsored events',
            ],
            buttonText:    'Contact sales',
            buttonVariant: 'secondary',
        },
    ],

    features: [
        //  Ticketing 
        { category: 'Ticketing',        name: 'Free Event Access',             free: true,          pro: true,            enterprise: true                },
        { category: 'Ticketing',        name: 'Paid Event Tickets',            free: true,          pro: true,            enterprise: true                },
        { category: 'Ticketing',        name: 'QR Code Ticket Delivery',       free: true,          pro: true,            enterprise: true                },
        { category: 'Ticketing',        name: 'Ticket Resale Access',          free: false,         pro: true,            enterprise: true                },
        { category: 'Ticketing',        name: 'Bulk Ticket Purchasing',        free: false,         pro: false,           enterprise: true                },

        //  Group & Social 
        { category: 'Group & Social',   name: 'Group Ticket Sharing',          free: true,          pro: true,            enterprise: true                },
        { category: 'Group & Social',   name: 'Split Payments in Groups',      free: false,         pro: true,            enterprise: true                },
        { category: 'Group & Social',   name: 'Team Accounts',                 free: false,         pro: false,           enterprise: true                },

        //  Access & Perks 
        { category: 'Access & Perks',   name: 'Early Bird / Exclusive Access', free: false,         pro: true,            enterprise: true                },
        { category: 'Access & Perks',   name: 'Priority Access — Sponsored',   free: false,         pro: false,           enterprise: true                },
        { category: 'Access & Perks',   name: 'Monthly Event Digest',          free: false,         pro: true,            enterprise: true                },

        //  Billing & Reporting 
        { category: 'Billing',          name: 'Centralised Team Billing',      free: false,         pro: false,           enterprise: true                },
        { category: 'Billing',          name: 'Spend Reporting & Export',      free: false,         pro: false,           enterprise: true                },

        //  Support 
        { category: 'Support',          name: 'Customer Support',              free: 'Standard',    pro: 'Priority',      enterprise: 'Priority'          },
        { category: 'Support',          name: 'Dedicated Account Manager',     free: false,         pro: false,           enterprise: true                },
    ],
}