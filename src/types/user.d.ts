type UserRole = "attendee" | "host" | "admin"

type AuthUser = {
    profile_img: string,
    full_name: string,
    id: string,
    phone_number: string
    username: string
    role: UserRole
    email: string,
    phone: string
}


type UserGroup = {
    id: string
    name: string
    members: {
        name: string
        email: string
        phone: string
    }[]
}


interface UserProfile {
    id:               number
    full_name:        string
    email:            string
    email_verified:   boolean
    phone_number:     string
    dob:              string | null
    gender:           string
    country:          string
    state:            string
    city:             string
    profile_picture:  string | null
    role:             string
}


type Attendee = {
    id: number,
    name: string,
    profile_img: string,
    username: string,
    socials?: {
        href: string,
        text: string,
        icon: string
    }[]
}

interface TrendingHost {
    id:             number
    business_name:  string
    followers:      number
    events_count:   number
    trending_score: number
    is_following:    boolean
}

interface HostDetails {
    id:              number
    host:            string
    business_type:   string
    city:            string
    state:           string
    country:         string
    followers_count: number
    events_count:    number
    upcoming_events: PublicPagesEvent[]
    past_events:     PublicPagesEvent[]
    is_following:    boolean
    relevant_links:  Record<string, string>[]
    description:     string
}