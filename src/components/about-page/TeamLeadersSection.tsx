'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { space_grotesk } from '@/lib/fonts'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'

interface TeamMember {
    id: number
    name: string
    role: string
    image: string
    bio: string
}

const teamMembers: TeamMember[] = [
    {
        id: 1,
        name: 'Charles Favored',
        role: 'General Counsel',
        image: "/images/demo-images/e1a4a42ef6ef88f832562cc54e3dd6a31acde354.jpg",
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
    },
    {
        id: 2,
        name: 'Michael Anderson',
        role: 'Chief Executive Officer',
        image: "/images/demo-images/bef301984ae3bf1b8703e4ec91a45e32045fe523.jpg",
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
    },
    {
        id: 3,
        name: 'Sarah Williams',
        role: 'Chief Technology Officer',
        image: "/images/demo-images/b76f34c50f4f7854ebeeb92447d3311ffb8eaa5b.jpg",
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
    },
    {
        id: 4,
        name: 'Amy Jenny',
        role: 'Chief Executive Officer',
        image: "/images/demo-images/d5e805332d43cd0ed9dd77016db84f44acf2ddd4.jpeg",
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo'
    },
]

export default function TeamLeadersCarousel() {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [direction, setDirection] = useState(0) // -1 for prev, 1 for next

    // Mobile carousel
    const [mobileEmblaRef, mobileEmblaApi] = useEmblaCarousel({
        loop: true,
        align: 'center'
    })

    const scrollPrev = useCallback(() => {
        setDirection(-1)
        mobileEmblaApi?.scrollPrev()
    }, [mobileEmblaApi])

    const scrollNext = useCallback(() => {
        setDirection(1)
        mobileEmblaApi?.scrollNext()
    }, [mobileEmblaApi])

    const onMobileSelect = useCallback(() => {
        if (!mobileEmblaApi) return
        setSelectedIndex(mobileEmblaApi.selectedScrollSnap())
    }, [mobileEmblaApi])

    useEffect(() => {
        if (!mobileEmblaApi) return
        onMobileSelect()
        mobileEmblaApi.on('select', onMobileSelect)
    }, [mobileEmblaApi, onMobileSelect])

    const currentMember = teamMembers[selectedIndex]

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction > 0 ? 400 : -400,
            opacity: 0,
            scale: 1.1,
        }),
    }

    return (
        <section className="pt-20 pb-24">
            <div className="max-w-8xl mx-auto">
                <div className="mb-8 lg:mb-12 global-px">
                    <h2 className={`text-2xl sm:text-3xl md:text-[2rem] font-bold text-secondary-9 mb-4 ${space_grotesk.className}`}>
                        Meet Our Leaders
                    </h2>
                    <p className="text-neutral-8 text-base max-w-xl leading-5.5">
                        We're a collaborative team united by one mission: helping people to connects to everything they love (securely, instantly, and hassle free) anytime, anywhere.
                    </p>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden overflow-x-hidden">
                    <div className="flex flex-row-reverse items-center gap-3 mb-6 global-px pe-0!">
                        <div className="w-[27%] flex flex-row-reverse items-center justify-end overflow-hidden">
                            <div className="flex gap-4 h-full items-center">
                                {teamMembers.map((v, i) => (
                                    <div key={`${v.id}-${i}`} className="relative w-[10.5em] h-[12em] my-auto aspect-3/4 rounded-3xl overflow-hidden">
                                        <button onClick={scrollNext}>
                                            <Image
                                                src={teamMembers[(selectedIndex + i + 3) % teamMembers.length].image}
                                                alt="Next member"
                                                fill
                                                className="object-cover opacity-90"
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden" ref={mobileEmblaRef}>
                            <div className="flex">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="flex-[0_0_100%] rounded-[32px] overflow-hidden">
                                        <div className="relative aspect-3/4 w-full h-75">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 global-px">
                        <div>
                            <h3 className={`text-2xl sm:text-3xl md:text-[2rem] font-medium text-secondary-9 leading-8 ${space_grotesk.className}`}>
                                {currentMember.name}
                            </h3>
                            <p className="text-neutral-8 text-xs">{currentMember.role}</p>
                        </div>
                        <p className="text-neutral-7 text-sm leading-relaxed">{currentMember.bio}</p>
                        <div className="flex gap-3 sm:mt-8">
                            <button onClick={scrollPrev} className="w-12 h-12 rounded-full border-2 border-neutral-4 flex items-center justify-center hover:bg-neutral-2 active:scale-95 transition-all">
                                <Icon icon="si:chevron-left-line" width="24" height="24" className='text-secondary-6' />
                            </button>
                            <button onClick={scrollNext} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:bg-primary-7 active:scale-95 transition-all">
                                <Icon icon="si:chevron-right-line" width="24" height="24" className='text-white' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Fixed Entry/Exit Logic */}
                <div className="hidden md:block mt-20">
                    <div className="flex gap-4 lg:gap-8 items-end">
                        <div className="w-[24%] lg:w-[25%] flex items-center justify-end overflow-hidden">
                            <div className="flex gap-4 h-full items-center">
                                {teamMembers.map((v, i) => (
                                    <motion.div 
                                        layout
                                        key={`${v.id}-${i}`} 
                                        className="relative w-[10.5em] h-[12em] my-auto aspect-3/4 rounded-3xl overflow-hidden"
                                    >
                                        <Image
                                            src={teamMembers[(selectedIndex + i + 2) % teamMembers.length].image}
                                            alt="Next member"
                                            fill
                                            className="object-cover opacity-90 transition-all duration-500"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="w-[75%] lg:w-[70%] grid grid-cols-2 gap-6 lg:gap-16 items-center">
                            {/* Large current image with Framer Motion popLayout */}
                            <div className="relative aspect-3/4 h-full min-h-[35em] overflow-hidden rounded-[40px]">
                                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                    <motion.div
                                        key={selectedIndex}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            x: { type: "spring", stiffness: 260, damping: 30 },
                                            opacity: { duration: 0.5 }
                                        }}
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <Image
                                            src={currentMember.image}
                                            alt={currentMember.name}
                                            fill
                                            className="object-cover object-center"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-between lg:justify-around h-full pb-5 flex-col gap-8 pe-10 lg:pe-16">
                                <div>
                                    <h3 className={`text-2xl sm:text-3xl md:text-[2rem] font-medium text-secondary-9 leading-8 ${space_grotesk.className}`}>
                                        {currentMember.name}
                                    </h3>
                                    <p className="text-neutral-8 text-xs mt-1">{currentMember.role}</p>
                                    <p className="text-neutral-7 mt-6 text-sm leading-relaxed">{currentMember.bio}</p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={scrollPrev}
                                        className="w-14 h-14 rounded-full border-2 border-neutral-4 flex items-center justify-center hover:bg-neutral-2 active:scale-95 transition-all"
                                    >
                                        <Icon icon="si:chevron-left-line" width="24" height="24" className='text-secondary-6' />
                                    </button>
                                    <button
                                        onClick={scrollNext}
                                        className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary-7 active:scale-95 transition-all"
                                    >
                                        <Icon icon="si:chevron-right-line" width="24" height="24" className='text-white' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}