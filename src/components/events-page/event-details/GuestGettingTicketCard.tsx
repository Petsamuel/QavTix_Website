'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { space_grotesk } from '@/lib/fonts'
import Link from 'next/link'
import { AUTH_ROUTES } from '@/components-data/navigation/navLinks'
import CancelTicketPrompt from '@/components/modals/CancelTicketPrompt'
import { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'


export default function GuestGettingTicketCard() {


    const [showCancelTicketPrompt,setShowCancelTicketPrompt] = useState(false)
    
    return (
        <div className="mt-12">
            <div className="md:flex md:items-stretch space-y-5 md:space-y-0 gap-[4%]">
                <div className="bg-accent-1 flex flex-col justify-between rounded-3xl p-5 relative w-full md:w-[60%] md:flex-1 min-h-40">
                    <div>
                        <Badge className="absolute font-medium top-4 right-4 bg-secondary-6 text-white">
                            Starting in <span className='text-accent-4'>15days</span>
                        </Badge>
                        
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4">
                            <Icon icon="hugeicons:ticket-03" width="24" height="24" className='text-accent-6' />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className={`${space_grotesk.className} text-xl font-medium text-secondary-9 mb-6`}>
                            Your spot is secured
                        </h3>
                        
                        <div className="flex justify-between gap-2">
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 text-secondary-8 rounded-full border border-accent-6 bg-transparent hover:bg-accent-3 hover:border-accent-7 hover:shadow-md transition-all ease-linear duration-200"
                                >
                                    <Icon icon="hugeicons:calendar-add-01" width="24" height="24" />
                                    Add to calendar
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full border p-1 border-neutral-8 bg-transparent hover:bg-accent-3 hover:border-accent-6 transition-all ease-linear"
                                >
                                    <Icon icon="hugeicons:qr-code-01" width="27" height="27" />
                                </Button>
                            </div>
                            
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full border p-1 border-neutral-8 bg-transparent hover:bg-accent-3 hover:border-accent-6 transition-all ease-linear"
                            >
                                <Icon icon="hugeicons:share-08" width="24" height="24" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-[36%] bg-secondary-1 flex flex-col gap-5 justify-between rounded-3xl p-5 min-h-40">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <Icon icon="hugeicons:login-square-02" width="24" height="24" />
                    </div>
                    
                    <p className={`${space_grotesk.className} text-base`}>
                        Sign in to manage your ticket
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Membership discount info"
                                    className="text-neutral-6 hover:text-neutral-8 transition-colors"
                                >
                                    <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Sign up with the same email you used on the ticket</p>
                            </TooltipContent>
                        </Tooltip>
                    </p>
                    
                    <Link href={AUTH_ROUTES.SIGN_IN.href} className='flex items-center gap-1 font-medium text-primary-6'>
                        <span>Sign in</span>
                        <Icon icon="hugeicons:login-square-02" width="21" height="21" className='text-primary-8' />
                    </Link>
                </div>
            </div>
            
            <button
                className="bg-primary-6 w-fit mt-4 hover:bg-primary-7 text-white px-6 py-4 rounded-full font-medium transition-colors"
            >
                Get more tickets
            </button>


            {/* <CancelTicketPrompt 
                onCancel={(v) => {}}
                open={showCancelTicketPrompt} 
                setOpen={setShowCancelTicketPrompt} 
                tickets={userTickets} 
            /> */}
        </div>
    )
}