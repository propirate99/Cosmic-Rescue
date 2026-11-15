import { NASA_ENDPOINTS, withApiKey } from './nasaConfig.js';
const cache = new Map();
const TTL = 30 * 60 * 1000;

async function fetchJson(url, key, signal) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < TTL) return cached.value;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true });
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`NASA request failed (${response.status})`);
    const value = await response.json();
    cache.set(key, { value, time: Date.now() });
    return value;
  } finally { clearTimeout(timeout); }
}

export async function getMissionImages(query, limit = 4, signal) {
  const url = `${NASA_ENDPOINTS.images}?q=${encodeURIComponent(query)}&media_type=image&page=1`;
  const data = await fetchJson(url, `images:${query}`, signal);
  return (data.collection?.items || []).slice(0, limit).map((item) => {
    const meta = item.data?.[0] || {};
    return { nasaId: meta.nasa_id || meta.title, title: meta.title || 'NASA image', description: meta.description || '', dateCreated: meta.date_created || '', center: meta.center || 'NASA', image: item.links?.find((link) => link.rel === 'preview')?.href || null, nasaLink: meta.nasa_id ? `https://images.nasa.gov/details/${meta.nasa_id}` : 'https://images.nasa.gov/' };
  }).filter((item) => item.image);
}

export async function getAstronomyPictureOfTheDay(_date, signal) {
  // NASA's newer APOD Basic feed uses a WordPress JSON endpoint and returns a list.
  // The legacy api.nasa.gov/planetary/apod route is scheduled to be retired.
  const url = `${NASA_ENDPOINTS.apod}?per_page=1`;
  const payload = await fetchJson(url, 'apod:latest', signal);
  const data = Array.isArray(payload) ? payload[0] : payload;
  if (!data) throw new Error('NASA APOD feed returned no items');
  return {
    title: data.title,
    explanation: data.explanation,
    image: data.media_type === 'image' ? (data.hdurl || null) : null,
    mediaType: data.media_type,
    date: data.date,
    copyright: data.copyright || 'NASA',
    nasaLink: data.permalink || data.url || 'https://science.nasa.gov/solar-system/'
  };
}

export async function getNearEarthObjects(startDate, endDate, signal) {
  const url = withApiKey(`${NASA_ENDPOINTS.neo}?start_date=${startDate}&end_date=${endDate}`);
  const data = await fetchJson(url, `neo:${startDate}:${endDate}`, signal);
  return Object.values(data.near_earth_objects || {}).flat().slice(0, 8).map((object) => ({ id: object.id, name: object.name, diameterMeters: object.estimated_diameter?.meters?.estimated_diameter_max ?? null, closeApproachDate: object.close_approach_data?.[0]?.close_approach_date || null, potentiallyHazardous: object.is_potentially_hazardous_asteroid, nasaLink: object.nasa_jpl_url }));
}

export async function getMarsRoverPhotos(sol = 1000, limit = 4, signal) {
  // NASA has archived the legacy Mars Rover Photos API. Use NASA's active
  // Image and Video Library search endpoint for Mars rover mission imagery.
  const found = await getMissionImages(`Mars Curiosity rover surface sol ${sol}`, limit, signal);
  return found.map((item) => ({
    id: item.nasaId,
    rover: 'Mars rover mission',
    camera: item.center || 'NASA Image and Video Library',
    earthDate: item.dateCreated ? item.dateCreated.slice(0, 10) : '',
    image: item.image,
    nasaLink: item.nasaLink
  }));
}

export async function getEarthObservations(limit = 4, signal) {
  const url = withApiKey(NASA_ENDPOINTS.epic);
  const data = await fetchJson(url, 'epic:latest', signal);
  return (Array.isArray(data) ? data : []).slice(0, limit).map((item) => ({ identifier: item.identifier, date: item.date, caption: item.caption, image: `https://epic.gsfc.nasa.gov/archive/natural/${item.date.replaceAll('-', '/').slice(0, 10)}/png/${item.image}.png`, nasaLink: 'https://epic.gsfc.nasa.gov/' }));
}
