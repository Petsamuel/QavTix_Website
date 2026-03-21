interface PricingPlan {
  id: string
  name: string
  price: number
  currency: string
  perTicketFee: number
  description: string
  features: string[]
  buttonText: string
  buttonVariant: 'primary' | 'secondary'
  highlighted?: boolean
  trial?: string
}

interface PricingFeature {
  name: string
  free: boolean | string
  professional: boolean | string
  enterprise: boolean | string
}

interface PricingData {
  plans: PricingPlan[]
  features: Feature[]
}