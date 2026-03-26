'use client'

import { Icon } from '@iconify/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { space_grotesk } from '@/lib/fonts'
import { useTicketUser } from '@/contexts/TicketUserProvider'
import { getAvatarColor } from '@/helper-fns/getAvatarColor'
import { getInitialsFromName } from '@/helper-fns/getInitialFromName'
import Link from 'next/link'
import { NAV_LINKS } from '@/components-data/navigation/navLinks'
import { useState } from 'react'
import CancelTicketPrompt from '@/components/modals/CancelTicketPrompt'


export default function AuthUserGettingTicketCard() {

    const [showCancelTicketPrompt,setShowCancelTicketPrompt] = useState(false)
    const { user } = useTicketUser()
    
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
                    <Avatar className="ring-2 ring-background size-14">
                        <AvatarImage src="/images/demo-images/host-img.png" />
                        <AvatarFallback className={`${getAvatarColor("Jennifer")}`}>{getInitialsFromName("Jennifer")}</AvatarFallback>
                    </Avatar>
                    
                    <p className={`${space_grotesk.className} text-base`}>
                        Won't make it for the event,{' '}
                        <button onClick={() => setShowCancelTicketPrompt(true)} className="text-orange-500 font-medium">cancel ticket</button>
                    </p>
                    
                    <Link href={NAV_LINKS.DASHBOARD.href} className='flex items-center gap-1 font-medium text-primary-6'>
                        <span>Go to dashboard</span>
                        <Icon icon="mdi:arrow-up" width="21" height="21" className='text-primary-8 rotate-45' />
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