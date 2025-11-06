/**
 * Get display name with admin crown if applicable
 * @param {Object} user - User object with displayName, name, isAdmin, showAdminBadge
 * @returns {string} Display name with crown if admin badge should be shown
 */
export function getDisplayName(user) {
  if (!user) return "Unknown User";

  const baseName = user.displayName || user.name;

  // Add crown if user is admin and showAdminBadge is true
  if (user.isAdmin === true && user.showAdminBadge === true) {
    return `👑 ${baseName}`;
  }

  return baseName;
}
