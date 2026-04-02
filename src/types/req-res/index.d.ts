interface AuthTokens {
    access:  string
    refresh: string
}

interface LoginResponseData {
    user:   AuthUser
    tokens: AuthTokens
}

interface LoginResponse {
    message: string
    status:  number
    data:    LoginResponseData
}


// Shared envelope

interface ApiResponse<T> {
    message: string
    status:  number
    data:    T
}

interface PaginatedResponse<T> {
    count:    number
    next:     number | null
    total_pages: number
    previous: number | null
    results:  T[]
}


// POST /auth/login/
interface LoginRequest {
    email:    string
    password: string
}

// GET /auth/me/ or /auth/profile/
type ProfileResponse = ApiResponse<AuthUser>


interface UpdateProfilePayload {
    full_name?:       string
    phone_number?:    string
    dob?:             string | null
    gender?:          string
    country?:         string
    state?:           string
    city?:            string
    profile_picture?: string | null
    role?:            string
}


interface CategoryPageData {
    name:              string
    description:       string
    total_events:      number
    total_subscribers: number
    events:            PublicPagesEvent[]
}

interface ContactHostPayload {
    full_name: string
    email:     string
    message:   string
    host:      number | string
}


interface InitializePaymentPayload {
    full_name:     string
    phone_number:  string
    is_split:      boolean
    promo_code:    string
    save_card:     boolean
    event_id?: string
    date_of_birth: string

    // Regular event fields
    tickets?:  { ticket_id: number; quantity: number }[]

    // Marketplace (secondary ticket) field
    marketplace_listing_id?: string
}