'use client'

import { Badge } from "@/components/ui/badge"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { motion, Variants } from "framer-motion"
import { useRef } from "react"

interface PricingCardProps {
    plan: PricingPlan
    index: number
}

export default function PricingCard({ plan, index }: PricingCardProps) {
    const ref = useRef(null)

    // Card animation variants with proper typing
    const cardVariants: Variants = {
        hidden: { 
            opacity: 0, 
            y: 60,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94] as const, // Add 'as const' for tuple type
            }
        }
    }

    // Features container variants
    const featuresContainerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3 + (index * 0.15),
                staggerChildren: 0.08
            }
        }
    }

    // Individual feature variants
    const featureVariants: Variants = {
        hidden: { 
            opacity: 0, 
            x: -20,
            y: 10
        },
        visible: { 
            opacity: 1, 
            x: 0,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94] as const
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ 
                once: true,
                margin: "-50px"
            }}
        >
            <div
                className={cn(
                    "rounded-[32px] p-[1.6px] transition-all",
                    plan.highlighted
                        ? "bg-linear-to-br from-[#0052CC] via-[#FF7A21] to-[#6B7280]"
                        : "bg-white",
                    "hover:scale-105 ease-linear duration-200"
                )}
            >
                <div
                    className={cn(
                        "h-full p-3 bg-white rounded-[30px]",
                        !plan.highlighted && "border border-neutral-5"
                    )}
                >
                    <div 
                        className={cn(
                            "rounded-xl p-3 flex flex-col justify-between gap-6", 
                            plan.highlighted 
                                ? "bg-linear-to-br from-accent-6/20 to-secondary-6/20" 
                                : "bg-transparent"
                        )}
                    >
                        <Badge
                            className={cn(
                                "text-sm font-medium w-fit",
                                plan.highlighted 
                                    ? "bg-primary-1 text-secondary-9" 
                                    : "bg-neutral-2 text-neutral-8"
                            )}
                        >
                            {plan.name}
                        </Badge>

                        {/* Price Section */}
                        <div className="space-y-3">
                            {plan.price === 0 && plan.currency === 'Custom' ? (
                                <div className={`${space_grotesk.className} text-3xl font-medium text-secondary-9`}>
                                    Custom
                                </div>
                            ) : (
                                <div className="flex items-baseline flex-wrap gap-2">
                                    <span className={`${space_grotesk.className} text-2xl font-medium text-secondary-9`}>
                                        {plan.currency}{plan.price === 0 ? '0' : plan.price.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-neutral-7">/month</span>
                                    {plan.perTicketFee > 0 && (
                                        <span className="text-sm text-neutral-7 basis-full">
                                            +{plan.perTicketFee}% per ticket
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-neutral-7 mt-6 mb-9">{plan.description}</p>

                    <button
                        className={cn(
                            "w-full py-4 rounded-4xl text-sm font-medium transition-all",
                            plan.buttonVariant === 'primary'
                                ? 'bg-primary-6 hover:bg-primary-7 text-white'
                                : 'bg-secondary-6 hover:bg-secondary-7 text-white'
                        )}
                    >
                        {plan.buttonText}
                    </button>
                </div>
            </div>

            {/* Animated Features List */}
            <motion.ul 
                className="space-y-4 mt-6"
                variants={featuresContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ 
                    once: true,
                    margin: "-50px"
                }}
            >
                {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                        key={featureIndex} 
                        className="flex items-start gap-3"
                        variants={featureVariants}
                    >
                        <Icon
                            icon="hugeicons:checkmark-circle-03"
                            width="24"
                            height="24"
                            className="text-neutral-6 shrink-0 mt-0.5"
                        />
                        <span className="text-sm text-secondary-9 font-medium">
                            {feature}
                        </span>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.div>
    )
}