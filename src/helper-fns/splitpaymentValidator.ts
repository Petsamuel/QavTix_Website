// ─────────────────────────────────────────────────────────────────────────────
// Split Payment Helpers
// The backend expects percentages that sum to exactly 100.
// ALL members — including the initiator — must appear in split_members.
// "equal" mode distributes evenly; the last member absorbs rounding remainder.
// "manual" mode converts each attendee's entered amount to a percentage;
// the initiator receives whatever percentage is left over.
// ─────────────────────────────────────────────────────────────────────────────

export interface SplitMember {
    email:         string
    percentage:    string   // String with 2dp e.g. "33.34"
    date_of_birth: string
}

/**
 * Builds split_members for "equal" mode.
 * Includes the initiator as the first entry.
 * The last member absorbs any floating-point remainder so the total is exactly 100.
 */
export function buildEqualSplitMembers(
    initiator: { email: string; dateOfBirth: string },
    attendees: Array<{ email: string; dateOfBirth: string }>,
): SplitMember[] {
    const allMembers = [
        { email: initiator.email, dateOfBirth: initiator.dateOfBirth },
        ...attendees,
    ]
    const totalPeople = allMembers.length
    if (totalPeople === 0) return []

    // Floor to 2dp so we never over-allocate; last member absorbs the remainder
    const base = Math.floor((100 / totalPeople) * 100) / 100

    return allMembers.map((member, i) => {
        const isLast = i === totalPeople - 1
        const percentage = isLast
            ? parseFloat((100 - base * (totalPeople - 1)).toFixed(2))
            : base
        return {
            email:         member.email,
            percentage:    percentage.toFixed(2),
            date_of_birth: member.dateOfBirth,
        }
    })
}

/**
 * Builds split_members for "manual" mode.
 * Converts each attendee's entered amount to a percentage of the total.
 * The initiator's percentage is the remainder (100 - sum of attendee percentages).
 * Initiator is listed first.
 */
export function buildManualSplitMembers(
    initiator: { email: string; dateOfBirth: string },
    attendees: Array<{ email: string; dateOfBirth: string; amount: number }>,
    total:     number,
): SplitMember[] {
    if (total === 0 || attendees.length === 0) return []

    // Floor each attendee percentage to 2dp so we never over-allocate
    const attendeePercentages = attendees.map((a) => {
        const raw = (a.amount / total) * 100
        return Math.floor(raw * 100) / 100
    })

    const assignedSum = attendeePercentages.reduce((s, p) => s + p, 0)
    const initiatorPercentage = parseFloat((100 - assignedSum).toFixed(2))

    return [
        {
            email:         initiator.email,
            percentage:    initiatorPercentage.toFixed(2),
            date_of_birth: initiator.dateOfBirth,
        },
        ...attendees.map((a, i) => ({
            email:         a.email,
            percentage:    attendeePercentages[i].toFixed(2),
            date_of_birth: a.dateOfBirth,
        })),
    ]
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