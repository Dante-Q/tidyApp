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
  // Add more cameras here as they become available
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
