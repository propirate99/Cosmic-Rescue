# Consolidation and implementation notes

This project consolidates the three supplied instruction packages into one implementation. The decisions below remove conflicts and make the gameplay flow deterministic.

## Resolved integration points

1. **One state system:** `src/engine/gameplayReducer.js` is the only gameplay state machine. Duplicate `useGameplayLoop` / `useMissionGame` options from the source folder proposal were not retained.
2. **One launch transition:** the launch countdown ends by dispatching `FINISH_LAUNCH`, which moves the reducer to `TRAVELING`. Travel completes after the transit animation and dispatches `TRAVEL_ARRIVED` to enter the current level event.
3. **Consistent planet identifiers:** all six levels use the same keys as `planetaryData.js`: `earthOrbit`, `moon`, `mars`, `asteroidBelt`, `saturn`, and `alienBase`.
4. **Complete spacecraft checks:** cost, mass, power draw, data storage, deep-space drive range, launch-vehicle range, and at least one installed instrument are checked before launch. The default loadout passes all six checks.
5. **Consistent resource model:** mission resource values are stored together in reducer state. Choice effects are applied centrally, bounded to sensible ranges, and data overflow adds mission risk rather than silently discarding the consequence.
6. **Failure and rescue outcomes:** fuel, power, armor, and risk can cause mission failure. The final extraction requires a viable rescue value; the mission report handles both success and failure.
7. **Scoring:** the final score follows the supplied formula: rescue × 2 + science + armor × 12 + efficiency, with efficiency `max(0, 100 − time × 4 − risk × 0.5)`. A capped local-squad collaboration bonus is also included as described in the second source package.
8. **NASA integration is optional:** the source referenced local fallback JPG paths without providing those image assets. This implementation uses original CSS/emoji fallback visuals, so missing `/nasa-cache/*.jpg` files cannot break the UI. NASA API requests are optional, cached in memory, and abortable when a mission screen unmounts. The APOD client uses NASA's current APOD Basic WordPress JSON feed rather than the legacy route; Mars rover imagery is searched through the NASA Image and Video Library rather than the archived Mars Rover Photos API.
9. **API key handling:** `.env` uses `DEMO_KEY` for development convenience. A Vite `VITE_` variable is client-visible in the browser bundle, so it is not a secret. The README documents this limitation.
10. **Original design:** the game uses original CSS, characters/story framing, and Web Audio oscillator effects. It does not reproduce third-party game characters, brand assets, game music, or another product's interface.

## Run validation

- `npm install`
- `npm run build`
- `npm run dev`
- Play from start through all six mission choices, then use the report's restart action.

The optional NASA data panels need network access and may use the API's demo-key quota. The campaign itself does not require internet access.
