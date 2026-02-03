import { useRouter } from 'next/navigation'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { space_grotesk } from '@/lib/fonts'
import { CustomIcons } from '@/components/Svg-Icons'
import { Dispatch, SetStateAction } from 'react'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import CloseBtn from '../custom-utils/buttons/event-search/CloseBtn'
import { AnimatedDialogForPrompt } from '../custom-utils/AnimatedDialogForPrompts'


export default function AccessDeniedModal({ open, setOpen }:{ open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    
    const router = useRouter()

    return (
        <AnimatedDialogForPrompt open={open} onOpenChange={(v) => setOpen(v)}>
            <div className="">
                <div className='flex justify-between'>
                    <CustomIcons.eighteen className='size-14 mb-4' />
                    <CloseBtn action={() => setOpen(false)} />
                </div>

                <div className='max-w-xs'>
                    <DialogHeader className="mb-4">
                        <DialogTitle className={`${space_grotesk.className} text-2xl font-medium`}>
                            Entry Denied
                        </DialogTitle>
                    </DialogHeader>
                    
                    <p className="text-neutral-7 mb-6">
                        You don’t meet the requirements for this event, so access has been restricted.
                    </p>
                </div>
                
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => setOpen(false)}
                        className="h-14 flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => router.push(EVENT_ROUTES.EVENTS.href)}
                        className="h-14 flex-1 px-6 py-3 rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        Return to events
                    </Button>
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}