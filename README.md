# Cosmic Rescue: The Little Space War

**Cosmic Rescue: The Little Space War** is an original educational space-mission design game created for the NASA Space Apps Challenge. An alien villain, Vortex, has kidnapped Miko beyond Saturn. Players design a spacecraft, manage limited mission resources, travel through the solar system, solve engineering puzzles, and complete a rescue mission.

## NASA Space Apps Challenge

This project was created for the **Space Mission Design Game** challenge. The game teaches real mission-design trade-offs:

- Spacecraft mass and launch capacity
- Electrical power generation and consumption
- Propellant and trajectory decisions
- Scientific instruments and data generation
- Communications bandwidth and deep-space delay
- Mission budget
- Risk, armor, and mission lifetime
- Scientific value versus rescue capability

Every decision affects multiple mission systems. There is no single perfect spacecraft design.

## NASA resources used

- [NASA Image and Video Library API](https://images-api.nasa.gov/)
- [NASA Open APIs](https://api.nasa.gov/)
- [NASA Planetary Fact Sheets](https://nssdc.gsfc.nasa.gov/planetary/planetfact.html)
- [NASA Science](https://science.nasa.gov/)
- [NASA Open Data Portal](https://data.nasa.gov/)
- [NASA Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/#/home)

NASA's public resources informed the game's educational content, mission imagery, planetary context, and space-exploration themes.

## Gameplay

1. Select a squad role: Commander, Engineer, Scientist, or Communications Officer.
2. Design a spacecraft using hulls, propulsion, power systems, antennas, and instruments.
3. Choose a launch vehicle and destination.
4. Launch the mission.
5. Travel through the solar system.
6. Solve mission events and engineering puzzles.
7. Rescue Miko from Vortex's alien base.
8. Review the mission report and final score.

## Tech stack

- React 18
- Vite
- JavaScript
- CSS
- HTML5 Canvas
- Web Audio API
- NASA public APIs

## Local development

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_NASA_API_KEY=DEMO_KEY
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Set `VITE_NASA_API_KEY` to your NASA API key.
4. Deploy.

### Netlify

1. Push this repository to GitHub.
2. Import it into Netlify.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. Set `VITE_NASA_API_KEY` to your NASA API key.
5. Deploy.

## Copyright and attribution

This project uses original characters, story, artwork, interface design, sound design, and gameplay systems. Planetary information, imagery, and mission references are courtesy of NASA and its partners. This project is not affiliated with, endorsed by, or sponsored by NASA.

Do not use Doraemon, PUBG, Free Fire, NASA Eyes, or any other copyrighted game's names, characters, artwork, audio, logos, or interface assets in this repository.