import { AUTH_ROUTES } from "@/components-data/navigation/navLinks";
import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";
import { AnimatedDialog } from "../custom-utils/AnimatedDialog";
import { DialogDescription, DialogTitle } from "../ui/dialog"


export default function ResetPasswordSuccessMessage() {
    return (
        <AnimatedDialog open={true} showCloseButton={false} className="rounded-[40px]" childrenContainerStyles="px-8 py-20">
            <div className="text-center">
                <Image
                    src="/images/vectors/success-indicator.svg"
                    alt="Success Indicator"
                    width={200} height={200}
                    className="mx-auto mb-6 size-36"
                />
                <DialogTitle className={`text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>
                    Password changed successfully!
                </DialogTitle>
                <DialogDescription className="text-[#616166] text-sm">
                    Your password has been changed successfully.
                    <Link href={AUTH_ROUTES.SIGN_IN.href} className="text-primary-6 font-medium ms-1">
                        Log in
                    </Link>
                </DialogDescription>
            </div>
        </AnimatedDialog>
    )
}