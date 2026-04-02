'use client'

import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import { space_grotesk } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { getAvatarColor } from '@/helper-fns/getAvatarColor'
import { getInitialsFromName } from '@/helper-fns/getInitialFromName'
import { mockAttendees } from '@/components-data/demo-data'
import { CustomIcons } from '@/components/Svg-Icons'
import CloseBtn from '@/components/custom-utils/buttons/event-search/CloseBtn'
import Link from 'next/link'

export default function AttendeesModal() {
    const router = useRouter()
    const [isRegistered, setIsRegistered] = useState(true)
    const [attendees, setAttendees] = useState<Attendee[]>(mockAttendees)

    const handleGetTicket = () => {
        router.push('/checkout')
    }

    return (
        <Dialog open={true} onOpenChange={() => router.back()}>
            <DialogOverlay className='bg-black/40 z-200' />
            <DialogContent showCloseButton={false} className="z-200 w-102.5 max-h-[80vh] rounded-[2.5em] overflow-hidden flex flex-col">
                {!isRegistered ? (
                    // Unauthenticated/Unregistered View
                    <div className="py-4">
                        <div className='flex justify-between'>
                            <div className="w-14 h-14 bg-primary-1 rounded-full flex items-center justify-center mb-4">
                                <CustomIcons.userMultipleLock className='size-8' />
                            </div>
                            <CloseBtn action={() => router.back()} />
                        </div>

                        <div className='max-w-xs'>
                            <DialogHeader className="mb-4">
                                <DialogTitle className={`${space_grotesk.className} text-2xl font-medium`}>
                                    Get a ticket to view attendee list
                                </DialogTitle>
                            </DialogHeader>
                            
                            <p className="text-neutral-7 mb-8">
                                Attendee list is only available to registered attendees only.
                            </p>
                        </div>
                        
                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => router.back()}
                                className="h-14 flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={handleGetTicket}
                                className="h-14 flex-1 px-6 py-3 rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                            >
                                Get ticket
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Registered User - Show Attendees
                    <>
                        <DialogHeader>
                            <div className='flex justify-between'>
                                <div className="w-14 h-14 bg-primary-1 rounded-full flex items-center justify-center mb-4">
                                    <CustomIcons.userMultipleListIcon className='size-8' />
                                </div>
                                <CloseBtn action={() => router.back()} />
                            </div>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <DialogTitle className={cn(space_grotesk.className, "text-2xl font-medium mb-1")}>
                                        {attendees.length} Attendee
                                    </DialogTitle>
                                    <p className="text-neutral-7">
                                        Attendee list is only available to registered attendees only.
                                    </p>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="mt-6 flex-1 overflow-y-auto">
                            <div className="space-y-1">
                                {attendees.map((attendee) => (
                                    <div 
                                        key={attendee.id}
                                        className="flex items-center justify-between py-3 px-2 hover:bg-neutral-1 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="size-10">
                                                {attendee.profile_img ? (
                                                    <AvatarImage src={attendee.profile_img} />
                                                ) : null}
                                                <AvatarFallback
                                                    className={`${getAvatarColor(attendee.id.toString())} text-white font-medium text-sm`}
                                                >
                                                    {getInitialsFromName(attendee.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-sm text-neutral-9">
                                                {attendee.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {attendee.socials ? attendee.socials?.map((social, index) => (
                                                <Link
                                                    key={index}
                                                    href={social.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-neutral-7 hover:text-neutral-9 transition-colors"
                                                    aria-label={social.text}
                                                >
                                                    <Icon
                                                        icon={social.icon}
                                                        width="20"
                                                        height="20"
                                                    />
                                                </Link>
                                            )): null }
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {attendees.length === 0 && (
                                <div className="text-center py-12 text-neutral-6">
                                    <Icon icon="lucide:users" className="w-12 h-12 mx-auto mb-3 opacity-40" />
                                    <p>No attendees yet</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}