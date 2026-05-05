import { useRouter } from 'next/navigation'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { space_grotesk } from '@/lib/fonts'
import { CustomIcons } from '@/components/Svg-Icons'
import { Dispatch, SetStateAction, useState } from 'react'
import { EVENT_ROUTES } from '@/components-data/navigation/navLinks'
import { AnimatedDialogForPrompt } from '../custom-utils/AnimatedDialogForPrompts'
import { canRestartCheckout } from '@/actions/checkout'
import { useCheckout } from '@/contexts/CheckoutFlowProvider'
import ActionButton1 from '../custom-utils/buttons/ActionButton1'


export default function ReservationTimeExpiredPrompt({ open }: { open: boolean, setOpen?: Dispatch<SetStateAction<boolean>> }) {

    const router = useRouter()
    const { event, resetCheckout } = useCheckout()
    const [isChecking, setIsChecking] = useState(false)

    const handleCanRestartPurchase = async () => {
        setIsChecking(true)
        const result = await canRestartCheckout(event.id)

        if (result) {
            resetCheckout()
        }
        else {
            router.push(EVENT_ROUTES.EVENTS.href)
        }

        setIsChecking(false)
    }

    return (
        <AnimatedDialogForPrompt open={open} >
            <div className="">
                <div className="w-14 h-14 bg-primary-1 rounded-full flex items-center justify-center mb-4">
                    <CustomIcons.timer02 className='size-8' />
                </div>

                <div className='max-w-xs text-left'>
                    <DialogHeader className="mb-4">
                        <DialogTitle className={`${space_grotesk.className} text-left text-2xl font-medium`}>
                            Reservation time expired
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-neutral-7 mb-8">
                        The time limit has ended and your reservation has been released. Please start your purchase again.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => router.back()}
                        className="h-14 flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                    >
                        Cancel
                    </Button>

                    <ActionButton1
                        buttonText='Restart Purchase'
                        action={() => handleCanRestartPurchase()}
                        isLoading={isChecking}
                        className='h-14 text-sm! whitespace-nowrap flex-1 rounded-[30px]'
                    />
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}