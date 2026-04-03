'use client'

import Image from 'next/image'
import { z } from 'zod'
import { useState } from 'react'
import { space_grotesk } from '@/lib/fonts'
import { subscribeToCity } from '@/actions/subscribe'
import { useAppDispatch } from '@/lib/redux/hooks'
import { showAlert } from '@/lib/redux/slices/alertSlice'

const emailSchema = z.email('Please enter a valid email address')

interface HeroStat {
    label: string
    value: number
}

interface Props {
    heading:       string
    description:   string
    stats:         HeroStat[]         // e.g. [{ label: "Events", value: 30 }, { label: "Subscribers", value: 230 }]
    imageSrc?:     string
    subscribeKey?: string             // the city/category/tour key sent to the API
}

const DEFAULT_IMAGE = "/images/demo-images/d5e805332d43cd0ed9dd77016db84f44acf2d7c4.jpg"

export default function EventSectionHero({
    heading,
    description,
    stats,
    imageSrc = DEFAULT_IMAGE,
    subscribeKey,
}: Props) {

    const [email,        setEmail]        = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useAppDispatch()

    const handleSubscribe = async () => {
        const validation = emailSchema.safeParse(email)
        if (!validation.success) {
            dispatch(showAlert({ variant: "destructive", title: "Request Failed", description: validation.error.issues[0].message }))
            return
        }
        if (!subscribeKey) return

        setIsSubmitting(true)
        const result = await subscribeToCity(subscribeKey, email)
        setIsSubmitting(false)

        if (result.success) {
            dispatch(showAlert({ variant: "success", title: "", description: 'Successfully subscribed!' }))
            setEmail('')
        } else {
            dispatch(showAlert({ variant: "destructive", title: "Request Failed", description: result.message ?? 'Something went wrong. Please try again.' }))
        }
    }

    return (
        <section
            className="relative w-full overflow-hidden sm:px-10 lg:px-12 xl:px-16"
            data-testid="event-section-hero"
        >
            {/* Mobile background */}
            <div className="md:hidden absolute inset-0">
                <Image src={imageSrc} alt={heading} fill className="object-cover" priority />
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
            </div>

            <div className="md:flex gap-8 justify-between items-center">
                <div className="relative z-10 flex flex-col justify-end min-h-screen md:w-1/2 md:min-h-0 px-4 md:px-0 pb-12 pt-20 md:py-0">
                    <div className="space-y-6 max-w-xl">

                        {/* Heading */}
                        <div className="space-y-3">
                            <h2 className={`
                                text-2xl max-w-[10em] capitalize sm:text-3xl font-medium md:font-bold leading-tight
                                text-white md:text-secondary-9
                                [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] md:text-shadow-none
                                ${space_grotesk.className}
                            `}>
                                {heading}
                            </h2>
                            <p className="
                                text-secondary-1 md:text-neutral-7 mt-5 text-sm leading-relaxed
                                [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] md:text-shadow-none
                            ">
                                {description}
                            </p>
                        </div>

                        {/* Stats — dynamic, any number of pairs */}
                        <div className={`${space_grotesk.className} flex items-center gap-5 flex-wrap`}>
                            {stats.map((stat, i) => (
                                <div key={stat.label} className="flex items-center gap-5">
                                    {i > 0 && <div className="w-0.5 h-12 bg-neutral-6" />}
                                    <div>
                                        <p className="
                                            text-xl font-medium text-white md:text-neutral-7
                                            drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)] md:drop-shadow-none
                                            [text-shadow:0_2px_8px_rgba(0,0,0,0.6)] md:text-shadow-none
                                        ">
                                            {stat.value.toLocaleString()}
                                        </p>
                                        <p className="text-white md:text-secondary-9 font-medium mt-1">
                                            {stat.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Subscribe input — only renders when subscribeKey is provided */}
                        {subscribeKey && (
                            <div className="space-y-2 md:mt-8 max-w-xl">
                                <div className="flex flex-wrap gap-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="Enter email address"
                                        disabled={isSubmitting}
                                        data-testid="subscribe-email"
                                        className="flex-1 p-4 rounded-sm bg-neutral-3/90 backdrop-blur-sm text-xs md:text-sm text-neutral-8 placeholder:text-neutral-7 outline-none focus:ring-2 focus:ring-white transition-all"
                                    />
                                    <button
                                        onClick={handleSubscribe}
                                        disabled={isSubmitting || !email.trim()}
                                        data-testid="subscribe-submit"
                                        className="px-8 py-4 rounded-full bg-secondary-6 text-white font-medium text-sm hover:bg-secondary-7 disabled:hover:bg-secondary-6 active:scale-95 disabled:cursor-not-allowed transition-all whitespace-nowrap"
                                    >
                                        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop image */}
                <div className="hidden md:block relative w-2/5 aspect-square rounded-4xl overflow-hidden shadow-2xl">
                    <Image src={imageSrc} alt={heading} fill className="object-cover" priority />
                </div>
            </div>
        </section>
    )
}