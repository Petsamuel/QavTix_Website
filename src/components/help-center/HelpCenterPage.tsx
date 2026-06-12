'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import {
    HOST_TOPICS,
    ATTENDEE_TOPICS,
    HOST_QUICK_FILTERS,
    ATTENDEE_QUICK_FILTERS,
} from '@/components-data/help-center-data'
import type { HelpTopic } from '@/components-data/help-center-data'
import { NAV_LINKS } from '@/components-data/navigation/navLinks'
import SectionHeading from '../shared/SectionHeading'
import HelpHero from './HelpHero'
import TopicCard from './TopicCard'
import DetailView from './DetailView'
import { gridVariants, cardVariants } from './help-center-variants'

type TabType = 'host' | 'attendee'

export default function HelpCenterPage() {
    const [tab, setTab] = useState<TabType>('host')
    const [selectedTopic, setSelectedTopic] = useState<HelpTopic | null>(null)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState<string | null>(null)

    const topics = tab === 'host' ? HOST_TOPICS : ATTENDEE_TOPICS
    const quickFilters = tab === 'host' ? HOST_QUICK_FILTERS : ATTENDEE_QUICK_FILTERS

    // Reset everything when tab changes
    useEffect(() => {
        setSelectedTopic(null)
        setSearch('')
        setActiveFilter(null)
    }, [tab])

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setActiveFilter(null)
        setSelectedTopic(null)   // dismiss detail view so grid is visible
    }

    const handleClearSearch = () => {
        setSearch('')
        setActiveFilter(null)
        // intentionally keep topic open when user clears search manually
    }

    const handleFilterClick = (f: string) => {
        if (activeFilter === f) {
            setActiveFilter(null)
            setSearch('')
        } else {
            setActiveFilter(f)
            setSearch(f)
        }
    }

    const filteredTopics = useMemo(() => {
        if (!search.trim()) return topics
        const q = search.toLowerCase()
        return topics.filter(t =>
            t.label.toLowerCase().includes(q) ||
            t.sections.some(s =>
                s.heading.toLowerCase().includes(q) ||
                (s.content ?? '').toLowerCase().includes(q) ||
                (s.bullets ?? []).some(b => b.toLowerCase().includes(q)) ||
                (s.steps ?? []).some(b => b.toLowerCase().includes(q))
            )
        )
    }, [topics, search])

    return (
        <main>
            <SectionHeading title="Help" />

            {/* Hero — search + quick filters */}
            <HelpHero
                search={search}
                onSearchChange={handleSearchChange}
                onClearSearch={handleClearSearch}
                quickFilters={quickFilters}
                activeFilter={activeFilter}
                onFilterClick={handleFilterClick}
            />

            {/* Topics section */}
            <section className="global-px md:pt-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-10 md:gap-20 items-start">

                    {/* Tab switcher — desktop: hidden while a topic is open */}
                    {!selectedTopic && (
                        <div className="hidden lg:flex flex-col gap-10 shrink-0 top-24 pt-1 min-w-24">
                            {(['host', 'attendee'] as TabType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={cn(
                                        space_grotesk.className,
                                        'flex items-center gap-3 text-[2.5rem] font-medium capitalize transition-all duration-200',
                                        tab === t
                                            ? 'text-secondary-9 opacity-100'
                                            : 'text-secondary-7 opacity-40 hover:opacity-70'
                                    )}
                                >
                                    <span className="block w-5 h-px border-t-2 border-secondary-9" />
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Tab switcher — mobile: hidden while a topic is open */}
                    {!selectedTopic && (
                        <div className="flex lg:hidden gap-3 w-full mb-2">
                            {(['host', 'attendee'] as TabType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className={cn(
                                        'flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize border transition-all duration-200',
                                        tab === t
                                            ? 'bg-primary-1 border-primary-3 text-primary-7'
                                            : 'bg-neutral-2 border-transparent text-secondary-6 hover:bg-neutral-3'
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content area — grid or detail view */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {selectedTopic ? (
                                <DetailView
                                    key="detail"
                                    topics={topics}
                                    activeTopic={selectedTopic}
                                    onTopicChange={setSelectedTopic}
                                    onBack={() => setSelectedTopic(null)}
                                    tabLabel={tab}
                                />
                            ) : (
                                <motion.div
                                    key={`grid-${tab}`}
                                    variants={gridVariants}
                                    initial="hidden"
                                    animate="show"
                                    exit="exit"
                                >
                                    {/* Empty state */}
                                    {filteredTopics.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-24 text-secondary-5"
                                        >
                                            <Icon icon="hugeicons:search-remove-02" className="size-14 mb-4 opacity-30" />
                                            <p className="font-semibold text-lg text-secondary-7">No results for &ldquo;{search}&rdquo;</p>
                                            <p className="text-sm mt-1">Try a different keyword or clear the search</p>
                                        </motion.div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8">
                                            {filteredTopics.map(topic => (
                                                <TopicCard
                                                    key={topic.id}
                                                    topic={topic}
                                                    onClick={() => setSelectedTopic(topic)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Still need help */}
                                    {!search && (
                                        <motion.div
                                            variants={cardVariants}
                                            className="mt-20 p-8 min-h-28 md:min-h-44 rounded-2xl bg-secondary-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                                        >
                                            <div>
                                                <p className={cn(space_grotesk.className, 'font-bold text-2xl mb-1')}>
                                                    Still need help?
                                                </p>
                                                <p className="text-secondary-3 text-sm">
                                                    Our support team is always ready to assist you with anything not covered here.
                                                </p>
                                            </div>
                                            <Link
                                                href={NAV_LINKS.CONTACT_US.href}
                                                className="shrink-0 inline-flex items-center gap-2 bg-primary-6 hover:bg-primary-7 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors"
                                            >
                                                Contact us <Icon icon="lucide:arrow-right" className="size-4" />
                                            </Link>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </main>
    )
}
