/** Converts any casing to Title Case — e.g. "JOHN TOURS DAY" → "John Tours Day" */
export function toTitleCase(str: string): string {
    if (!str) return str
    return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}
