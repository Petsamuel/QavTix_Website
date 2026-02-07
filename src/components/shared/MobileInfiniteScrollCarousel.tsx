'use client'

import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react'

interface MobileInfiniteScrollProps {
    images: string[]
    duration?: number 
    autoPlay?: boolean
    className?: string
}

export interface MobileInfiniteScrollRef {
    scrollNext: () => void
}

const MobileInfiniteScroll = forwardRef<MobileInfiniteScrollRef, MobileInfiniteScrollProps>(
    ({ images, duration = 40, className, autoPlay = true }, ref) => {
        const controls = useAnimation()
        const itemWidth = 400 + 24 // image width + gap-6 (24px)

        const scrollIndex = useRef(0)

        useImperativeHandle(ref, () => ({
            scrollNext: async () => {
                controls.stop()

                scrollIndex.current += 1

                await controls.start({
                    x: -scrollIndex.current * itemWidth,
                    transition: { duration: 0.6, ease: 'easeInOut' }
                })

                if (scrollIndex.current >= images.length) {
                    controls.set({ x: 0 })
                    scrollIndex.current = 0
                }

                if (autoPlay) {
                    startAutoScroll()
                }
            }
        }))

        const startAutoScroll = () => {
            controls.start({
                x: -images.length * itemWidth,
                transition: {
                    duration: duration,
                    ease: 'linear',
                    repeat: Infinity,
                    repeatType: 'loop',
                }
            })
        }

        useEffect(() => {
            if (autoPlay) {
                startAutoScroll()
            }

            return () => controls.stop()
        }, [autoPlay, duration, images.length])

        // Reset to beginning on mount for clean start
        useEffect(() => {
            controls.set({ x: 0 })
        }, [])

        return (
            <div className={`overflow-hidden my-12 ${className}`}>
                <motion.div
                    className="flex gap-3"
                    animate={controls}
                    style={{ x: 0 }}
                >
                    {[...images,...images].map((image, index) => (
                        <div key={index} className="shrink-0">
                            <Image
                                src={image}
                                alt={`carousel image ${index % images.length + 1}`}
                                width={400}
                                height={400}
                                className="rounded-3xl md:rounded-4xl aspect-square w-54 md:w-74 max-w-[98%] object-cover"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        )
    }
)

export default MobileInfiniteScroll