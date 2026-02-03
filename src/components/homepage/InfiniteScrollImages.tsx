'use client'

import { slides_onlyImages } from '@/components-data/auth-pages/slides'
import { motion } from 'framer-motion'
import Image from 'next/image'


function InfiniteScrollRow({ 
    images, 
    direction = 'left',
    duration = 50 
}: { 
    images: string[]
    direction?: 'left' | 'right'
    duration?: number 
}) {

    const duplicatedImages = [...images, ...images]

    return (
        <div className="overflow-hidden">
            <motion.div
                className="flex gap-6"
                animate={{
                    x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%']
                }}
                transition={{
                    x: {
                        duration: duration,
                        repeat: Infinity,
                        ease: 'linear',
                        repeatType: 'loop'
                    }
                }}
            >
                {duplicatedImages.map((image, index) => (
                    <Image key={index} src={image} alt={`carousel image-${index + 1}`} width={300} height={300} className='h-48 aspect-square object-cover' />
                ))}
            </motion.div>
        </div>
    )
}

export default function InfiniteScrollImages() {
    return (
        <>
            {/* First Row - Scroll Left */}
            <div className="mb-8">
                <InfiniteScrollRow 
                    images={slides_onlyImages} 
                    direction="left"
                    duration={20}
                />
            </div>

            {/* Second Row - Scroll Right */}
            <div className="">
                <InfiniteScrollRow 
                    images={slides_onlyImages} 
                    direction="right"
                    duration={20}
                />
            </div>
        </>
    )
}