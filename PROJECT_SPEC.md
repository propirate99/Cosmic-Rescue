# Cosmic Rescue: The Little Space War — Project Specification

**Product type:** Responsive browser game / educational mission simulator  
**Stack:** React 18, Vite 5, JavaScript, CSS, Canvas 2D, Web Audio API  
**Runtime model:** Client-side only; no server, login, database, or online multiplayer required

## 1. Product concept

Vortex has taken the player's friend Miko beyond Saturn. The player leads a local rescue crew, engineers a spacecraft, and makes six mission decisions on the way to the alien base. The game teaches that mission design is a systems-engineering problem: improvements in rescue capability, science, propulsion, power, communications, or armor have a cost in mass, money, data, time, or risk.

The visual identity is an original dark sci-fi command interface. Characters, story framing, UI, and browser-generated sounds are original. The game does not reuse third-party game characters, music, brand assets, or copied interfaces.

## 2. Player journey

`START → SQUAD → BUILDER → LAUNCHING → TRAVELING → EVENT → TRAVELING → … → REPORT`

1. **Start:** Introduces the distress signal, rescue objective, and mission tone.
2. **Squad:** Select one to four local crew roles: Commander, Engineer, Scientist, and Communications Officer.
3. **Builder:** Configure the spacecraft and clear every launch constraint.
4. **Launch:** A short countdown completes before deep-space transit.
5. **Travel:** An animated transit sequence moves the crew to the next waypoint.
6. **Event:** Read the field report and NASA Mission Intel, then choose one of three actions.
7. **Report:** Show success or failure, score, rank, final resource values, scoring breakdown, and the decision log. Restart returns to the start screen.

## 3. Crew roles

| Role | Responsibility | Crew contribution |
|---|---|---|
| Commander | Mission priorities and final calls | Strategic decision role |
| Engineer | Hull, propulsion, repairs, mass | Damage-control perspective |
| Scientist | Instruments and discoveries | Science interpretation |
| Communications Officer | Signal, data, and navigation links | Communications perspective |

Squad size contributes to the capped collaboration bonus in the final score. All crew play on the same device; no network multiplayer is implemented.

## 4. Spacecraft design

The builder has six configuration groups:

- Hull: Scout, Explorer, Fortress
- Propulsion: Chemical Thruster, Ion Drive, Plasma Drive
- Power: Compact Solar Array, Extended Solar Array, Radioisotope Power Unit
- Antenna: Shortwave, Relay, Deep-Space Array
- Instruments: Friend Beacon Tracker, Navigation Camera, Alien Energy Spectrometer, Radiation Shield Scanner, Sample Drill
- Launch vehicle: Light Lifter, Heavy Lifter, Star Lifter

The campaign destination is the Alien Base beyond Saturn, approached through six ordered waypoints. The default spacecraft is a balanced starter design, not a mandatory solution.

### Launch constraints

Launch is enabled only when all six checks pass:

1. Total component mass is no greater than the selected launch vehicle's payload capacity.
2. Total electrical demand is no greater than the selected power system's output.
3. Total component cost is no greater than the $1,900 mission budget.
4. Instrument data generation is no greater than antenna data storage.
5. Both propulsion and launch vehicle have a range rating of at least 6 for the full campaign.
6. At least one science/rescue instrument is installed.

The live builder readout displays dry mass, project cost, power demand/output, data/storage, rescue capability, science potential, hull armor, design efficiency, and projected score.

## 5. Campaign levels

| # | Waypoint | Mission focus | Example decision themes |
|---:|---|---|---|
| 1 | Earth Orbit | Departure window | Lunar gravity assist, direct burn, orbital-debris navigation |
| 2 | Moon | Thermal and communications management | Shielding, relay hop, low-power coast |
| 3 | Mars | Dust and data | Dust bypass, sensor burst, low-power mode |
| 4 | Asteroid Belt | Debris navigation | Shielded crossing, micro-corrections, debris mapping |
| 5 | Saturn | Outer-planet operations | Ring-plane avoidance, power reserve, ring scan |
| 6 | Alien Base | Final rescue | Rescue-beacon synchronization, decoy burst, direct shield breach |

Every level has an objective, narrative intro, NASA-informed clue, three tactical options, effects on mission resources, immediate feedback, source links, and a mission-intel panel.

The Asteroid Belt waypoint additionally offers an optional canvas evasion drill. Surviving the drill reduces risk on the selected crossing; taking multiple impacts adds risk and armor damage.

## 6. Mission state and resources

The single source of truth is the `useReducer` state in `src/engine/gameplayReducer.js`.

| Resource | Meaning | Failure/limit behavior |
|---|---|---|
| Fuel | Propellant remaining | At zero: mission failure |
| Power | Electrical reserve | At zero: mission failure |
| Data | Generated science/telemetry data | Exceeding storage adds mission risk; data is capped at storage |
| Time | Mission-time units used | Reduces the efficiency part of the score |
| Risk | Accumulated operational risk | At 100: mission failure |
| Science | Science value gathered | Increases final score |
| Rescue | Beacon/crew recovery capability | Final extraction requires at least 20 |
| Armor | Hull integrity | At zero: mission failure |

Event effects are applied centrally and clamped to sensible ranges. The mission log records the selected action, narrative result, and resource effects.

## 7. Scoring

A successful rescue uses the supplied mission score model:

`final score = rescue × 2 + science + armor × 12 + efficiency + collaboration bonus`

`efficiency = max(0, 100 − time × 4 − risk × 0.5)`

The collaboration bonus is capped at 30 points and adds 10 points per additional squad member beyond the first. Rank thresholds are Cadet (0), Pilot (180), Mission Specialist (280), Commander (380), and Cosmic Legend (480).

A failed rescue receives a zero mission-completion score and still displays the telemetry and black-box decision log.

## 8. Interface and interaction

- Animated starfield background and original title screen
- Crew selection cards and interactive engineering form
- Mission HUD with fuel, power, data buffer, armor, and risk bars
- Six-waypoint route tracker
- Animated travel/launch transitions
- Three interactive tactical choice cards per waypoint
- NASA Mission Intel cards with live/fallback status
- Optional asteroid-evasion canvas mini-game with keyboard and on-screen controls
- Browser-generated sound effects, ambient hum, and mute control
- Animated rescue report and restart control
- Responsive mobile layout, visible focus styles, and reduced-motion support

## 9. NASA data integration

NASA data is optional enrichment and never blocks gameplay. The current implementation uses:

| Game data need | Source | Implementation |
|---|---|---|
| Mission imagery | [NASA Image and Video Library API](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf) | Search by current planetary region; display NASA image previews and source links |
| Astronomy Picture of the Day | [NASA APOD Basic feed](https://science.nasa.gov/wp-json/wp/v2/apod-basic) | Loads the latest item on the final mission briefing |
| Near-Earth-object context | [NASA NeoWs](https://api.nasa.gov/) | Fetches a bounded seven-day window for the asteroid waypoint |
| Earth observations | [NASA EPIC](https://api.nasa.gov/) | Loads recent EPIC image metadata for the Earth Orbit briefing |
| Mars rover mission imagery | NASA Image and Video Library search | Searches Curiosity/Mars rover mission media; does not call the archived legacy Mars Rover Photos API |

Live results are cached in memory for 30 minutes. Failed requests, empty results, or unavailable network access fall back to authored mission context and original CSS visuals. NASA imagery is credited with NASA source links and an explicit non-affiliation statement.

**Current API maintenance note:** NASA now points APOD users to its APOD Basic WordPress feed; the legacy APOD API is scheduled for retirement on December 1, 2026. NASA also marks the Mars Rover Photos API as archived. These two changes are reflected in the implementation rather than copied unchanged from the earlier prompt package. See the [NASA Open APIs portal](https://api.nasa.gov/).

## 10. Architecture

```text
src/
├── App.jsx
├── main.jsx
├── audio/
│   └── SoundEngine.js
├── components/
│   ├── AsteroidDodger.jsx
│   ├── MissionHUD.jsx
│   ├── MissionReport.jsx
│   ├── MissionScreen.jsx
│   ├── NasaMissionIntel.jsx
│   ├── SolarMap.jsx
│   ├── SoundToggle.jsx
│   ├── SpacecraftBuilder.jsx
│   ├── SquadSelect.jsx
│   ├── Starfield.jsx
│   └── VictoryParticles.jsx
├── data/
│   ├── components.js
│   ├── levels.js
│   ├── nasaConfig.js
│   ├── nasaFallback.js
│   ├── nasaService.js
│   └── planetaryData.js
├── engine/
│   ├── gameplayReducer.js
│   └── scoring.js
└── styles/
    └── global.css

tests/
└── engine.test.js
```

There is one reducer, one level definition source, and one component catalogue. No duplicate gameplay hooks or competing phase systems are used.

## 11. Environment and deployment

The project uses `VITE_NASA_API_KEY` for NASA endpoints that require a key. `.env.example` is provided, and `.env` is ignored by Git. Vite variables prefixed with `VITE_` are bundled into the browser, so they are public client configuration—not secrets.

Local commands:

```bash
npm install
npm test
npm run dev
npm run build
npm run preview
```

Deployment settings:

- Vercel: build command `npm run build`, output directory `dist`
- Netlify: build command `npm run build`, publish directory `dist`

Both SPA rewrite configurations are included.

## 12. Acceptance checks

- `npm test` passes all four engine smoke tests.
- Default spacecraft passes all six builder checks.
- Invalid builds cannot enter the launch phase.
- The complete six-waypoint happy path reaches a successful rescue report.
- Fuel depletion triggers a failure report.
- NASA feed failure does not block the campaign.
- Restart returns the state machine to the start screen.
- Build is expected to pass with `npm run build` after dependencies are installed.
