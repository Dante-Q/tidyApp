/**
 * Beach Camera Configuration
 *
 * Configuration for live beach camera streams.
 * Each camera has a name, location, and stream URL for the iframe.
 *
 * Stream URL formats supported:
 * - HLS (.m3u8) streams
 * - Direct video streams
 * - Embedded iframe URLs
 */

export const BEACH_CAMERAS = [
  {
    id: "muizenberg-beachfront",
    name: "Muizenberg Beach",
    beach: "muizenberg",
    location: "Beachfront / Corner Surf Store",
    streamUrl: "https://s5.ipcamlive.com/streams/05fq6mtulni4r5bwj/stream.m3u8",
    status: "live",
    quality: "HD",
    type: "hls", // 'hls', 'iframe', or 'direct'
  },
  {
    id: "muizenberg-WaveWaters",
    name: "Muizenberg WaveWatchers",
    beach: "muizenberg",
    location: "Beachfront / WaveWatchers",
    streamUrl: "https://www.youtube.com/embed/70gObI9oeVU?si=uZ0xDLYmo9Wrp1l7",
    status: "live",
    quality: "HD",
    type: "iframe",
  },
  {
    id: "kalkbay-brassbell",
    name: "Kalk Bay",
    beach: "kalkbay",
    location: "Kalk Bay Reef / Brass Bell",
    streamUrl: "https://www.youtube.com/embed/eXbK6DrZJL4",
    status: "live",
    quality: "HD",
    type: "iframe",
  },
  {
    id: "blouberg",
    name: "Blouberg Cam",
    beach: "blouberg",
    location: "Blouberg / Table Cams",
    streamUrl: "https://www.youtube.com/embed/8Pmo8orbQig?si=IGEnUW1ETqjh17lb",
    status: "live",
    quality: "HD",
    type: "iframe",
  },
  {
    id: "seapoint-vanilla",
    name: "SeaPoint",
    beach: "seapoint",
    location: "SeaPoint / Vanilla",
    streamUrl: "https://www.youtube.com/embed/4Zu64CmAjMo?si=IyhNkv-6WKg_mTNK",
    status: "live",
    quality: "HD",
    type: "iframe",
  },
  {
    id: "boulders-beach",
    name: "Boulders Beach",
    beach: "boulders",
    location: "Boulder Beach / SanParks",
    streamUrl: "https://hibiscus.sanparks.org/video/boulders.mp4?_=1",
    status: "live",
    quality: "HD",
    type: "direct",
  },
];

/**
 * Get all cameras
 */
export const getAllCameras = () => {
  return BEACH_CAMERAS;
};

/**
 * Get cameras for a specific beach
 */
export const getCamerasByBeach = (beachSlug) => {
  return BEACH_CAMERAS.filter((cam) => cam.beach === beachSlug);
};

/**
 * Get a single camera by ID
 */
export const getCameraById = (cameraId) => {
  return BEACH_CAMERAS.find((cam) => cam.id === cameraId);
};

/**
 * Get active/live cameras only
 */
export const getLiveCameras = () => {
  return BEACH_CAMERAS.filter((cam) => cam.status === "live");
};
