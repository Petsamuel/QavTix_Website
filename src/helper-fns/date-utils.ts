import { addWeeks, format, isToday, isTomorrow, isWithinInterval } from "date-fns"

// CHECKS IF A DATE OBJECT IS VALID AND NOT NaN
export function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

// FORMATS A DATE INTO VARIOUS STRING PATTERNS BASED ON THE formatStr ARGUMENT
// DEFAULTS TO 'MM / dd / yyyy' IF NO FORMAT IS SPECIFIED
export const formatDate = (date: Date | undefined, formatStr: string = 'MM / dd / yyyy'): string => {
  if (!date) return ''
  
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day   = String(date.getDate()).padStart(2, '0')
  const year  = date.getFullYear()
  
  // SHORT MONTH + DAY — e.g. "Jan 05"
  if (formatStr === 'MMM dd') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}`
  }
  
  // SHORT MONTH + DAY + YEAR — e.g. "Jan 05, 2025"
  if (formatStr === 'MMM dd, yyyy') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${monthNames[date.getMonth()]} ${day}, ${year}`
  }
  
  // LONG LOCALE FORMAT — e.g. "January 05, 2025"
  if (formatStr === 'full') {
    return date.toLocaleDateString("en-US", {
      day: "2-digit", month: "long", year: "numeric",
    })
  }
  
  return `${month} / ${day} / ${year}`
}

// FORMATS AN ISO STRING TO A SHORT LOCALE DATE — e.g. "5 Jan 2025"
export function formatDateSimple(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

// ADDS N DAYS TO A DATE AND RETURNS A NEW DATE OBJECT
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// RETURNS THE MONDAY OF THE WEEK CONTAINING THE GIVEN DATE, AT MIDNIGHT
export const startOfWeek = (date: Date): Date => {
  const result = new Date(date)
  const day    = result.getDay()
  const diff   = day === 0 ? 6 : day - 1
  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)
  return result
}

// RETURNS THE SUNDAY OF THE WEEK CONTAINING THE GIVEN DATE, AT END OF DAY
export const endOfWeek = (date: Date): Date => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  result.setHours(23, 59, 59, 999)
  return result
}

// RETURNS THE FIRST DAY OF THE MONTH FOR THE GIVEN DATE
export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

// RETURNS THE LAST DAY OF THE MONTH FOR THE GIVEN DATE
export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

// FORMATS A DATE INTO A HUMAN-READABLE STRING WITH BOTH DATE AND TIME
// e.g. "January 5, 2025 | 9:00 AM"
export function formatDateTime(date: string | Date) {
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (isNaN(dateObj.getTime())) return ""

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(dateObj)

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  }).format(dateObj)

  return `${formattedDate} | ${formattedTime}`
}

export function formatEventDate(isoString: string | Date): string {
  if (!isoString) return "Date TBA"

  const date = typeof isoString === 'string' ? new Date(isoString) : isoString
  if (isNaN(date.getTime())) return "Date TBA"

  const now  = new Date()

  const timeStr = format(date, "h:mmaaa").toUpperCase()
  const dateStr = format(date, "MMMM d")

  if (isToday(date))    return `Today, ${dateStr}, ${timeStr} WAT`
  if (isTomorrow(date)) return `Tomorrow, ${dateStr}, ${timeStr} WAT`

  const thisWeekStart    = startOfWeek(now)
  const thisWeekendStart = new Date(endOfWeek(now))
  thisWeekendStart.setDate(endOfWeek(now).getDate() - 1)

  if (isWithinInterval(date, { start: thisWeekendStart, end: endOfWeek(now) })) {
    return `This Weekend, ${dateStr}, ${timeStr} WAT`
  }

  const nextWeekStart    = addWeeks(thisWeekStart, 1)
  const nextWeekEnd      = endOfWeek(nextWeekStart)
  const nextWeekendStart = new Date(nextWeekEnd)
  nextWeekendStart.setDate(nextWeekEnd.getDate() - 1)

  if (isWithinInterval(date, { start: nextWeekendStart, end: nextWeekEnd })) {
    return `Next Weekend, ${dateStr}, ${timeStr} WAT`
  }

  const nextWeekFriday = new Date(nextWeekStart)
  nextWeekFriday.setDate(nextWeekStart.getDate() + 4)

  if (isWithinInterval(date, { start: nextWeekStart, end: nextWeekFriday })) {
    return `Next Week, ${dateStr}, ${timeStr} WAT`
  }

  return `${dateStr}, ${timeStr} WAT`
}

// RETURNS A HUMAN-READABLE COUNTDOWN FROM NOW TO A FUTURE DATE
// e.g. "15 days", "Today", "In 3 hours", "2 months"
// RETURNS null IF THE DATE IS IN THE PAST OR INVALID
export function formatCountdown(isoString: string): string | null {
  if (!isoString) return null

  const target = new Date(isoString)
  if (isNaN(target.getTime())) return null

  const now        = new Date()
  const diffMs     = target.getTime() - now.getTime()

  // EVENT HAS ALREADY PASSED
  if (diffMs <= 0) return null

  const diffMins   = Math.floor(diffMs / (1000 * 60))
  const diffHours  = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays   = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffMonths = Math.floor(diffDays / 30)

  if (diffMins  < 60)  return `In ${diffMins} minute${diffMins === 1 ? '' : 's'}`
  if (diffHours < 24)  return `In ${diffHours} hour${diffHours === 1 ? '' : 's'}`
  if (diffDays  === 0) return 'Today'
  if (diffDays  === 1) return 'Tomorrow'
  if (diffDays  < 30)  return `${diffDays} day${diffDays === 1 ? '' : 's'}`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`

  const diffYears = Math.floor(diffMonths / 12)
  return `${diffYears} year${diffYears === 1 ? '' : 's'}`
}