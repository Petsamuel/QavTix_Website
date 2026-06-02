'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { usePathname } from 'next/navigation'
import { signInSlides, signUpSlides } from '@/components-data/auth-pages/slides'
import { space_grotesk } from '@/lib/fonts'

export default function AuthPageImageCarousel() {

    const pathName = usePathname()
    const isSignIn = pathName.includes('signin') || pathName.includes('forgot-password') || pathName.includes('reset-password')
    const isSignUp = pathName.includes('signup')
    
    const slides = isSignIn ? signInSlides : isSignUp ? signUpSlides : []
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { 
            loop: true,
            duration: 30
        },
        [
            Autoplay({ 
                delay: 5000,
                stopOnInteraction: false
            })
        ]
    )

    const [selectedIndex, setSelectedIndex] = useState(0)

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setSelectedIndex(emblaApi.selectedScrollSnap())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
        emblaApi.on('reInit', onSelect)
    }, [emblaApi, onSelect])

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index)
    }, [emblaApi])

    if (isSignIn || isSignUp) {
        return (
            <div className="h-full relative overflow-hidden rounded-[25px] bg-gradient-to-tr from-[#610092 ] via-[#0052cc]/20 to-[#610092]">
                {/* Background Video */}
                <video 
                    className="absolute inset-0 w-[110%] h-[110%] object-cover"
                    src="/qavtix.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                {/* Brand Color Gradient Overlay to tint and tone down the white video */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0052cc]/20 via-transparent to-black/40 mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0052cc]/15 via-transparent to-transparent mix-blend-overlay pointer-events-none" />
            </div>
        )
    }

    return (
       <div className="h-full">
            <div className="overflow-hidden rounded-[25px] h-full" ref={emblaRef}>
                <div className="flex h-full">
                    {slides.map((slide) => (
                        <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <div className="relative h-full">
                                {/* Background Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                >
                                    <div className="absolute inset-0 bg-black/30" />
                                </div>
                                
                                <div className="relative h-full flex items-end px-6 md:px-12">
                                    <div className="max-w-3xl text-neutral-2">
                                        <h1 className={`md:text-5xl font-medium mb-4 ${space_grotesk.className}`}>
                                            {slide.title}
                                        </h1>
                                        <p className="opacity-90 mb-20">
                                            {slide.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute top-6 left-0 right-0 flex justify-center gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`transition-all duration-300 rounded-full ${
                            index === selectedIndex
                                ? 'w-2 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}