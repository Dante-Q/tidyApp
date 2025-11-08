/**
 * Admin Configuration
 * Add Gmail addresses here to grant admin privileges
 * Admins can:
 * - Edit any post or comment
 * - Delete any post or comment
 * - Move posts between categories/subcategories
 */

export const ADMIN_EMAILS = [
  // Add admin email addresses here (lowercase)
  // Example: "admin@gmail.com",
  "hello@gmail.com",
  "dantequartermain@gmail.com",
  "tidyappinfo@gmail.com",
];

/**
 * Check if an email has admin privileges
 * @param {string} email - Email address to check
 * @returns {boolean} - True if email is in admin list
 */
export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};
