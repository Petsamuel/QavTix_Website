import { getOrDetectLocation } from "@/lib/location-utils"
import { DEFAULT_LOCATION } from "@/components-data/settings.data"
import { getProfile } from "@/actions/profile"
import AppSettings from "@/components/custom-utils/persistors/AppSettings"
import AuthPersistor from "@/components/custom-utils/persistors/AuthPersistor"
import { TicketUserProvider } from "@/contexts/TicketUserProvider"
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider"
import CustomGlobalAlert from "@/components/custom-utils/alerts/CustomGlobalAlert"
import Header from "@/components/layout/Header"
import Header2 from "@/components/layout/Header2"
import ModalRenderer from "@/components/modals/ModalRenderer"
import Footer from "@/components/layout/Footer"
import { getAuthToken } from "@/helper-fns/getAuthToken"

async function getLayoutData() {
    const token = await getAuthToken()

    const [locationResult, profileResult] = await Promise.allSettled([
        getOrDetectLocation(),
        // Only hit the profile API when the user is logged in
        token ? getProfile() : Promise.resolve({ success: false as const, data: undefined }),
    ])

    return {
        locationData: locationResult.status === "fulfilled" ? locationResult.value : DEFAULT_LOCATION,
        userData:
            profileResult.status === "fulfilled" && profileResult.value.success
                ? profileResult.value.data ?? null
                : null,
    }
}

export default async function LayoutDataProvider({ children }: { children: React.ReactNode }) {
    const { locationData, userData } = await getLayoutData()

    return (
        <ReduxStoreProvider>
            <TicketUserProvider user={userData} ticketSession={null}>
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
