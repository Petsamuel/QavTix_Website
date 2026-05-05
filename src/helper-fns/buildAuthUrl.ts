const CALLBACK_URL = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/auth/callback`

export function buildGoogleUrl(): string {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: CALLBACK_URL,
        response_type: "code",
        scope: "openid email profile",
        state: "google",
        access_type: "online",
        prompt: "consent",
    })
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
    console.log("[buildGoogleUrl]", url)  // copy the redirect_uri from this log
    return url
}

export function buildFacebookUrl(): string {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        redirect_uri: CALLBACK_URL,
        response_type: "code",
        scope: "email,public_profile",
        state: "facebook",
    })
    return `https://www.facebook.com/v18.0/dialog/oauth?${params}`
}

export function buildAppleUrl(): string {
    const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
        redirect_uri: CALLBACK_URL,
        response_type: "code id_token",
        scope: "name email",
        response_mode: "form_post",
        state: "apple",
    })
    return `https://appleid.apple.com/auth/authorize?${params}`
}