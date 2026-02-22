import { space_grotesk } from "@/lib/fonts"
import { Icon } from "@iconify/react"

interface MobileFeatureComparisonProps {
  data: PricingData,
}

export default function MobileFeatureComparison({ data }: MobileFeatureComparisonProps) {


    return (
        <div className="lg:hidden">            
            <div className="space-y-14">
                {data.plans.map((plan) => (
                    <div key={plan.id} className="mt-12">

                        <div className="flex justify-end">
                            <span className="bg-secondary-9 min-w-[10em] text-white px-4 py-3 rounded-xl font-medium text-xs mb-4 text-center">
                                {plan.name}
                            </span>
                        </div>
                        
                        <div className="space-y-2">
                            {data.features.map((feature, index) => {
                                const value = feature[plan.id as keyof PricingFeature]
                                const isBoolean = typeof value === 'boolean'
                                
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-2 px-8"
                                    >
                                        <span className="text-sm text-neutral-10 font-medium">{feature.name}</span>
                                        <div>
                                            {isBoolean ? (
                                                value ? (
                                                <Icon icon="hugeicons:checkmark-square-01" width="24" height="24" className="text-postive-default" />
                                                ) : (
                                                <Icon icon="basil:lock-outline" className="w-5 h-5 text-red-500" />
                                                )
                                            ) : (
                                                <span className="text-sm text-neutral-8 font-medium">{value}</span>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}