'use client'

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

export default function DesktopFeatureComparison({ data }: { data: PricingData }) {

    // Group features by category, preserving insertion order
    const grouped = data.features.reduce<Record<string, typeof data.features>>((acc, feature) => {
        const cat = feature.category ?? 'General'
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(feature)
        return acc
    }, {})

    return (
        <div className="hidden lg:block mt-16">
            <div className="overflow-x-auto">
                <table className="w-full min-w-200 border-collapse">
                    <thead>
                        <tr className="border-b-2 border-neutral-3">
                            <th className="text-left py-5 px-6 font-medium text-sm text-neutral-9 bg-white">
                                Feature
                            </th>
                            {data.plans.map(plan => (
                                <th
                                    key={plan.id}
                                    className="text-center py-5 px-6 font-medium text-sm text-neutral-9 bg-white"
                                >
                                    {plan.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {Object.entries(grouped).map(([category, features]) => (
                            <>
                                {/* Feature rows */}
                                {features.map((feature, index) => (
                                    <tr
                                        key={`${category}-${index}`}
                                        className={cn(
                                            "border-b border-neutral-2 hover:bg-neutral-1/50 transition-colors",
                                            index % 2 === 0 ? 'bg-white' : 'bg-neutral-1/30'
                                        )}
                                    >
                                        <td className="py-5 px-6 text-sm font-medium text-neutral-8">
                                            {feature.name}
                                        </td>

                                        {data.plans.map(plan => {
                                            const value = feature[plan.id as keyof typeof feature]
                                            return (
                                                <td key={plan.id} className="py-5 px-6 text-center">
                                                    {typeof value === 'boolean' ? (
                                                        value ? (
                                                            <Icon
                                                                icon="hugeicons:checkmark-square-01"
                                                                className="inline-block text-green-600 size-6"
                                                            />
                                                        ) : (
                                                            <Icon
                                                                icon="basil:lock-outline"
                                                                className="inline-block text-neutral-8 size-6"
                                                            />
                                                        )
                                                    ) : (
                                                        <span className="text-sm font-medium text-neutral-9">
                                                            {value || '—'}
                                                        </span>
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}