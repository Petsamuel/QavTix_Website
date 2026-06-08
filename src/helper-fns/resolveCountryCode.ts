import { Country, State } from "country-state-city";

export const resolveCountryCode = (country: string): string | null => {
    if (country.length === 2) return country;

    const match = Country.getAllCountries().find(
        c => c.name.toLowerCase() === country.toLowerCase()
    )

    return match?.isoCode ?? null;
}

/**
 * Resolves a country value to its full name.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
export function resolveCountryLabel(value: string): string {
    if (value.length < 3) {
        const match = Country.getCountryByCode(value.toUpperCase())
        return match?.name ?? value
    }
    return value
}

/**
 * Resolves a state value to its full name within a given country.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
export function resolveStateLabel(stateValue: string, countryCode: string): string {
    if (stateValue.length < 3) {
        const states = State.getStatesOfCountry(countryCode.toUpperCase())
        const match  = states.find(s => s.isoCode === stateValue.toUpperCase())
        const name   = match?.name ?? stateValue
        // Normalize FCT to a clean, short form the backend accepts
        if (countryCode.toUpperCase() === "NG" && name.toUpperCase().includes("ABUJA")) {
            return "Abuja"
        }
        return name
    }
    // Also normalize if a long FCT label was stored directly
    if (countryCode.toUpperCase() === "NG" && stateValue.toUpperCase().includes("ABUJA")) {
        return "Abuja"
    }
    return stateValue
}
