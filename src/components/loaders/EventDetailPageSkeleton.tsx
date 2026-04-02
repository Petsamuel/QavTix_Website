import { Skeleton } from "@/components/ui/skeleton"

export default function EventDetailPageSkeleton() {
    return (
        <main className="max-w-7xl mx-auto py-10 md:py-16">
            <div className="md:flex gap-10 lg:gap-16 items-start">

                {/* Left — cover image */}
                <div className="w-full md:w-[45%] lg:w-[42%] shrink-0">
                    <Skeleton className="w-full aspect-4/3 rounded-2xl bg-neutral-4" />
                    
                    {/* Hosted by row */}
                    <div className="flex items-center gap-3 mt-5">
                        <Skeleton className="size-11 rounded-full bg-neutral-4 shrink-0" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-16 rounded bg-neutral-4" />
                            <Skeleton className="h-4 w-24 rounded bg-neutral-4" />
                        </div>
                        <Skeleton className="h-9 w-24 rounded-full bg-neutral-4 ml-2" />
                    </div>

                    {/* Social icons row */}
                    <div className="flex gap-2 mt-4">
                        <Skeleton className="size-7 rounded-full bg-neutral-4" />
                        <Skeleton className="size-7 rounded-full bg-neutral-4" />
                        <Skeleton className="size-7 rounded-full bg-neutral-4" />
                    </div>
                </div>

                {/* Right — details */}
                <div className="flex-1 mt-8 md:mt-0 space-y-5">

                    {/* Title + action buttons */}
                    <div className="flex items-start justify-between gap-4">
                        <Skeleton className="h-9 w-56 sm:w-72 rounded-lg bg-neutral-4" />
                        <div className="flex items-center gap-2 shrink-0">
                            <Skeleton className="size-9 rounded-full bg-neutral-4" />
                            <Skeleton className="size-9 rounded-full bg-neutral-4" />
                            <Skeleton className="size-9 rounded-full bg-neutral-4" />
                        </div>
                    </div>

                    {/* Tag */}
                    <Skeleton className="h-6 w-24 rounded-full bg-neutral-4" />

                    {/* Date row */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded bg-neutral-4 shrink-0" />
                        <Skeleton className="size-4 rounded bg-neutral-4 shrink-0" />
                        <Skeleton className="h-4 w-64 sm:w-80 rounded bg-neutral-4" />
                    </div>

                    {/* Location row */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4 rounded-full bg-neutral-4 shrink-0" />
                        <Skeleton className="h-4 w-72 sm:w-96 rounded bg-neutral-4" />
                    </div>

                    {/* Ticket price card */}
                    <div className="mt-2">
                        <Skeleton className="w-full h-28 rounded-2xl bg-neutral-3" />
                    </div>

                    {/* CTA button */}
                    <Skeleton className="h-14 w-40 rounded-full bg-neutral-4" />

                    {/* Section heading */}
                    <div className="pt-4">
                        <Skeleton className="h-5 w-36 rounded bg-neutral-4" />
                    </div>

                    {/* Description lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full rounded bg-neutral-4" />
                        <Skeleton className="h-4 w-5/6 rounded bg-neutral-4" />
                        <Skeleton className="h-4 w-4/6 rounded bg-neutral-4" />
                    </div>
                </div>
            </div>
        </main>
    )
}