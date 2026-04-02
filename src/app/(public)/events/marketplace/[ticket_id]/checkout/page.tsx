import { CheckoutAttendeeInfoFormProvider } from "@/contexts/CheckoutAttendeeInfoFormContext"
import { CheckoutFlowProvider } from "@/contexts/CheckoutFlowProvider"
import { SplitPaymentProvider } from "@/contexts/SplitPaymentContextProvider"
import { getMarketplaceEventDetails } from "@/actions/getters"
import { getGroups } from "@/actions/groups"
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient"
import MarketplaceTicketNotFound from "@/components/events-page/MarketplaceTicketNotFound"

interface Props {
    params: Promise<{ ticket_id: string }>
}

export default async function EventTicketCheckoutPage({ params }: Props) {

    const { ticket_id } = await params

    const [eventResult, groupsResult] = await Promise.all([
        getMarketplaceEventDetails(ticket_id),
        getGroups(),
    ])

    if (!eventResult.success || !eventResult.data) {
        return (
            <MarketplaceTicketNotFound />
        )
    }

    const event  = eventResult.data
    const groups = groupsResult.data ?? []

    return (
        <CheckoutFlowProvider event={event} groups={groups}>
            <CheckoutAttendeeInfoFormProvider ageRestricted={event.age_restriction}>
                <SplitPaymentProvider>
                    <CheckoutPageClient event={event} />
                </SplitPaymentProvider>
            </CheckoutAttendeeInfoFormProvider>
        </CheckoutFlowProvider>
    )
}