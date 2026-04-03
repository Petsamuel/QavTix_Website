import { NAV_LINKS } from "@/components-data/navigation/navLinks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCountdown } from "@/helper-fns/date-utils";
import { getAvatarColor } from "@/helper-fns/getAvatarColor";
import { getInitialsFromName } from "@/helper-fns/getInitialFromName";
import { space_grotesk } from "@/lib/fonts";
import Link from "next/link";

export default function CancelledTicketCard({ event }: { event: EventDetails }) {
    return (
        <div className="mt-12 relative w-full bg-secondary-1 flex flex-col gap-5 justify-between rounded-3xl p-5">
            <div className="flex justify-between gap-4">
                <Avatar className="ring-2 ring-background size-14">
                    <AvatarImage src="/images/demo-images/host-img.png" />
                    <AvatarFallback className={`${getAvatarColor("Jennifer")}`}>{getInitialsFromName("Jennifer")}</AvatarFallback>
                </Avatar>
                <Badge className="h-fit grow-0 font-medium bg-secondary-6 text-white">
                    Starting in <span className='text-accent-4'>{formatCountdown(event.start_datetime)}</span>
                </Badge>
            </div>
            
            <h3 className={`${space_grotesk.className} text-xl font-medium text-secondary-9`}>
                Ticket canceled
            </h3>
            
            <p className="text-neutral-7">
                Hope to catch you at a future event. You can always get<Link href={NAV_LINKS.EVENTS_GET_TICKETS_CHECKOUT.href.replace("[event_id]", event.id)} className='mx-1 font-medium text-accent-6'> ticket again </Link>if you change your mind. 
            </p>
        </div>
    )
}