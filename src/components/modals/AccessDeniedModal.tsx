import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { space_grotesk } from '@/lib/fonts'
import { CustomIcons } from '@/components/Svg-Icons'
import { Dispatch, SetStateAction } from 'react'
import CloseBtn from '../custom-utils/buttons/event-search/CloseBtn'
import { AnimatedDialogForPrompt } from '../custom-utils/AnimatedDialogForPrompts'


export default function AccessDeniedModal({ open, setOpen, eventID }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, eventID: string }) {
    return (
        <AnimatedDialogForPrompt open={open} onOpenChange={(v) => setOpen(v)}>
            <div className="">
                <div className='flex justify-between'>
                    <CustomIcons.eighteen className='size-14 mb-4' />
                    <CloseBtn action={() => setOpen(false)} icon="gg:close-r" className='text-red-600' />
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
            </div>
        </AnimatedDialogForPrompt>
    )
}