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
            <div className="h-full relative overflow-hidden rounded-[25px] bg-linear-to-br  from-[#E6EEFA] to-[#ADCEFF] ">
                {/* Background Video */}
                <video 
                    className="absolute inset-0 w-[110%] h-[110%] object-cover z-30"
                    src="/qavtix2.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                
                {/* Large White Logo Watermark overlaying the background */}
                <img 
                    src="/White.png" 
                    alt="QavTix Background Overlay" 
                    className="absolute -top-10 left-[65%]  -translate-x-1/2 -translate-y-1/2 z-10 w-[90%] sm:w-[170%] opacity-25 mix-blend-overlay pointer-events-none object-contain" 
                />
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