import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'

interface Section {
    heading?: string
    content?: string | string[]
    subsections?: { heading?: string; content?: string | string[] }[]
}

interface LegalDocProps {
    title: string
    lastUpdated?: string
    effectiveDate?: string
    intro?: string
    sections: Section[]
    className?: string
}

function renderContent(content: string | string[]) {
    if (Array.isArray(content)) {
        return (
            <ul className="mt-3 space-y-2 list-none">
                {content.map((item, i) => (
                    <li key={i} className="flex gap-3 text-secondary-9 text-sm leading-relaxed">
                        <span className="mt-1.5 size-1.5 rounded-full bg-primary-6 shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        )
    }
    return <p className="mt-3 text-secondary-9 text-sm leading-relaxed whitespace-pre-line">{content}</p>
}

export default function LegalDocContent({ title, lastUpdated, effectiveDate, intro, sections, className }: LegalDocProps) {
    return (
        <article className={cn('pb-20', className)}>
            {/* Document heading */}
            <div className="mb-8 pb-6 border-b border-neutral-5">
                <h1 className={cn('text-3xl md:text-4xl font-bold text-secondary-9', space_grotesk.className)}>
                    {title}
                </h1>
                {(lastUpdated || effectiveDate) && (
                    <p className="mt-2 text-xs text-secondary-8">
                        {lastUpdated && <>Last updated: {lastUpdated}</>}
                        {lastUpdated && effectiveDate && <span className="mx-2">·</span>}
                        {effectiveDate && <>Effective: {effectiveDate}</>}
                    </p>
                )}
                {intro && (
                    <p className="mt-4 text-sm text-secondary-7 leading-relaxed">{intro}</p>
                )}
            </div>

            {/* Sections */}
            <div className="space-y-8">
                {sections.map((section, idx) => (
                    <section key={idx}>
                        {section.heading && (
                            <h2 className={cn('text-lg font-semibold text-secondary-9 uppercase')}>
                                {idx + 1}. {section.heading}
                            </h2>
                        )}
                        {section.content && renderContent(section.content)}

                        {section.subsections && (
                            <div className="mt-4 space-y-4 pl-4 border-l-2 border-neutral-4">
                                {section.subsections.map((sub, subIdx) => (
                                    <div key={subIdx}>
                                        {sub.heading && (
                                            <h3 className="text-sm font-semibold text-secondary-8 mt-3">
                                                {sub.heading}
                                            </h3>
                                        )}
                                        {sub.content && renderContent(sub.content)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                ))}
            </div>

            {/* Contact footer */}
            <div className="mt-16 p-6 rounded-2xl bg-primary-1 border border-primary-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-6 mb-2">Have a question?</p>
                <p className="text-sm text-secondary-7">
                    Contact us at{' '}
                    <a href="mailto:support@qavtix.com" className="text-primary-6 font-medium hover:underline">
                        support@qavtix.com
                    </a>{' '}
                    or call{' '}
                    <a href="tel:+2348034299410" className="text-primary-6 font-medium hover:underline">
                        +234 803 429 9410
                    </a>
                </p>
            </div>
        </article>
    )
}
