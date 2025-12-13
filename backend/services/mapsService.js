/**
 * Google Static Maps Service
 * Generates static map image URLs for event locations
 * 
 * API Documentation: https://developers.google.com/maps/documentation/maps-static
 */

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Default map settings
const DEFAULT_OPTIONS = {
    size: '600x300',      // Image dimensions (width x height)
    zoom: 15,             // Zoom level (1-20, higher = closer)
    maptype: 'roadmap',   // roadmap, satellite, terrain, hybrid
    scale: 2              // 1 or 2 (retina displays)
};

/**
 * Generate a Google Static Maps URL for a location
 * @param {Object} options - Map options
 * @param {string} options.address - Street address or place name
 * @param {Object} options.coordinates - { latitude, longitude }
 * @param {string} options.size - Image size (default: 600x300)
 * @param {number} options.zoom - Zoom level (default: 15)
 * @param {string} options.maptype - Map type (default: roadmap)
 * @returns {string|null} - Static map URL or null if no API key
 */
export const getStaticMapUrl = (options = {}) => {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('⚠️ GOOGLE_MAPS_API_KEY not configured. Static maps disabled.');
        return null;
    }

    const { address, coordinates, size, zoom, maptype } = options;

    // Determine center location (prefer coordinates if available)
    let center;
    if (coordinates?.latitude && coordinates?.longitude) {
        center = `${coordinates.latitude},${coordinates.longitude}`;
    } else if (address) {
        center = encodeURIComponent(address);
    } else {
        console.warn('⚠️ No location provided for static map');
        return null;
    }

    // Build URL params
    const params = new URLSearchParams({
        center: center,
        zoom: zoom || DEFAULT_OPTIONS.zoom,
        size: size || DEFAULT_OPTIONS.size,
        maptype: maptype || DEFAULT_OPTIONS.maptype,
        scale: DEFAULT_OPTIONS.scale,
        markers: `color:red|${center}`,  // Add a red marker at the location
        key: GOOGLE_MAPS_API_KEY
    });

    return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

/**
 * Get a static map URL for an event
 * @param {Object} event - Event document with location and/or coordinates
 * @param {Object} options - Override default map options
 * @returns {string|null} - Static map URL
 */
export const getEventMapUrl = (event, options = {}) => {
    if (!event) return null;

    return getStaticMapUrl({
        address: event.location,
        coordinates: event.coordinates,
        ...options
    });
};

/**
 * Check if the Maps service is configured
 * @returns {boolean}
 */
export const isMapsConfigured = () => {
    return !!GOOGLE_MAPS_API_KEY;
};

export default {
    getStaticMapUrl,
    getEventMapUrl,
    isMapsConfigured
};
