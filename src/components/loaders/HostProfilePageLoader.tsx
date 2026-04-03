// HostProfilePageSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function HostProfilePageSkeleton() {
    return (
        <main className="py-24.5 mt-2 md:mt-8">
            <div className="global-px">

                <div className="h-72 md:h-96 relative mb-20 md:mb-16">
                    <Skeleton className="bg-[#E0E0E0] rounded-[50px] h-full w-full" />
                    {/* Avatar ring */}
                    <div className="bg-white p-3 rounded-full -bottom-16 absolute w-fit">
                        <Skeleton className="bg-[#E0E0E0] rounded-full w-[6.25em] md:w-36 aspect-square" />
                    </div>
                </div>

                {/* Desktop — follow button */}
                <div className="hidden md:flex justify-end -translate-y-10">
                    <Skeleton className="bg-[#E0E0E0] h-12 w-36 rounded-3xl" />
                </div>

                <div className="md:flex justify-between items-start gap-10">

                    {/* Left — name, description, socials */}
                    <div className="flex-1 max-w-xl space-y-3">
                        <Skeleton className="bg-[#E0E0E0] h-8 w-64 rounded-lg" />
                        <Skeleton className="bg-[#E0E0E0] h-4 w-full rounded" />
                        <Skeleton className="bg-[#E0E0E0] h-4 w-5/6 rounded" />
                        <Skeleton className="bg-[#E0E0E0] h-4 w-4/6 rounded" />
                    </div>

                    {/* Right — stats + mobile follow */}
                    <div className="mt-10 md:mt-0 flex flex-wrap justify-between items-center gap-5">
                        <div className="flex gap-6 items-center">
                            <div className="space-y-1.5">
                                <Skeleton className="bg-[#E0E0E0] h-6 w-12 rounded" />
                                <Skeleton className="bg-[#E0E0E0] h-4 w-16 rounded" />
                            </div>
                            <div className="w-px h-8 bg-neutral-3" />
                            <div className="space-y-1.5">
                                <Skeleton className="bg-[#E0E0E0] h-6 w-8 rounded" />
                                <Skeleton className="bg-[#E0E0E0] h-4 w-12 rounded" />
                            </div>
                        </div>
                        <Skeleton className="bg-[#E0E0E0] h-12 w-32 rounded-3xl md:hidden" />
                    </div>
                </div>
            </div>
        </main>
    )
}