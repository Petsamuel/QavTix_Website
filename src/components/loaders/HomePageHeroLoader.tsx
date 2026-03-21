import { Skeleton } from "@/components/ui/skeleton"

export default function HomePageHeroSectionSkeleton() {
    return (
        <section className="w-full min-h-[80vh] pt-20 pb-10 flex items-center bg-[#F0F4FF] global-px">
            <div className="w-full max-w-7xl mx-auto py-12 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

                {/* Left — title + filters + button */}
                <div className="flex-1 w-full space-y-8">

                    <div className="space-y-3">
                        <Skeleton className="h-28 w-70 md:w-[30em] rounded-xl bg-blue-100" />
                        <Skeleton className="h-14 w-64 md:w-[25em] rounded-xl bg-blue-100" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-4 w-80 rounded-lg bg-blue-100" />
                        <Skeleton className="h-4 w-70 rounded-lg bg-blue-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-sm">
                        <Skeleton className="h-12 rounded-2xl bg-blue-100" />
                        <Skeleton className="h-12 rounded-2xl bg-blue-100" />
                        <Skeleton className="h-12 rounded-2xl bg-blue-100" />
                        <Skeleton className="h-12 rounded-2xl bg-blue-100" />
                    </div>

                    <Skeleton className="h-12 w-40 rounded-full bg-blue-200" />
                </div>

                {/* Right — mosaic grid (desktop) */}
                <div className="hidden lg:grid shrink-0 w-[44%] grid-cols-3 grid-rows-2 gap-3 h-105">
                    <Skeleton className="rounded-2xl bg-blue-100" />
                    <Skeleton className="rounded-2xl bg-blue-100" />
                    <Skeleton className="rounded-2xl bg-blue-100" />
                    <Skeleton className="col-span-2 rounded-2xl bg-blue-100" />
                    <Skeleton className="rounded-2xl bg-blue-100" />
                </div>

                {/* Mobile — horizontal strip */}
                <div className="lg:hidden flex gap-3 w-full overflow-hidden">
                    <Skeleton className="h-52 w-[45%] shrink-0 rounded-2xl bg-blue-100" />
                    <Skeleton className="h-52 w-[55%] shrink-0 rounded-2xl bg-blue-100" />
                    <Skeleton className="h-52 w-[45%] shrink-0 rounded-2xl bg-blue-100" />
                </div>
            </div>
        </section>
    )
}