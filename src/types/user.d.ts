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

 // Havent confirmed Proper Type //

type Host = {
    id: number,
    followers: number,
    events: number,
    profile_img: string,
    name: string,
    username: string
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