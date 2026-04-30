import { CheckoutAttendeeInfoFormProvider } from "@/contexts/CheckoutAttendeeInfoFormContext"
import { CheckoutFlowProvider } from "@/contexts/CheckoutFlowProvider"
import { SplitPaymentProvider } from "@/contexts/SplitPaymentContextProvider"
import { getGroups } from "@/actions/groups"
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient"
import EventNotFound from "@/components/events-page/EventNotFound"
import { getEventDetails } from "@/actions/getters"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EventTicketCheckoutPage({ params }: Props) {
    const { event_id } = await params

    const [eventResult, groupsResult] = await Promise.all([
        getEventDetails(event_id),
        getGroups(),
    ])

    if (!eventResult.success || !eventResult.data) {
        return (
            <EventNotFound />
        )
    }

    const event = eventResult.data
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