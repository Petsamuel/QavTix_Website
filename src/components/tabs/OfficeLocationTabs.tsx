"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from 'lucide-react';
import { ADDITIONAL_SOCIAL_LINKS, CONTACT_LINKS, SOCIAL_LINKS } from '@/components-data/navigation/contact-and-socials';
import { workingHours } from '@/components-data/navigation/working-hours';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import MapEmbed from '../custom-utils/maps/MapEmbed';
import { cn } from '@/lib/utils';
import { isHighlightedSocial } from '@/helper-fns/isHighlightedSocial';


type Tab = "lagos" | "abuja"



const OfficeLocationTabs = () => {

    const [activeTab, setActiveTab] = useState<Tab>('lagos')

    const offices = {
        lagos: {
            contactInfo: Object.values(CONTACT_LINKS.LAGOS),
            hours: workingHours.lagos,
            mapEmbed: CONTACT_LINKS.LAGOS_MAPEMBED
        },
        abuja: {
            contactInfo: Object.values(CONTACT_LINKS.ABUJA),
            hours: workingHours.abuja,
            mapEmbed: CONTACT_LINKS.ABUJA_MAPEMBED
        }
    }

    const socials = [
        ...Object.values(SOCIAL_LINKS),
        ...Object.values(ADDITIONAL_SOCIAL_LINKS)
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
            visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { 
        opacity: 0, 
        y: 20,
            scale: 0.95
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    const mapVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)"
        },
        visible: { 
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: "easeOut" as const
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            filter: "blur(10px)",
            transition: {
                duration: 0.3
            }
        }
    }


    return (
        <div className="w-full">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 gap-2 bg-gray-50 h-12 p-1 rounded-lg">
                    <TabsTrigger 
                        value="lagos" 
                        className="data-[state=active]:bg-primary-1 data-[state=active]:border-0 border border-neutral-5 data-[state=active]:text-primary-7 text-secondary-9 shadow-none drop-shadow-none font-medium rounded-md transition-all"
                    >
                        Lagos office
                    </TabsTrigger>
                    <TabsTrigger 
                        value="abuja"
                        className="data-[state=active]:bg-primary-1 data-[state=active]:border-0 border border-neutral-5 data-[state=active]:text-primary-7 text-secondary-9 shadow-none drop-shadow-none font-medium rounded-md transition-all"
                    >
                        Abuja office
                    </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                {['lagos', 'abuja'].map((office) => (
                    <TabsContent key={office} value={office} className="mt-0">
                    {activeTab === office && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className="space-y-8"
                        >
                            {/* Map Section */}
                            <motion.div
                                variants={mapVariants}
                                className="overflow-hidden"
                            >
                                <MapEmbed location={offices[office].mapEmbed} />
                            </motion.div>

                            {/* Contact Information */}
                            <motion.div
                                variants={containerVariants}
                                className="space-y-6"
                            >
                                {offices[office].contactInfo.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <Icon icon={item.icon} width="20" height="20" className="text-accent-6 mt-0.5 shrink-0" />
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="text-neutral-8 text-sm font-medium hover:text-primary-6 transition-colors"
                                            >
                                                {item.text}
                                            </Link>
                                        ) : (
                                            <span className="text-neutral-8 text-sm font-medium">{item.text}</span>
                                        )}
                                    </li>
                                ))}

                                {/* Hours */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="flex items-start gap-4 group"
                                >
                                    <Icon icon="hugeicons:calendar-02" width="22" height="22" strokeWidth={1} className="text-accent-6 stroke-1" />
                                    <div className="text-neutral-8 text-sm font-medium space-y-1">
                                        <p>{offices[office].hours.weekday}</p>
                                        <p>{offices[office].hours.saturday}</p>
                                        <p>{offices[office].hours.sunday}</p>
                                    </div>
                                </motion.div>

                                {/* Social Links */}
                                <motion.ul
                                    variants={itemVariants}
                                    className="flex gap-5 mt-10 justify-center md:justify-start md:mt-16 lg:mt-24"
                                >
                                    {socials.map((social, index) => {
                                        const isHighlighted =
                                            isHighlightedSocial(social.label) ||
                                            isHighlightedSocial(social.href)

                                        return (
                                            <motion.li
                                                key={index}
                                                whileHover={{ scale: 1.15, rotate: 10 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.8 + index * 0.1 }}
                                            >
                                                <Link
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    aria-label={social.label}
                                                    className="flex items-center justify-center hover:scale-105 ease-linear duration-150"
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex items-center py-2 justify-center transition-all',
                                                            isHighlighted
                                                            ? 'bg-primary-6 text-white rounded-full p-2'
                                                            : 'text-primary-6'
                                                        )}
                                                        >
                                                        <Icon
                                                            icon={social.icon}
                                                            width="24"
                                                            height="24"
                                                            className={cn(isHighlighted ? "size-7" : "size-9")}
                                                        />
                                                    </div>
                                                </Link>
                                            </motion.li>
                                        )
                                    })}

                                </motion.ul>
                            </motion.div>
                        </motion.div>
                    )}
                    </TabsContent>
                ))}
                </AnimatePresence>
            </Tabs>
        </div>
    )
}

export default OfficeLocationTabs;