'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import type { HelpTopic } from '@/components-data/help-center-data'
import { cardVariants } from './help-center-variants'
import FestivalIcon from '../Svg-Icons/Festival'
import BigCreditCard from '../Svg-Icons/BigCreditCard'
import HelpPromotionIcon from '../Svg-Icons/HelpPromotionIcon'
import HelpOperationsIcon from '../Svg-Icons/HelpOperationsIcon'
import HelpPoliciesIcon from '../Svg-Icons/HelpPoliciesIcon'
import HelpAnalyticsIcon from '../Svg-Icons/HelpAnalyticsIcon'
import HelpCancellationIcon from '../Svg-Icons/HelpCancellationIcon'
import HelpEventEntryIcon from '../Svg-Icons/HelpEventEntryIcon'
import HelpAccountSecurityIcon from '../Svg-Icons/HelpAccountSecurityIcon'

// Map topic IDs → custom SVG components
const CUSTOM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    // Host topics
    'event-setup': FestivalIcon,
    'pricing': BigCreditCard,
    'promotions': HelpPromotionIcon,
    'operations': HelpOperationsIcon,
    'policies': HelpPoliciesIcon,
    'analytics': HelpAnalyticsIcon,
    // Attendee topics
    'tickets-events': BigCreditCard,
    'event-entry': HelpEventEntryIcon,
    'refunds-cancellation': HelpCancellationIcon,
    'account-security': HelpAccountSecurityIcon,
}

interface TopicCardProps {
    topic: HelpTopic
    onClick: () => void
}

export default function TopicCard({ topic, onClick }: TopicCardProps) {
    const CustomIcon = CUSTOM_ICONS[topic.id]

    return (
        <motion.button
            variants={cardVariants}
            onClick={onClick}
            className={cn(
                'group w-full flex flex-col items-center justify-end gap-10',
                'bg-neutral-3 rounded-4xl cursor-pointer',
                'h-52 sm:h-60 px-6 pt-6 pb-10 overflow-hidden',
                'hover:bg-neutral-4 transition-colors duration-200',
                'border border-transparent hover:border-neutral-5/80',
            )}
        >
            {/* Icon — custom SVG if available, Iconify fallback */}
            <div className="flex items-center justify-center size-16 text-secondary-7 group-hover:text-secondary-9 transition-colors duration-200">
                {CustomIcon ? (
                    <CustomIcon className="size-28 group-hover:scale-110 transition-transform duration-300 ease-out" />
                ) : (
                    <Icon
                        icon={topic.icon}
                        className="size-28 group-hover:scale-110 transition-transform duration-300 ease-out"
                    />
                )}
            </div>

            <span className={cn(
                space_grotesk.className,
                'text-base sm:text-lg text-neutral-9 group-hover:text-secondary-9 group-hover:font-medium',
                'transition-all duration-200 text-center capitalize',
            )}>
                {topic.label}
            </span>
        </motion.button>
    )
}
