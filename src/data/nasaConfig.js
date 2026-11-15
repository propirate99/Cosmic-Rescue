export const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
export const NASA_ENDPOINTS = {
  images: 'https://images-api.nasa.gov/search',
  apod: 'https://science.nasa.gov/wp-json/wp/v2/apod-basic',
  neo: 'https://api.nasa.gov/neo/rest/v1/feed',
  epic: 'https://api.nasa.gov/EPIC/api/natural/images'
};
export function withApiKey(url) {
  const parsed = new URL(url);
  parsed.searchParams.set('api_key', NASA_API_KEY);
  return parsed.toString();
}
