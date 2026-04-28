import { inter } from "@/lib/fonts"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { siteMetadata, siteViewport } from "@/metadata"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Header2 from "@/components/layout/Header2"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import AppSettings from "@/components/custom-utils/persistors/AppSettings"
import { getOrDetectLocation } from "@/lib/location-utils"
import CustomGlobalAlert from "@/components/custom-utils/alerts/CustomGlobalAlert"
import { TicketUserProvider } from "@/contexts/TicketUserProvider"
import AuthPersistor from "@/components/custom-utils/persistors/AuthPersistor"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import { getServerAxios } from "@/lib/axios"
import ModalRenderer from "@/components/modals/ModalRenderer"
import { getGuestTicketSession } from "@/actions/util/get-ticket-session"
import { Suspense } from "react"

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

async function getLayoutData() {
    const axiosInstance = await getServerAxios()
    const [locationResult, ticketSessionResult, profileResult] = await Promise.allSettled([
        getOrDetectLocation(),
        getGuestTicketSession(),
        axiosInstance.get(GET_PROFILE_ENDPOINT).then(r => r.data),
    ])

    return {
        locationData: locationResult.status === "fulfilled" ? locationResult.value : DEFAULT_LOCATION,
        ticketSession: ticketSessionResult.status === "fulfilled" ? ticketSessionResult.value : null,
        userData: profileResult.status === "fulfilled" ? profileResult.value?.data ?? null : null,
    }
}

export default async function MainRootLayout({ children }: { children: React.ReactNode }) {

    const { locationData, ticketSession, userData } = await getLayoutData()

    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
            </head>
            <Suspense fallback={null}>
                <ReduxStoreProvider>
                    <TicketUserProvider user={userData} ticketSession={ticketSession}>
                        <body className={`${inter.className} min-h-screen h-screen`} suppressHydrationWarning>
                            <AppSettings currency={locationData.currency} region={locationData.region} />
                            <AuthPersistor userData={userData} />
                            <CustomGlobalAlert />

                            <Header2 />
                            <Header />

                            {children}

                            <ModalRenderer />
                            <Footer />
                        </body>
                    </TicketUserProvider>
                </ReduxStoreProvider>
            </Suspense>
        </html>
    )
}