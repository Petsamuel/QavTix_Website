interface TicketTier {
  id: string
  name: string
  price: number
  originalPrice: number
  currency: string
  description?: string
  features?: string[]
  available: boolean
  soldOut?: boolean
}

interface Discount {
    type: 'coupon' | 'membership'
    code?: string
    percentage?: number
    amount?: number
    description?: string
}

interface CheckoutTicket extends TicketTier {
    quantity: number
}


interface PriceRange {
    min: number
    max: number
}

interface Category {
    value: string
    label: string
    count: number
}

interface Location {
    country: string
    state: string
}


interface FilterValues {
    dateRange?: DateRange | null
    location?: {
        country: string,
        state: string
    } | null
    categories: Category["value"][]
    priceRange: PriceRange | null
}


type FilterFor = "homepage" | "eventPage"





type EventType         = "single" | "recurring"
type EventLocationType = "physical" | "online" | "tba"
type EventStatus       = "draft" | "active" | "sold-out" | "new" | "ended" | "cancelled" | "banned" | "filling-fast" | "selling-fast" | "near-capacity" | "starts-soon"
type RefundPolicy      = "no" | "partial" | "full" | "custom"

interface PublicPagesEvent {
    id:               string
    event_name:       string
    category:         string
    event_datetime:   string
    end_datetime:     string
    event_location:   EventLocation
    event_image:      string
    host:             string
    event_status:     EventStatus
    attendees_count:  string
    event_description: string
    price:            string
}

interface TopLocation {
    city:        string
    state:       string
    country:     string
    event_count: number
    description: string
}


interface LocationPageData {
    city:               string
    description:        string
    total_events:       number
    total_subscribers:  number
    events:             HomepageEvent[]
}


interface Tag {
    id:   number
    name: string
}

interface IEvent {
    id:                      string  // UUID
    title:                   string
    category:                number | null  // FK → Category.id
    tags:                    number[]       // M2M → Tag.id[]
    event_type:              EventType
    start_datetime:          string
    end_datetime:            string
    location_type:           EventLocationType
    short_description:       string
    full_description:        string
    organizer_display_name:  string
    organizer_description:   string
    public_email:            string
    phone_number:            string
    refund_policy:           RefundPolicy
    refund_percentage:       number | null
    qr_enabled:              boolean
    age_restriction:         boolean
    order_confirmation:      boolean
    ticket_delivery:         boolean
    reminders:               boolean
    post_event_emails:       boolean
    customize_sender_name:   boolean
    affiliate_enabled:       boolean
    commission_percentage:   number | null
    affiliate_start:         string | null
    affiliate_end:           string | null
    host:                    number  // FK → Host.id
    status:                  EventStatus
    created_at:              string
    updated_at:              string
    views_count:             number
    saves_count:             number
}

interface EventLocation {
    id:          number
    event:       string  // FK → Event.id (UUID)
    venue_name:  string
    address:     string
    country:     string
    state:       string
    city:        string
    postal_code: string
}

interface EventMedia {
    id:          number
    event:       string  // FK → Event.id (UUID)
    image_url:   string | null
    video_url:   string | null
    is_featured: boolean
}