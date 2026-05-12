import { getOrDetectLocation } from "@/lib/location-utils"
import { getGuestTicketSession } from "@/actions/util/get-ticket-session"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import { getServerAxios } from "@/lib/axios"
import AppSettings from "@/components/custom-utils/persistors/AppSettings"
import AuthPersistor from "@/components/custom-utils/persistors/AuthPersistor"
import { TicketUserProvider } from "@/contexts/TicketUserProvider"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import CustomGlobalAlert from "@/components/custom-utils/alerts/CustomGlobalAlert"
import Header from "@/components/layout/Header"
import Header2 from "@/components/layout/Header2"
import ModalRenderer from "@/components/modals/ModalRenderer"
import Footer from "@/components/layout/Footer"

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

export default async function LayoutDataProvider({ children }: { children: React.ReactNode }) {
    const { locationData, ticketSession, userData } = await getLayoutData()

    return (
        <ReduxStoreProvider>
            <TicketUserProvider user={userData} ticketSession={ticketSession}>
                <AppSettings currency={locationData.currency} region={locationData.region} />
                <AuthPersistor userData={userData} />
                <CustomGlobalAlert />

                <Header2 />
                <Header />

                {children}

                <ModalRenderer />
                <Footer />
            </TicketUserProvider>
        </ReduxStoreProvider>
    )
}
