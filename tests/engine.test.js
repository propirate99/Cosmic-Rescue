import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_DESIGN, evaluateDesign } from '../src/data/components.js';
import { LEVELS } from '../src/data/levels.js';
import { GAME_PHASES, gameplayReducer, initialGameState } from '../src/engine/gameplayReducer.js';

test('default spacecraft passes all launch constraints', () => {
  const metrics = evaluateDesign(DEFAULT_DESIGN);
  assert.equal(metrics.valid, true);
  assert.equal(metrics.checks.length, 6);
  assert.equal(metrics.mass, 77);
  assert.ok(metrics.cost <= 1900);
});

test('invalid spacecraft cannot start a launch sequence', () => {
  const invalidDesign = { ...DEFAULT_DESIGN, propulsion: 'chemical', launch: 'light', instruments: [] };
  assert.equal(evaluateDesign(invalidDesign).valid, false);
  const state = { ...initialGameState, design: invalidDesign };
  const next = gameplayReducer(state, { type: 'START_LAUNCH' });
  assert.equal(next.phase, GAME_PHASES.START);
});

test('complete six-waypoint campaign produces a rescue report', () => {
  let state = gameplayReducer(initialGameState, { type: 'GO_TO_SQUAD' });
  state = gameplayReducer(state, { type: 'SET_SQUAD', squad: ['commander', 'engineer', 'scientist', 'comms'] });
  state = gameplayReducer(state, { type: 'SET_DESIGN', design: DEFAULT_DESIGN });
  state = gameplayReducer(state, { type: 'START_LAUNCH' });
  state = gameplayReducer(state, { type: 'FINISH_LAUNCH' });
  state = gameplayReducer(state, { type: 'TRAVEL_ARRIVED' });
  for (let index = 0; index < LEVELS.length; index += 1) {
    state = gameplayReducer(state, { type: 'CHOOSE_OPTION', choiceId: LEVELS[index].choices[0].id });
    if (index < LEVELS.length - 1) {
      assert.equal(state.phase, GAME_PHASES.TRAVELING);
      state = gameplayReducer(state, { type: 'TRAVEL_ARRIVED' });
    }
  }
  assert.equal(state.phase, GAME_PHASES.REPORT);
  assert.equal(state.rescued, true);
  assert.ok(state.finalScore > 0);
  assert.equal(state.log.length, 7);
});

test('fuel depletion produces a mission-failure report', () => {
  let state = { ...initialGameState, design: DEFAULT_DESIGN };
  state = gameplayReducer(state, { type: 'START_LAUNCH' });
  state = gameplayReducer(state, { type: 'FINISH_LAUNCH' });
  state = gameplayReducer(state, { type: 'TRAVEL_ARRIVED' });
  state = { ...state, resources: { ...state.resources, fuel: 1 } };
  state = gameplayReducer(state, { type: 'CHOOSE_OPTION', choiceId: LEVELS[0].choices[1].id });
  assert.equal(state.phase, GAME_PHASES.REPORT);
  assert.equal(state.rescued, false);
  assert.match(state.failureReason, /Propellant depleted/);
});
