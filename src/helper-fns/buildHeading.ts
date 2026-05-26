import { formatPrice } from "./formatPrice";
import { format } from "date-fns";
import { countries, getStates } from "@/components-data/location";
import { ApiCategory } from "@/actions/filters";
import { resolveCountryLabel, resolveStateLabel } from "./resolveCountryCode";

export const buildSearchResultsHeading = (filters: FilterValues, categoriesList?: ApiCategory[]) => {
  const { categories, location, priceRange, dateRange } = filters;

  // Categories
  const categoryText =
    categories && categories.length > 0
      ? categories
          .map((id) => {
            const match = categoriesList?.find((c) => String(c.id) === String(id));
            return match?.name ?? String(id);
          })
          .join(", ")
      : "all";

  // Location
  const locationText =
    location?.state
      ? `in ${resolveStateLabel(location.state, location.country || "")}`
      : location?.country
        ? `in ${resolveCountryLabel(location.country)}`
        : "";

  // Price range
  const priceText =
    priceRange
      ? `priced between ${priceRange.min.toLocaleString()} and ${priceRange.max.toLocaleString()}`
      : "";

  // Date range
  const dateText =
    dateRange
      ? "during the selected dates"
      : "";

  return [
    "Showing results for",
    `${categoryText} events`,
    locationText,
    priceText,
    dateText,
  ].filter(Boolean).join(" ").trim()
}




interface FilterValues {
  categories?: string[]
  location?: {
    country?: string
    state?: string
  } | null
  priceRange?: {
    min: number
    max: number
  } | null
  dateRange?: {
    from?: Date
    to?: Date
  } | null
}



export const buildTrendingEventsHeading = (filters: FilterValues, categories: ApiCategory[]): string => {
  const parts: string[] = ["Trending events for"]

  if (filters.categories && filters.categories.length > 0) {
    const names = filters.categories
      .map(id => {
        const match = categories.find(c => String(c.id) === String(id))
        return match?.name ?? String(id)
      })
      .join(" & ")
    parts.push(`'${names}'`)
  }

  if (filters.location?.state) {
    const fullStateName = getStates(filters.location?.country || "").find(v => v.value === filters.location?.state)?.label
    parts.push(`in "${fullStateName || filters.location.state}"`)
  } else if (filters.location?.country) {
    const fullCountryName = countries.find(v => v.value === filters.location?.country)?.label
    parts.push(`in "${fullCountryName || filters.location.country}"`)
  }

  if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max > 0)) {
    const min = formatPrice(filters.priceRange.min)
    const max = formatPrice(filters.priceRange.max)

    if (filters.priceRange.min > 0 && filters.priceRange.max > 0) {
      parts.push(`priced between ${min} and ${max}`)
    } else if (filters.priceRange.min > 0) {
      parts.push(`from ${min}`)
    } else if (filters.priceRange.max > 0) {
      parts.push(`up to ${max}`)
    }
  }

  if (filters.dateRange?.from || filters.dateRange?.to) {
    const from = filters.dateRange.from ? format(filters.dateRange.from, "MMM d") : null
    const to = filters.dateRange.to ? format(filters.dateRange.to, "MMM d, yyyy") : null

    if (from && to) parts.push(`from ${from} to ${to}`)
    else if (from) parts.push(`starting ${from}`)
    else if (to) parts.push(`until ${to}`)
  }

  if (parts.length === 1) return "Trending events"

  return parts.join(" ")
}