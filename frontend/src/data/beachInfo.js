/**
 * Beach UI content and metadata
 * Contains descriptions, images, features, and extended content for beach pages
 * For API configuration (coordinates), see src/config/beaches.js
 */

export const beachInfo = {
  muizenberg: {
    name: "Muizenberg",
    description:
      "Famous for its long sandy beach and consistent surf, Muizenberg is perfect for beginners and a Cape Town surf icon.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: [
      "Beginner Friendly",
      "Consistent Waves",
      "Surf Schools",
      "Shark Spotters",
    ],

    // Extended content - add more as needed
    overview:
      "Muizenberg Beach is one of Cape Town's most iconic surf spots. With its gentle waves, warm water, and vibrant beach culture, it's the perfect destination for both beginners learning to surf and experienced surfers looking for a relaxed session.",

    amenities: {
      parking: "Multiple parking lots available along Beach Road",
      restrooms: "Public facilities near the pavilion",
      showers: "Outdoor showers available",
      foodDrinks: "Numerous cafes and restaurants along the beachfront",
      surfRentals: true,
      lifeguards: true,
      sharkSpotters: true,
    },

    tips: [
      "Best for beginners - waves are gentle and forgiving",
      "Water temperature is warmer than Atlantic-side beaches",
      "Arrive early for parking during summer weekends",
      "Check the Shark Spotter flag before entering the water",
      "Many surf schools offer lessons - book in advance",
    ],

    bestSeasons: {
      summer: "Warm water, consistent small waves, busy with families",
      autumn: "Great conditions, fewer crowds",
      winter: "Bigger swells, colder water, best for experienced surfers",
      spring: "Variable conditions, building swells",
    },

    rules: [
      "Respect the Shark Spotter flags and alerts",
      "Beginners should surf between the flags",
      "Give right of way to surfers already on waves",
      "Keep beach clean - take your trash with you",
    ],

    // Placeholder for future content
    galleries: [
      // { id: 1, url: "...", caption: "...", photographer: "..." }
    ],

    articles: [
      // { id: 1, title: "...", excerpt: "...", url: "..." }
    ],
  },

  bloubergstrand: {
    name: "Bloubergstrand",
    description:
      "Offers spectacular views of Table Mountain and is known for strong winds, making it ideal for kitesurfing and windsurfing.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: [
      "Kitesurfing",
      "Windsurfing",
      "Table Mountain Views",
      "Strong Winds",
    ],

    overview:
      "Bloubergstrand is famous for its postcard-perfect views of Table Mountain across Table Bay. The strong southeaster winds make it a premier destination for kitesurfing and windsurfing.",

    amenities: {
      parking: "Street parking available",
      restrooms: "Limited public facilities",
      showers: "Some available at kite schools",
      foodDrinks: "Restaurants and cafes in town",
      kiteRentals: true,
      lifeguards: false,
    },

    tips: [
      "Best wind conditions in summer (southeaster)",
      "Kitesurfing lessons available from local schools",
      "Popular spot for Table Mountain photography",
      "Water is cold - wetsuit recommended year-round",
    ],

    galleries: [],
    articles: [],
  },

  strand: {
    name: "Strand",
    description:
      "A long stretch of beach in False Bay, popular with families and surfers alike.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: ["Family Friendly", "Long Beach", "Warm Water", "Safe Swimming"],

    overview:
      "Strand Beach offers a long, sandy coastline with relatively warm water thanks to its False Bay location. It's a favorite among families and provides good surf conditions.",

    amenities: {
      parking: "Ample parking available",
      restrooms: "Public facilities available",
      showers: "Outdoor showers",
      foodDrinks: "Beachfront cafes and shops",
      lifeguards: true,
    },

    galleries: [],
    articles: [],
  },

  clifton: {
    name: "Clifton",
    description:
      "Four pristine beaches sheltered from wind, known for clear blue water and white sand. Popular with sunbathers.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: ["Sheltered", "Clear Water", "White Sand", "Sunbathing"],

    overview:
      "Clifton's four beaches are among Cape Town's most beautiful, offering sheltered coves with crystal-clear water and pristine white sand. A magnet for sunbathers and beach lovers.",

    amenities: {
      parking: "Limited street parking",
      restrooms: "Limited facilities",
      showers: "Minimal",
      foodDrinks: "Nearby cafes on Clifton Road",
      lifeguards: true,
    },

    galleries: [],
    articles: [],
  },

  kalkbay: {
    name: "Kalk Bay",
    description:
      "A charming harbor town with a tidal pool and rocky coastline, offering unique surf breaks.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: ["Tidal Pool", "Rocky Breaks", "Harbor Views", "Fishing Village"],

    overview:
      "Kalk Bay is a picturesque fishing village with a unique coastal character. The tidal pool and rocky breaks attract both swimmers and experienced surfers looking for challenging conditions.",

    amenities: {
      parking: "Limited street parking near harbor",
      restrooms: "Public facilities at harbor",
      showers: "At tidal pool",
      foodDrinks: "Excellent restaurants and cafes in village",
      tidalPool: true,
    },

    galleries: [],
    articles: [],
  },

  milnerton: {
    name: "Milnerton",
    description:
      "Wide open beach with consistent waves and stunning sunset views over Table Bay.",
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200",
    features: ["Consistent Waves", "Sunset Views", "Open Beach", "Table Bay"],

    overview:
      "Milnerton Beach is a long, open stretch of coastline offering consistent surf conditions and spectacular sunset views across Table Bay toward Table Mountain.",

    amenities: {
      parking: "Available along beach road",
      restrooms: "Public facilities",
      showers: "Outdoor showers",
      foodDrinks: "Limited beachfront options",
      lifeguards: false,
    },

    galleries: [],
    articles: [],
  },
};

/**
 * Get beach info by name (case-insensitive)
 * @param {string} beachName - Beach identifier
 * @returns {Object|null} Beach info or null if not found
 */
export function getBeachInfo(beachName) {
  const key = beachName?.toLowerCase();
  return beachInfo[key] || null;
}

/**
 * Get all beach names that have info
 * @returns {Array<string>} Array of beach identifiers
 */
export function getBeachInfoNames() {
  return Object.keys(beachInfo);
}
