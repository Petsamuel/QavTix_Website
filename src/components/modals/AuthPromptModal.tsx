"use client"

import { useRouter } from "next/navigation"
import { DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { space_grotesk } from "@/lib/fonts"
import { CustomIcons } from "@/components/Svg-Icons"
import { AUTH_ROUTES } from "@/components-data/navigation/navLinks"
import CloseBtn from "../custom-utils/buttons/event-search/CloseBtn"
import { AnimatedDialogForPrompt } from "../custom-utils/AnimatedDialogForPrompts"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { hideAuthPrompt } from "@/lib/redux/slices/showAuthPromptSlice"
import LiquidLink from "../custom-utils/buttons/LiquidGlassLink"


export default function AuthPromptModal() {

    const router = useRouter()
    const dispatch = useAppDispatch()
    const { isOpen, message } = useAppSelector(state => state.authPrompt)

    const close = () => dispatch(hideAuthPrompt())

    const handleSignIn = () => {
        close()
        router.push(AUTH_ROUTES.SIGN_IN.href)
    }

    const handleSignUp = () => {
        close()
        router.push(AUTH_ROUTES.SIGN_UP.href)
    }

    return (
        <AnimatedDialogForPrompt open={isOpen} onOpenChange={v => !v && close()}>
            <div>
                <div className="flex justify-between">
                    <div className="w-14 h-14 bg-primary-1 rounded-full flex items-center justify-center mb-4">
                        <CustomIcons.userMultipleLock className="size-8" />
                    </div>
                    <CloseBtn action={close} />
                </div>

                <div className="max-w-xs">
                    <DialogHeader className="mb-4">
                        <DialogTitle className={`${space_grotesk.className} text-2xl font-medium`}>
                            {message}
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-neutral-7 mb-8">
                        Sign in or create a free account to continue.
                    </p>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={handleSignIn}
                        className="h-14 flex-1 text-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-secondary-5 active:bg-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                    >
                        Sign In
                    </Button>
                    <LiquidLink
                        onClick={handleSignUp}
                        className="h-14 flex-1 px-6 py-3 rounded-[30px] bg-primary hover:bg-primary-7 active:bg-primary-8 hover:shadow-md active:scale-[0.98] disabled:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        Get Started
                    </LiquidLink>
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}