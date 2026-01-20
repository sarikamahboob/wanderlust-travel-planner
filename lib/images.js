import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

const DEFAULT_IMAGES = {
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2679&auto=format&fit=crop',
  tokyo: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2670&auto=format&fit=crop',
  default:
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2735&auto=format&fit=crop',
};

export async function fetchDestinationImage(destination) {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn('UNSPLASH_ACCESS_KEY is not set. Using default image.');
      return getDefaultImage(destination);
    }

    const searchQuery = destination.trim();
    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query: searchQuery,
        per_page: 1,
        orientation: 'landscape',
        client_id: UNSPLASH_ACCESS_KEY,
      },
      timeout: 10000,
    });

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const image = response.data.results[0];
      const imageUrl = image.urls?.regular || image.urls?.full || image.urls?.raw;

      if (imageUrl) {
        return imageUrl;
      }
    }

    return getDefaultImage(destination);
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error.message);
    return getDefaultImage(destination);
  }
}

export async function fetchDayImage(destination, dayNumber, activityKeyword = '') {
  try {
    if (!UNSPLASH_ACCESS_KEY) {
      return getDefaultImage(destination);
    }

    const searchQuery = activityKeyword
      ? `${destination} ${activityKeyword}`
      : destination;
    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query: searchQuery,
        per_page: 3,
        orientation: 'landscape',
        client_id: UNSPLASH_ACCESS_KEY,
      },
      timeout: 10000,
    });

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const randomIndex = Math.floor(Math.random() * response.data.results.length);
      const image = response.data.results[randomIndex];
      const imageUrl = image.urls?.regular || image.urls?.full || image.urls?.raw;

      if (imageUrl) {
        return imageUrl;
      }
    }

    return getDefaultImage(destination);
  } catch (error) {
    console.error('Error fetching day image from Unsplash:', error.message);
    return getDefaultImage(destination);
  }
}

function getDefaultImage(destination) {
  const normalizedDestination = destination.toLowerCase().trim();
  
  if (normalizedDestination.includes('paris')) {
    return DEFAULT_IMAGES.paris;
  }
  if (normalizedDestination.includes('tokyo') || normalizedDestination.includes('kyoto')) {
    return DEFAULT_IMAGES.tokyo;
  }
  
  return DEFAULT_IMAGES.default;
}

