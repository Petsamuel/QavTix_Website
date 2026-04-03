import { getMarketplaceEventDetails } from "@/actions/getters"
import { getCategories, searchEvents } from "@/actions/filters"
import EventDetailsPageContentContainer from "@/components/events-page/EventDetailsPageContentContainer"
import MarketplaceTicketNotFound from "@/components/events-page/MarketplaceTicketNotFound"
import MarketplaceAuthError from "@/components/events-page/MarketplaceAuthError"


interface Props {
    params: Promise<{ ticket_id: string }>
}

export default async function MarketplaceEventDetailPage({ params }: Props) {

    const { ticket_id } = await params

    const result = await getMarketplaceEventDetails(ticket_id)

    if (!result.success || !result.data) {
        if (result.statusCode === 401) {
            return <MarketplaceAuthError />
        }

        return <MarketplaceTicketNotFound />
    }

    const event = result.data

    const category = event.category ?? null
    
    const categoriesResult = await getCategories()
    const foundCategoryID = categoriesResult.data?.find(
        (v: any) => v.name.toLowerCase() === category?.toLowerCase()
    )?.id

    const relatedEventsResult = await searchEvents(
        "",
        8,
        foundCategoryID ? { categories: [foundCategoryID] } : {},
    )

    return (
        <EventDetailsPageContentContainer
            event={event}
            relatedEvents={relatedEventsResult.data?.filter((v: any) => v.id !== event.id) ?? []}
        />
    )
}