import { Skeleton } from "../ui/skeleton";

const EventCardLoader = () => {
    return (
        <Skeleton
            className="block w-full bg-[#E0E0E0] max-w-72 p-3 relative h-[22em] rounded-[32px]"
        />
    )
}


export default function EventCardLoaderContainer() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-10 justify-items-center md:justify-items-start">
            {Array.from({ length: 8 }).map((_, idx) => (
                <EventCardLoader key={idx} />
            ))}
        </div>
    )
}
