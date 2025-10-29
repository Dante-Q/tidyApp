/**
 * Surf rating utility
 * Calculates a qualitative surf rating based on wave height and period
 */

export function calculateSurfRating(height, period) {
  // Better waves have more height AND longer period
  const score = height * (period / 10); // Normalize period contribution

  if (score >= 3.5) return "excellent";
  if (score >= 2.5) return "good";
  if (score >= 1.5) return "fair";
  return "poor";
}
