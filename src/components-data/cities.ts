interface CityStaticData {
    image:       string
    description: string
}

// HD Unsplash photos — beaches, hotels, landmarks, skylines
// Format: https://images.unsplash.com/photo-{id}?w=800&q=90&auto=format&fit=crop
const CITY_DATA: Record<string, CityStaticData> = {
    // Nigeria
    "lagos": {
        image:       "https://images.unsplash.com/photo-1594803294810-c860e5d29e07?w=800&q=90&auto=format&fit=crop",
        description: "The vibrant heart of Nigeria with beaches, nightlife, and bustling markets.",
    },
    "abuja": {
        image:       "https://images.unsplash.com/photo-1618556658017-fd9c732d1360?w=800&q=90&auto=format&fit=crop",
        description: "Nigeria's modern capital city with iconic landmarks and beautiful green spaces.",
    },
    "port harcourt": {
        image:       "https://visaliv.s3.ap-south-1.amazonaws.com/Port-Harcourt-Tourist-Beach-NG.jpg",
        description: "The garden city of Nigeria, famous for its rivers and vibrant food culture.",
    },
    "kano": {
        image:       "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=90&auto=format&fit=crop",
        description: "Ancient city with historic walls, dye pits, and rich Hausa culture.",
    },
    "ibadan": {
        image:       "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=90&auto=format&fit=crop",
        description: "Nigeria's third-largest city with rolling hills and rich cultural heritage.",
    },
    "calabar": {
        image:       "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=90&auto=format&fit=crop",
        description: "Known as the Canaan City, home of Nigeria's famous carnival festival.",
    },
    "enugu": {
        image:       "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=90&auto=format&fit=crop",
        description: "The coal city with cool weather and vibrant Igbo cultural traditions.",
    },
    "benin city": {
        image:       "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&q=90&auto=format&fit=crop",
        description: "Home of the ancient Benin Kingdom, renowned for its bronze artworks.",
    },

    // UAE
    "dubai": {
        image:       "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=90&auto=format&fit=crop",
        description: "A city of superlatives — world-class hotels, desert dunes, and iconic skylines.",
    },
    "abu dhabi": {
        image:       "https://images.unsplash.com/photo-1538707873135-7be8e4de2a18?w=800&q=90&auto=format&fit=crop",
        description: "The UAE capital blending heritage, luxury, and stunning waterfront experiences.",
    },

    // UK
    "london": {
        image:       "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=90&auto=format&fit=crop",
        description: "A world capital of culture, history, and entertainment that never sleeps.",
    },
    "manchester": {
        image:       "https://images.unsplash.com/photo-1526129318344-f3d38f6e8c62?w=800&q=90&auto=format&fit=crop",
        description: "The beating heart of Northern England, famous for music, sport, and nightlife.",
    },

    // USA
    "new york": {
        image:       "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=90&auto=format&fit=crop",
        description: "The city that never sleeps — iconic skylines, world-class events, and culture.",
    },
    "los angeles": {
        image:       "https://images.unsplash.com/photo-1580655653885-65763b2597d1?w=800&q=90&auto=format&fit=crop",
        description: "City of Angels — beaches, Hollywood glamour, and year-round sunshine.",
    },
    "miami": {
        image:       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90&auto=format&fit=crop",
        description: "Vibrant beach city with world-famous nightlife, art, and Latin culture.",
    },
    "houston": {
        image:       "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=800&q=90&auto=format&fit=crop",
        description: "A dynamic city of space exploration, diverse food, and major live events.",
    },

    // Ghana
    "accra": {
        image:       "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=90&auto=format&fit=crop",
        description: "West Africa's cultural hub with beautiful beaches and a thriving arts scene.",
    },

    // South Africa
    "johannesburg": {
        image:       "https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&q=90&auto=format&fit=crop",
        description: "South Africa's financial capital with a vibrant music and events scene.",
    },
    "cape town": {
        image:       "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=90&auto=format&fit=crop",
        description: "Breathtaking mountain meets ocean — one of the world's most beautiful cities.",
    },

    // Kenya
    "nairobi": {
        image:       "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&q=90&auto=format&fit=crop",
        description: "East Africa's tech and cultural hub, gateway to world-famous wildlife parks.",
    },

    // France
    "paris": {
        image:       "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=90&auto=format&fit=crop",
        description: "The city of light — romance, fashion, art, and world-class cuisine.",
    },
}

// State/region → city fallback map
// When the API returns a state name, map it to its major city
const STATE_TO_CITY: Record<string, string> = {
    // Nigeria
    "lagos state":        "lagos",
    "fct":                "abuja",
    "federal capital territory": "abuja",
    "rivers":             "port harcourt",
    "rivers state":       "port harcourt",
    "kano state":         "kano",
    "oyo state":          "ibadan",
    "cross river":        "calabar",
    "cross river state":  "calabar",
    "enugu state":        "enugu",
    "edo state":          "benin city",
    // UAE
    "dubai emirate":      "dubai",
    "abu dhabi emirate":  "abu dhabi",
    // US states
    "new york state":     "new york",
    "california":         "los angeles",
    "florida":            "miami",
    "texas":              "houston",
    // UK
    "greater manchester": "manchester",
    "greater london":     "london",
    // Africa
    "gauteng":            "johannesburg",
    "western cape":       "cape town",
    "nairobi county":     "nairobi",
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=90&auto=format&fit=crop"
const FALLBACK_DESC  = "Discover exciting events happening in this destination."

export function getCityStaticData(city: string, state?: string): CityStaticData {
    const cityKey  = city.toLowerCase().trim()
    const stateKey = state?.toLowerCase().trim() ?? ""

    // Direct city match
    if (CITY_DATA[cityKey]) return CITY_DATA[cityKey]

    // State → city lookup
    const mappedCity = STATE_TO_CITY[stateKey] ?? STATE_TO_CITY[cityKey]
    if (mappedCity && CITY_DATA[mappedCity]) return CITY_DATA[mappedCity]

    // Partial match — handles "Lagos Island" → "lagos"
    const partialKey = Object.keys(CITY_DATA).find(
        key => cityKey.includes(key) || key.includes(cityKey)
    )
    if (partialKey) return CITY_DATA[partialKey]

    // Fallback
    return { image: FALLBACK_IMAGE, description: FALLBACK_DESC }
}

// Curated fallback destinations shown when API returns fewer than 5 locations
export const FALLBACK_DESTINATIONS: TopLocation[] = [
    { city: "Dubai",        state: "Dubai",          country: "UAE",          event_count: 0, description: "" },
    { city: "London",       state: "Greater London",  country: "UK",           event_count: 0, description: "" },
    { city: "Paris",        state: "Île-de-France",   country: "France",       event_count: 0, description: "" },
    { city: "New York",     state: "New York",        country: "USA",          event_count: 0, description: "" },
    { city: "Cape Town",    state: "Western Cape",    country: "South Africa", event_count: 0, description: "" },
    { city: "Nairobi",      state: "Nairobi County",  country: "Kenya",        event_count: 0, description: "" },
    { city: "Accra",        state: "Greater Accra",   country: "Ghana",        event_count: 0, description: "" },
    { city: "Johannesburg", state: "Gauteng",         country: "South Africa", event_count: 0, description: "" },
]