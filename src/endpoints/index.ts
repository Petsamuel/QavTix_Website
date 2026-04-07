export const LOGIN_ENDPOINT = "auth/login/"
export const ATTENDEE_REGISTER_ENDPOINT = "auth/auth/register/attendee/"
export const HOST_REGISTER_ENDPOINT = "auth/auth/register/host/"
export const FORGOT_PASSWORD_ENDPOINT = "auth/password-reset/request/"
export const VERIFY_OTP_ENDPOINT = "auth/password-reset/verify-otp/"
export const RESET_PASSWORD_ENDPOINT = "auth/password-reset/confirm/"


export const FAVOURITES_ENDPOINT = "attendee/favorite/list"
export const ADD_FAVOURITE_ENDPOINT = "attendee/favorite/add/"
export const REMOVE_FAVOURITE_ENDPOINT = "attendee/favorite/remove/[event_id]/"


export const GET_HOST_PROFILE_ENDPOINT = "attendee/profile/"
export const GET_ATTENDEE_PROFILE_ENDPOINT = "attendee/profile/"
export const REFRESH_TOKEN_ENDPOINT = "auth/token/refresh/"
export const TOKEN_VERIFY_ENDPOINT = "auth/token/verify/"


export const CATEGORIES_ENDPOINT = "public/categories"
export const CATEGORY_PAGE_ENDPOINT = "public/categories/[category_name]"

export const GET_GROUPS_ENDPOINT = "attendee/groups"

export const FEATURED_EVENTS_ENDPOINT = "public/event/featured"
export const EVENTS_NEARBY_ENDPOINT = "public/events/nearby"
export const TOP_LOCATIONS_ENDPOINT = "public/event/top-locations"
export const LOCATION_PAGE_ENDPOINT = "public/locations/[loc]"
export const CITY_SUBSCRIBE_ENDPOINT = "public/locations/subscribe/"
export const TRENDING_EVENTS_ENDPOINT = "public/event/trending"

export const SEARCH_EVENTS_ENDPOINT = "public/search"
export const EVENT_DETAILS_ENDPOINT = "public/event/[event_id]"
export const MARKETPLACE_EVENT_DETAILS_ENDPOINT = "marketplace/marketplace/[event_id]"

export const TRENDING_HOSTS_ENDPOINT = "public/event/trending-hosts"
export const FOLLOW_HOST_ENDPOINT = "public/hosts/[host_id]/[action]/"
export const HOST_DETAILS_ENDPOINT = "public/hosts/[host_id]"
export const HOST_PAST_EVENTS_ENDPOINT = "public/hosts/[host_id]/past"
export const CONTACT_HOST_ENDPOINT = "public/message/"

export const CHECKOUT_ENDPOINT = "payments/checkout/"
export const CHECKOUT_VERIFY_ENDPOINT = "payments/complete/"
export const VALIDATE_PROMO_CODE_ENDPOINT = "payments/promo-code/validate/"
export const CANCEL_TICKET_ENDPOINT = "public/tickets/[ticket_id]/cancel/"

export const SPLIT_PAYMENT_TOKEN_VERIFY_ENDPOINT = "payments/split/pay/[token]/"
export const SPLIT_PAYMENT_TOKEN_CHECKOUT_ENDPOINT = "payments/split/pay/[token]/"

export const HOST_PLAN_CHECKOUT_ENDPOINT = "payments/plans/subscribe/"
export const ATTENDEE_PLAN_CHECKOUT_ENDPOINT = "payments/attendee-plans/subscribe/"
export const HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT = "payments/plans/complete/"
export const ATTENDEE_CHECKOUT_VERIFY_ENDPOINT = "payments/attendee-plans/complete/"