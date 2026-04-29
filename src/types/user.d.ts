type UserRole = "attendee" | "host" | "admin"

type AuthUser = {
    profile_picture: string,
    full_name: string,
    id: string,
    phone_number: string
    username: string
    role: UserRole
    email: string,
    country: string
    city: string
    state: string
    dob: string | null
    is_completed: boolean
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
    id: number
    full_name: string
    email: string
    email_verified: boolean
    phone_number: string
    dob: string | null
    gender: string
    country: string
    state: string
    city: string
    profile_picture: string | null
    role: string
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
    id: number
    business_name: string
    followers: number
    events_count: number
    trending_score: number
    is_following: boolean
    profile_picture: string
    is_verified: boolean,
    is_subscribed: boolean
}

interface HostDetails {
    id: number
    host: string
    business_type: string
    city: string
    state: string
    country: string
    followers_count: number
    events_count: number
    upcoming_events: PublicPagesEvent[]
    past_events: PublicPagesEvent[]
    is_following: boolean
    profile_picture: string
    profile_banner: string
    is_verified: boolean,
    is_subscribed: boolean
    relevant_links: Record<string, string>[]
    description: string
}



interface GroupMemberItem {
    email: string
}

interface Group {
    id: string
    name: string
    member_count: string
    members: GroupMemberItem[]
}