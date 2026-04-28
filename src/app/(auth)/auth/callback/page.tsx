import { Suspense } from "react"
import { Icon } from "@iconify/react"
import OAuthCallbackPage from "@/components/page-content-wrappers/AuthCallbackCW"

export default function OAuthCallbackPageWrapper() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center gap-3">
                <Icon icon="eos-icons:three-dots-loading" className="size-12 text-primary" />
                <p className="text-sm text-neutral-6">Completing sign in...</p>
            </div>
        }>
            <OAuthCallbackPage />
        </Suspense>
    )
}