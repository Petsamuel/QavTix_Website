'use client'

import { space_grotesk } from '@/lib/fonts'
import { Icon } from '@iconify/react'

interface FeatureCardProps {
    icon: string
    iconBg: string
    iconColor: string
    cardBg: string
    title: string
    textColor?: string
    description: string
}

function FeatureCard({ icon, iconBg, iconColor, textColor, cardBg, title, description }: FeatureCardProps) {
    return (
        <div className={`rounded-3xl p-6 ${cardBg} backdrop-blur-2xl group flex flex-col justify-between gap-6`}>
            <div>
                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-all ease-linear duration-200`}>
                    <Icon
                        icon={icon}
                        width="26"
                        height="26"
                        className={`${iconColor}`}
                    />
                </div>

                <h3 className={`text-xl font-medium max-w-[6ch] leading-tight ${space_grotesk.className} ${textColor || "text-neutral-9"}`}>
                    {title}
                </h3>
            </div>

            <p className={`text-sm leading-relaxed ${textColor || "text-neutral-7"}`}>
                {description}
            </p>
        </div>
    )
}


const features: FeatureCardProps[] = [
    {
        icon: 'hugeicons:money-security',
        iconColor: 'text-neutral-8',
        iconBg: 'bg-white',
        cardBg: 'bg-secondary-9',
        textColor: "text-neutral-2",
        title: 'Secure Payment',
        description: 'Transactions is protected with advanced bank-level encryption, ensuring a trusted, reliable, and seamless checkout experience.'
    },
    {
        icon: 'hugeicons:ticket-01',
        iconBg: 'bg-accent-6',
        cardBg: 'bg-linear-to-br from-accent-1/10 to-accent-1',
        iconColor: 'text-white',
        title: 'Instant Ticket',
        description: 'Receive tickets instantly after purchase with fast digital delivery, ensuring immediate access to every booked event.'
    },
    {
        icon: 'hugeicons:customer-support',
        iconBg: 'bg-secondary-6',
        cardBg: 'bg-linear-to-br from-secondary-1/10 to-secondary-6/10',
        iconColor: 'text-white',
        title: '24/7 Support',
        description: 'Our dedicated support team is available anytime to assist, answer questions, and ensure a smooth, stress-free experience.'
    },
    {
        icon: 'hugeicons:money-exchange-01',
        iconBg: 'bg-primary-1',
        cardBg: 'bg-linear-to-br from-primary-1/10 to-primary-6/10',
        iconColor: 'text-primary-6',
        title: 'Refund Protection',
        description: 'Shop confidently knowing eligible cancellations are covered through clear, fair, and dependable refund protection policies.'
    }
]


export default function FeatureCards() {

    return (
        <section className="py-16">
            <div className="max-w-8xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            iconBg={feature.iconBg}
                            cardBg={feature.cardBg}
                            iconColor={feature.iconColor}
                            textColor={feature.textColor}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}