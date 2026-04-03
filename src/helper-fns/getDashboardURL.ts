/**
 * Returns the correct dashboard URL based on the user's role.
 * host   → https://host.qavtix.com
 * attendee (or any other role) → https://attendee.qavtix.com
 */
export function getDashboardURL(role?: UserRole): string {
  if (!role) {
    // Default to main domain if role is undefined (shouldn't happen for authenticated users)
    return `process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'qavtix.com'}`
  }
  return role === 'host' ? process.env.NEXT_PUBLIC_HOST_SITE! : role === 'attendee' ? process.env.NEXT_PUBLIC_ATTENDEE_SITE! : process.env.NEXT_PUBLIC_ADMIN_SITE!
}