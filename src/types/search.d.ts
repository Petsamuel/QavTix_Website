type SearchIntent =
    | "event"          // search for events — hit the API
    | "page"           // direct user to a known page
    | "support"        // direct user to FAQ / Contact
    | "category"       // direct user to a category page
    | "empty"          // nothing typed

interface PageSuggestion {
    label:       string
    description: string
    href:        string
    icon:        string
}

interface SearchResult {
    intent:      SearchIntent
    suggestions: PageSuggestion[]
}