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

interface ProfileResponse {
    data: {
        full_name: string
        email: string
        email_verified: boolean
        phone_number: string
        dob: string
        country: string
        state: string
        city: string
        profile_picture: string
    }
}