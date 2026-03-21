import { Skeleton } from "@/components/ui/skeleton"

export default function EventLocationPageSkeleton() {
    return (
        <main className="md:pt-32 global-px">
            {/* Hero section skeleton */}
            <section className="relative w-full overflow-hidden sm:px-10 lg:px-12 xl:px-16">
                <div className="md:flex gap-8 justify-between items-center">

                    {/* Left — text content */}
                    <div className="flex flex-col justify-end min-h-screen md:w-1/2 md:min-h-0 px-4 md:px-0 pb-12 pt-20 md:py-0 space-y-6">

                        {/* Heading */}
                        <div className="space-y-2">
                            <Skeleton className="h-16 max-w-full w-85 rounded-lg bg-neutral-5" />
                            <Skeleton className="h-9 w-60 rounded-lg bg-neutral-5" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2 max-w-sm">
                            <Skeleton className="h-4 w-full rounded bg-neutral-5" />
                            <Skeleton className="h-4 w-5/6 rounded bg-neutral-5" />
                            <Skeleton className="h-4 w-4/6 rounded bg-neutral-5" />
                        </div>

                        {/* Subscribers + Events stats */}
                        <div className="flex items-center gap-5">
                            <div className="space-y-1.5">
                                <Skeleton className="h-7 w-14 rounded bg-neutral-5" />
                                <Skeleton className="h-4 w-20 rounded bg-neutral-5" />
                            </div>
                            <div className="w-0.5 h-12 bg-neutral-3" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-7 w-10 rounded bg-neutral-5" />
                                <Skeleton className="h-4 w-14 rounded bg-neutral-5" />
                            </div>
                        </div>

                        {/* Email subscribe input */}
                        <div className="flex gap-3 max-w-xl">
                            <Skeleton className="flex-1 h-14 rounded-sm bg-neutral-5" />
                            <Skeleton className="w-32 h-14 rounded-full bg-neutral-5" />
                        </div>
                    </div>

                    {/* Right — image */}
                    <div className="md:w-2/5 aspect-square rounded-4xl overflow-hidden">
                        <Skeleton className="w-full h-full bg-neutral-5" />
                    </div>
                </div>
            </section>
        </main>
    )
}