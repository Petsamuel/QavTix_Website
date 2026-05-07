export const EventCategory = {
  ConcertAndMusic: {
    value: "concert_and_music",
    label: "Concerts & Music",
    path: "concerts_and_music"
  },
  SportAndFitness: {
    value: "sport_and_fitness",
    label: "Sports & Fitness",
    path: "sports_and_fitness"
  },
  ArtAndTheater: {
    value: "art_and_theater",
    label: "Arts & Theater",
    path: "arts_and_theater"
  },
  FoodAndDrinking: {
    value: "food_and_drinking",
    label: "Food & Dining",
    path: "food_and_drinking"
  },
  Festivals: {
    value: "festivals",
    label: "Festivals",
    path: "festivals"
  },
  BusinessAndNetworking: {
    value: "business_and_networking",
    label: "Business & Networking",
    path: "business_and_networking"
  },
  TravelsAndTours: {
    value: "travels_and_tours",
    label: "Travel & Tours",
    path: "travels_and_tours"
  },
  NightlifeAndParties: {
    value: "nightlife_and_parties",
    label: "Nightlife & Parties",
    path: "nightlife_and_parties"
  },
} as const;


export const EVENT_CATEGORIES_ARRAY = Object.values(EventCategory)

// Type for the value (e.g. for form values, API payloads)
export type EventCategoryValue = typeof EventCategory[keyof typeof EventCategory]['value']

// Type for the full object if needed
export type EventCategoryItem = typeof EventCategory[keyof typeof EventCategory]

// Helper: Get all values
export const EVENT_CATEGORY_VALUES = Object.values(EventCategory).map((cat) => cat.value)


export const EVENT_CATEGORY_PATHS = Object.values(EventCategory).map((cat) => cat.path)

// Helper: Get all labels
export const EVENT_CATEGORY_LABELS = Object.values(EventCategory).map((cat) => cat.label)

// Helper: Get label from value
export const getEventCategoryLabel = (value: EventCategoryValue): string => {
  const category = Object.values(EventCategory).find((cat) => cat.value === value)
  return category?.label || value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}