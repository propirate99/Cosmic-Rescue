# nasa-cache

This folder is used at runtime to cache NASA Image and Video Library assets fetched via the NASA public API.

Images are loaded dynamically by `src/data/nasaService.js` and fall back to `src/data/nasaFallback.js` when the API is unavailable.

**Do not commit real NASA images here.** This folder is intentionally empty in the repository. Images are fetched at runtime.

NASA imagery is provided courtesy of NASA and its partners under NASA's media usage guidelines.

