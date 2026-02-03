import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { space_grotesk } from "@/lib/fonts"

interface FeatureCardProps {
    feature: HowItWorkFeatureCard
    index: number
}

export default function HowItWorksFeatureFilledCard({ feature, index }: FeatureCardProps) {
    const [isActive, setIsActive] = useState(false)

    // Handle both hover (desktop) and click/tap (mobile and tablet)
    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            setIsActive(true)
        }
    }

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            setIsActive(false)
        }
    }

    const handleClick = () => {
        if (window.innerWidth < 768) { // Only toggle on mobile and tablet
            setIsActive(!isActive)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "linear" as const
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            // Scale and flex-grow on hover/active
            animate={{
                scale: isActive ? 1.02 : 1,
                flexGrow: isActive ? 1.5 : 1,
            }}
            className={cn(
                "relative mx-auto flex justify-between flex-col md:mx-0 rounded-[24px] overflow-hidden cursor-pointer group transition-all duration-500",
                // Mobile: smaller default size
                "w-full max-w-85",
                // Desktop: larger size
                "lg:max-w-none",
                // Active state: full width on mobile
                isActive && "max-w-none",
                isActive ? "h-100 md:h-120 md:-translate-y-10" : "h-90 md:h-100"
            )}
  
        >
            {/* Plain background (default state) */}
            <div className={cn(
                'absolute inset-0 bg-neutral-3 transition-opacity duration-500',
                isActive ? 'opacity-0' : 'opacity-100'
            )} />

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute top-0 left-0 right-0 h-[35%] lg:h-[38%] rounded-t-[24px] overflow-hidden"
                    >
                        <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
                {/* Number - Fades out completely on hover */}
                <motion.div
                    animate={{
                        opacity: isActive ? 0 : 1,
                        scale: isActive ? 0.4 : 1
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={cn(
                        space_grotesk.className,
                        "leading-none select-none",
                        // Mobile: smaller number
                        "text-[64px] md:text-[96px] font-bold text-neutral-5"
                    )}
                >
                    {feature.number}.
                </motion.div>

                {/* Bottom Content */}
                <div className="space-y-3 md:space-y-4">
                    {/* Icon */}
                    <motion.div
                        className={cn(
                            'aspect-square rounded-full flex items-center justify-center transition-colors duration-500 bg-primary-1',
                            'w-10 h-10'
                        )}
                    >
                        <Icon 
                            icon={feature.icon} 
                            className={cn(
                                'transition-colors duration-500 text-primary-6',
                                'w-5 h-5'
                            )}
                        />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                        animate={{
                            y: isActive ? -5 : 0
                        }}
                        transition={{ duration: 0.4 }}
                        className={cn(
                            space_grotesk.className,
                            "text-secondary-9 leading-tight  transition-all duration-400",
                            // Mobile: smaller text
                            isActive 
                                ? "text-2xl md:text-4xl font-normal mb-8" 
                                : "text-xl md:text-2xl font-bold"
                        )}
                    >
                        {feature.title}
                    </motion.h3>

                    {/* Description (appears on hover/active) */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isActive ? 1 : 0,
                            height: isActive ? 'auto' : 0
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-xs md:text-sm text-neutral-7 leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Subtle border effect */}
            <motion.div
                animate={{
                    opacity: isActive ? 1 : 0
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 rounded-[24px] border-2 border-primary-6/20 pointer-events-none"
            />

            {/* Mobile tap indicator (shows briefly on touch devices) */}
            {!isActive && (
                <div className="absolute bottom-4 right-4 lg:hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="w-8 h-8 rounded-full bg-primary-1/20 flex items-center justify-center"
                    >
                        <Icon icon="mdi:gesture-tap" className="w-5 h-5 text-primary-6" />
                    </motion.div>
                </div>
            )}
        </motion.div>
    )
}