interface AuthPagesSlidesData {
    id: readonly number,
    image: readonly string,
    title: readonly string,
    description: readonly string
}


interface PasswordStrengthCheck {
    atLeastOneUppercase: boolean
    atLeastOneNumber: boolean
    atLeastEightCharacters: boolean
    score: number
    strength: 'weak' | 'medium' | 'strong'
    color: string
    label: string
}

type AccountType = "attendee" | "host" | "admin"