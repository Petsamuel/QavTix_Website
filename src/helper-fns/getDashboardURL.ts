/**
 * Returns the correct dashboard URL based on the user's role.
 * host   → https://host.qavtix.com
 * attendee (or any other role) → https://attendee.qavtix.com
 */
export function getDashboardURL(role?: UserRole): string {
  if (!role) {
    // Default to main domain if role is undefined (shouldn't happen for authenticated users)
    return `https://${process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'qavtix.com'}`
  }
  const base = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'qavtix.com'
  return role === 'host' ? `https://host.${base}` : role === 'attendee' ? `https://attendee.${base}` : `https://admin.${base}`
}