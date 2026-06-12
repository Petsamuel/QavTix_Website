"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { attendeesFaq, hostFaqData } from '@/components-data/faq-data';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { space_grotesk } from '@/lib/fonts';


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { 
        opacity: 0, 
        y: 20
    },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15
        }
    }
}


const FAQ = ({ data }:{ data: typeof hostFaqData }) => {
    return (
        <div className="relative w-full">
            <div className="w-full max-h-[500px] overflow-y-auto pr-2 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-neutral-300 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-400 [&::-webkit-scrollbar-thumb]:rounded-full">
                <Accordion type="single" collapsible className="w-full space-y-5">
                    {data.map((faq, index) => (
                        <motion.div
                            key={`${faq.id}-${index}`}
                            variants={itemVariants}
                        >
                            <AccordionItem 
                                value={faq.id} 
                                className="bg-secondary-1 w-full border-none rounded-lg px-6 py-2"
                            >
                                <AccordionTrigger className="text-secondary-9 font-medium hover:no-underline text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-neutral-7 pt-2 pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
            {/* Scroll indicator shadow at the bottom */}
            <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-black/5 to-transparent pointer-events-none rounded-b-xl"></div>
        </div>
    )
}


function FAQAccordionTab(){

    const [activeTab, setActiveTab] = useState<AccountType>("host")

    return (
        <div>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AccountType)} className="w-full md:flex md:flex-row md:items-start md:justify-between md:gap-8 lg:gap-16">
                
                <div className="hidden md:flex flex-col justify-center gap-12 mt-10 text-secondary-9">
                    <button
                        onClick={() => setActiveTab("host")}
                        className={`${space_grotesk.className} flex items-center gap-3 text-4xl lg:text-[2.5rem] font-medium transition-opacity ${
                            activeTab === "host"
                                ? "opacity-100"
                                : "opacity-40 hover:opacity-70"
                        }`}
                    >
                       <span className='block w-5 h-px border-t-2 border-secondary-9'></span> Host
                    </button>


                    <button
                        onClick={() => setActiveTab("attendee")}
                        className={`${space_grotesk.className} flex items-center gap-3 text-4xl lg:text-[2.5rem] font-medium transition-opacity ${
                            activeTab === "attendee"
                                ? "opacity-100"
                                : "opacity-40 hover:opacity-70"
                        }`}
                    >
                       <span className='block w-5 h-px border-t-2 border-secondary-9'></span> Attendee
                    </button>
                </div>
                
                <TabsList className="grid w-full grid-cols-2 mb-8 gap-2 bg-gray-50 h-12 p-1 rounded-lg md:hidden">
                    <TabsTrigger 
                        value="host" 
                        className="data-[state=active]:bg-primary-1 data-[state=active]:border-0 border border-neutral-5 data-[state=active]:text-primary-7 text-secondary-9 shadow-none! drop-shadow-none font-medium rounded-md transition-all"
                    >
                        Host
                    </TabsTrigger>
                    <TabsTrigger 
                        value="attendee"
                        className="data-[state=active]:bg-primary-1 data-[state=active]:border-0 border border-neutral-5 data-[state=active]:text-primary-7 text-secondary-9 shadow-none! drop-shadow-none font-medium rounded-md transition-all"
                    >
                        Attendee
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="host" className='md:w-[60%]'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <FAQ data={hostFaqData} />
                    </motion.div>
                </TabsContent>
                <TabsContent value="attendee" className='md:w-[60%]'>
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <FAQ data={attendeesFaq} />
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default FAQAccordionTab;