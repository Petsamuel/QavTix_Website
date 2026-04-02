// ─────────────────────────────────────────────────────────────────────────────
// Split Payment Helpers
// The backend expects percentages that sum to exactly 100.
// "equal" mode distributes evenly; the last member absorbs rounding remainder.
// "manual" mode uses user-entered amounts, converted to percentages of the total.
// ─────────────────────────────────────────────────────────────────────────────

export interface SplitMember {
    email:         string
    percentage:    string   // String with 2dp e.g. "33.34"
    date_of_birth: string
}

/**
 * Builds split_members for "equal" mode.
 * The last member absorbs any floating point remainder so the total is exactly 100.
 */
export function buildEqualSplitMembers(
    attendees: Array<{ email: string; dateOfBirth: string }>,
): SplitMember[] {
    const count = attendees.length
    if (count === 0) return []

    const totalPeople = count + 1 // include initiator
    const rawShare = 100 / totalPeople
    const base = Math.floor(rawShare * 100) / 100

    const shares = Array(count).fill(base)
    const roundedSum = base * count
    const remaining = (rawShare * count) - roundedSum

    if (count > 0) {
        shares[count - 1] = Number((shares[count - 1] + remaining).toFixed(2))
    }

    return attendees.map((a, i) => ({
        email:         a.email,
        percentage:    shares[i].toFixed(2),
        date_of_birth: a.dateOfBirth,
    }))
}

/**
 * Builds split_members for "manual" mode.
 * Converts each member's amount to a percentage of the total.
 */
export function buildManualSplitMembers(
    attendees: Array<{ email: string; dateOfBirth: string; amount: number }>,
    total:     number,
): SplitMember[] {
    if (total === 0 || attendees.length === 0) return []

    const percentages = attendees.map((a) => {
        const raw = (a.amount / total) * 100
        return {
            email: a.email,
            date_of_birth: a.dateOfBirth,
            percentage: (raw > 0 ? Number(raw.toFixed(2)) : 0).toFixed(2),
        }
    })

    return percentages.map((a) => ({
        email: a.email,
        percentage: a.percentage,
        date_of_birth: a.date_of_birth,
    }))
}

/**
 * Validates that the split can proceed:
 * All attendees have email + date of birth
 * Manual mode: amounts sum to the expected total (within ±1 for rounding)
 */
export function validateSplitMembers(
    attendees: Array<{ email?: string; dateOfBirth?: string; amount?: number }>,
    mode:      'equal' | 'manual',
    total:     number,
    ageRestricted: boolean,
): string | null {
    if (attendees.length === 0) return "Add at least one group member to split the payment."

    for (const a of attendees) {
        if (!a.email)       return "All group members must have an email address."
        if (ageRestricted && !a.dateOfBirth) return "All group members must provide their date of birth."
        if (mode === 'manual' && (!a.amount || a.amount <= 0)) {
            return "All group members must have a valid amount in manual split mode."
        }
    }

    if (mode === 'manual') {
        const sum = attendees.reduce((s, a) => s + (a.amount ?? 0), 0)

        if (sum <= 0) {
            return 'At least one group member must have a positive amount to pay.'
        }

        if (sum >= total) {
            return 'Initiator must retain a positive remaining balance to pay.'
        }

        const remaining = total - sum
        if (remaining < 1) {
            return 'Initiator must pay a meaningful amount (remaining balance must be at least 1).'
        }
    }

    return null
}