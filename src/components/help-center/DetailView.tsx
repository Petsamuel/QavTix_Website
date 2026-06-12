'use client'

import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import type { HelpTopic } from '@/components-data/help-center-data'
import { NAV_LINKS } from '@/components-data/navigation/navLinks'
import { slideIn, fadeUp } from './help-center-variants'

// ─── Single section block ─────────────────────────────────────────────────────

function SectionBlock({ section }: { section: HelpTopic['sections'][number] }) {
    return (
        <div className="space-y-3">
            {/* Section heading */}
            <h2 className={cn(space_grotesk.className, 'text-base font-semibold text-secondary-9')}>
                {section.heading}
            </h2>

            {/* Intro text */}
            {section.content && (
                <p className="text-secondary-7 text-sm leading-relaxed">
                    {section.content}
                </p>
            )}

            {/* Bullet list */}
            {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-1.5 pl-1">
                    {section.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-8">
                            <span className="mt-2 size-1.5 rounded-full bg-secondary-7 shrink-0" />
                            {b}
                        </li>
                    ))}
                </ul>
            )}

            {/* Numbered steps */}
            {section.steps && section.steps.length > 0 && (
                <ol className="space-y-2 pl-1">
                    {section.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-secondary-8">
                            <span className="shrink-0 font-medium text-secondary-9 min-w-5">
                                {i + 1}.
                            </span>
                            {step}
                        </li>
                    ))}
                </ol>
            )}

            {/* Subsections */}
            {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-3 pl-4">
                    {section.subsections.map((sub, i) => (
                        <div key={i} className="space-y-1.5">
                            <h3 className="text-sm font-semibold text-secondary-9">{sub.heading}</h3>
                            {sub.content && (
                                <p className="text-sm text-secondary-7">{sub.content}</p>
                            )}
                            {sub.bullets && sub.bullets.length > 0 && (
                                <ul className="space-y-1 pl-1">
                                    {sub.bullets.map((b, j) => (
                                        <li key={j} className="flex items-start gap-2.5 text-sm text-secondary-8">
                                            <span className="mt-2 size-1.5 rounded-full bg-secondary-5 shrink-0" />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface DetailViewProps {
    topics: HelpTopic[]
    activeTopic: HelpTopic
    onTopicChange: (t: HelpTopic) => void
    onBack: () => void
    tabLabel: string
}

// ─── Detail View ──────────────────────────────────────────────────────────────

export default function DetailView({
    topics,
    activeTopic,
    onTopicChange,
    onBack,
    tabLabel,
}: DetailViewProps) {
    return (
        <motion.div
            key="detail-view"
            variants={slideIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className="flex gap-0 min-h-[600px] min-w-0 lg:min-w-[340px]"
        >
            {/* Left sidebar nav — desktop only */}
            <nav className="hidden lg:block w-52 shrink-0 border-r border-neutral-4 pr-4 pt-1 space-y-0.5 self-start sticky top-24">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-6 mb-5 pb-4 border-b border-neutral-4">
                    <button onClick={onBack} className="text-primary-6 font-medium hover:underline">
                        Help
                    </button>
                    /
                    <span className="capitalize font-medium text-secondary-7">{tabLabel}</span>
                </div>

                {topics.map(t => (
                    <button
                        key={t.id}
                        onClick={() => onTopicChange(t)}
                        className={cn(
                            'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-150',
                            activeTopic.id === t.id
                                ? 'bg-primary-1 text-primary-7'
                                : 'text-secondary-7 hover:bg-neutral-2 hover:text-secondary-9'
                        )}
                    >
                        <Icon
                            icon={t.icon}
                            className={cn('size-[18px] shrink-0', activeTopic.id === t.id ? 'text-primary-6' : 'text-secondary-5')}
                        />
                        <span className="truncate">
                            {t.label.split(' &')[0]}
                        </span>
                    </button>
                ))}
            </nav>

            {/* Content area */}
            <div className="flex-1 min-w-0 lg:pl-20 pt-1">

                {/* Mobile breadcrumb */}
                <div className="flex lg:hidden items-center gap-1.5 text-xs text-neutral-6 mb-4">
                    <button onClick={onBack} className="text-primary-6 font-medium hover:underline">
                        Help
                    </button>
                    /
                    <span className="capitalize font-medium text-secondary-7">{tabLabel}</span>
                </div>

                {/* Topic heading */}
                <h1 className={cn(space_grotesk.className, 'text-2xl font-semibold text-secondary-9 mb-8')}>
                    {activeTopic.label}
                </h1>

                {/* All sections — continuous scroll, matching design */}
                <motion.div
                    key={activeTopic.id}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="space-y-8"
                >
                    {activeTopic.sections.map(section => (
                        <SectionBlock key={section.id} section={section} />
                    ))}
                </motion.div>

                {/* Still need help */}
                <div className="mt-14 p-6 rounded-2xl bg-secondary-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div>
                        <p className={cn(space_grotesk.className, 'font-bold text-xl mb-1')}>Still need help?</p>
                        <p className="text-secondary-3 text-sm">
                            Our support team is always ready to assist you with anything not covered here.
                        </p>
                    </div>
                    <Link
                        href={NAV_LINKS.CONTACT_US.href}
                        className="shrink-0 inline-flex items-center gap-2 bg-primary-6 hover:bg-primary-7 text-white font-semibold text-sm px-5 py-3 rounded-full transition-colors"
                    >
                        Contact us <Icon icon="lucide:arrow-right" className="size-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    )
}
