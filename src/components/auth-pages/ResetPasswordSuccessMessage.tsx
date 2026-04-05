import { AUTH_ROUTES } from "@/components-data/navigation/navLinks";
import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordSuccessMessage() {
    return (
        <div className="flex h-full justify-center items-center flex-col">
            <Image src="/images/vectors/success-indicator.svg" alt="Success Indicator" width={200} height={200} className="mx-auto my-8" />
            <div className="max-w-xs mx-auto">
                <h2 className={`text-center text-2xl font-bold text-secondary-9 mb-2 ${space_grotesk.className}`}>Password changed successfully!</h2>
                <p className="text-center text-[#616166] text-sm">
                    Your password has been changed successfully. <Link href={AUTH_ROUTES.SIGN_IN.href} className="text-primary-6 font-medium ms-1">Log in</Link>
                </p>
            </div>
        </div>
    )
}