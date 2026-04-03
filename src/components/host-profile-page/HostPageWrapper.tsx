import UpcomingEvents from "../shared/UpcomingEvents"
import HostProfilePageHeader from "./HostProfileHeader"
import { PastEvents } from "../shared/PastEvents"

interface Props {
    host: HostDetails
}

export default function HostPageWrapper({ host }: Props) {
    return (
        <main className="py-24.5 mt-2 md:mt-8">
            <div className="global-px">
                <HostProfilePageHeader host={host} />
            </div>

            {host.upcoming_events.length > 0 && (
                <div className="mt-20 mb-8 px-4 md:px-0">
                    <UpcomingEvents events={host.upcoming_events} />
                </div>
            )}

            <div className="global-px">
                <PastEvents
                    hostID={host.id}
                    initialEvents={host.past_events}
                    initialCount={host.past_events.length}
                />
            </div>
        </main>
    )
}