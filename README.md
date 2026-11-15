# Cosmic Rescue: The Little Space War

An original, browser-based educational space-mission design game. Assemble a crew, engineer a spacecraft, balance mission resources, and guide a rescue operation through six fictionalized campaign waypoints.

## Features

- React 18 + Vite single-page application (JavaScript, no backend or login)
- Local squad selection with four specialist roles
- Interactive spacecraft builder with mass, cost, power, data, range, and payload constraints
- Six decision-driven mission zones: Earth Orbit, Moon, Mars, Asteroid Belt, Saturn, and Alien Base
- Reducer-driven game state, resource consequences, failure states, final score, rank, and decision log
- Animated starfield, launch sequence, transit screen, and mission HUD
- Optional asteroid-evasion canvas mini-game
- Browser-generated sound effects with a mute control
- Optional NASA Image and Video Library, APOD Basic, NeoWs, and EPIC data panels with graceful offline fallback
- Responsive layout and reduced-motion support

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The game is playable without a NASA API key; live Mission Intel may be rate-limited or unavailable when using `DEMO_KEY`.

## NASA data and attribution

The game can request public information from NASA's Image and Video Library API, the current APOD Basic feed, Near Earth Object Web Service (NeoWs), and EPIC API. Mars rover mission imagery is searched through the Image and Video Library because NASA has archived the legacy Mars Rover Photos API. The requests are optional and are not required for gameplay. When a request fails, the app shows locally authored mission context and fallback visuals instead of blocking a mission.

Set `VITE_NASA_API_KEY` in `.env` to a NASA API key from [api.nasa.gov](https://api.nasa.gov/) to use your own rate allocation. Vite exposes variables prefixed with `VITE_` to browser code, so this value is visible to visitors in the built client; do not treat it as a secret or reuse a credential that protects private systems. `.env` is excluded from Git.

Data and imagery are courtesy of NASA and their respective contributors. This original educational game is not affiliated with, endorsed by, or sponsored by NASA. NASA names and marks are not used as project branding.

## Checks

Run the pure mission-engine smoke tests with:

```bash
npm test
```

## Build and preview

```bash
npm run build
npm run preview
```

The production build is written to `dist/`.

## Deploy

### Vercel

Import the Git repository into Vercel. The included `vercel.json` configures `npm run build` and `dist`. Add `VITE_NASA_API_KEY` in the project environment settings if you want live NASA data beyond the demo key's public limits.

### Netlify

Import the Git repository into Netlify. The included `netlify.toml` configures the build command and publish directory. Add `VITE_NASA_API_KEY` in site environment settings if desired.

## Controls

- Use the mouse or touch to choose crew roles, ship components, and mission options.
- During the asteroid-evasion drill, use the up/down or left/right arrow keys to move between lanes. On-screen controls are also provided.
- Sound begins only after a user interaction, as required by browser audio policies.

## Copyright-safe design

All characters, narrative framing, UI styling, gameplay logic, visual treatments, and generated sound effects in this project are original. The game does not use third-party game characters, game music, logos, or copied game interfaces. NASA material is used as an optional source of factual context and appropriately attributed media.

## License

MIT. See [LICENSE](./LICENSE).
