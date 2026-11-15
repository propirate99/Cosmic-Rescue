import { DEFAULT_DESIGN, evaluateDesign } from '../data/components.js';
import { LEVELS } from '../data/levels.js';
import { calculateMissionScore } from './scoring.js';

export const GAME_PHASES = {
  START: 'START', SQUAD: 'SQUAD', BUILDER: 'BUILDER', LAUNCHING: 'LAUNCHING',
  TRAVELING: 'TRAVELING', EVENT: 'EVENT', REPORT: 'REPORT'
};

export const initialGameState = {
  phase: GAME_PHASES.START,
  squad: ['commander'],
  levelIndex: 0,
  design: DEFAULT_DESIGN,
  resources: { fuel: 0, power: 0, data: 0, time: 0, risk: 10, science: 0, rescue: 0, armor: 0 },
  alerts: [],
  log: [],
  miniGameBonus: null,
  rescued: false,
  failureReason: null,
  finalScore: 0,
  scoreBreakdown: null
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function failReason(resources) {
  if (resources.fuel <= 0) return 'Propellant depleted before the mission could be completed.';
  if (resources.power <= 0) return 'The spacecraft lost all electrical power.';
  if (resources.armor <= 0) return 'The spacecraft hull was critically damaged.';
  if (resources.risk >= 100) return 'Mission risk exceeded the safe operating threshold.';
  return null;
}

export function gameplayReducer(state, action) {
  switch (action.type) {
    case 'GO_TO_SQUAD':
      return { ...state, phase: GAME_PHASES.SQUAD };
    case 'SET_SQUAD':
      return { ...state, squad: action.squad, phase: GAME_PHASES.BUILDER };
    case 'SET_DESIGN':
      return { ...state, design: action.design };
    case 'START_LAUNCH': {
      if (!state.design || !evaluateDesign(state.design).valid) return state;
      const metrics = evaluateDesign(state.design);
      return {
        ...state,
        phase: GAME_PHASES.LAUNCHING,
        levelIndex: 0,
        resources: {
          fuel: metrics.fuel,
          power: 94,
          data: 0,
          time: 0,
          risk: 10,
          science: 0,
          rescue: Math.min(60, 12 + metrics.rescue),
          armor: metrics.armor
        },
        alerts: [{ id: Date.now(), type: 'success', text: 'Flight plan validated. Launch sequence authorized.' }],
        log: [{ level: 'Mission Control', choice: 'Spacecraft commissioned', result: `${metrics.mass} t • $${metrics.cost.toLocaleString()} • ${metrics.dataLoad} GB payload`, effects: {} }],
        rescued: false,
        failureReason: null,
        finalScore: 0,
        scoreBreakdown: null,
        miniGameBonus: null
      };
    }
    case 'FINISH_LAUNCH':
      return { ...state, phase: GAME_PHASES.TRAVELING };
    case 'TRAVEL_ARRIVED':
      return { ...state, phase: GAME_PHASES.EVENT };
    case 'MINIGAME_RESULT':
      return { ...state, miniGameBonus: action.success ? 'success' : 'miss' };
    case 'CHOOSE_OPTION': {
      if (state.phase !== GAME_PHASES.EVENT) return state;
      const level = LEVELS[state.levelIndex];
      const option = level?.choices.find((item) => item.id === action.choiceId);
      if (!option) return state;
      const effects = { ...option.effects };
      if (state.miniGameBonus && level.id === 'asteroid-belt') {
        effects.risk = (effects.risk || 0) + (state.miniGameBonus === 'success' ? -6 : 3);
        effects.armor = (effects.armor || 0) + (state.miniGameBonus === 'success' ? 2 : -2);
      }
      const designMetrics = evaluateDesign(state.design);
      const capacity = designMetrics.storage;
      const rawData = state.resources.data + (effects.data || 0);
      const overflow = Math.max(0, rawData - capacity);
      const nextResources = {
        fuel: clamp(state.resources.fuel + (effects.fuel || 0), 0, 100),
        power: clamp(state.resources.power + (effects.power || 0), 0, 100),
        data: clamp(rawData, 0, capacity),
        time: Math.max(0, state.resources.time + (effects.time || 0)),
        risk: clamp(state.resources.risk + (effects.risk || 0) + (overflow ? 5 + Math.ceil(overflow / 5) : 0), 0, 100),
        science: Math.max(0, state.resources.science + (effects.science || 0)),
        rescue: clamp(state.resources.rescue + (effects.rescue || 0), 0, 100),
        armor: clamp(state.resources.armor + (effects.armor || 0), 0, 100)
      };
      const record = {
        level: level.name,
        choice: option.title,
        result: option.feedback + (overflow ? ` Data overflow (${overflow} GB) increased mission risk.` : ''),
        effects
      };
      const log = [...state.log, record];
      const failure = failReason(nextResources);
      if (failure) {
        return { ...state, resources: nextResources, log, phase: GAME_PHASES.REPORT, failureReason: failure, rescued: false, finalScore: 0, scoreBreakdown: null, alerts: [{ id: Date.now(), type: 'danger', text: 'MISSION FAILURE' }] };
      }
      if (state.levelIndex === LEVELS.length - 1) {
        const rescued = nextResources.rescue >= 20;
        const scoreBreakdown = calculateMissionScore({
          rescue: nextResources.rescue,
          science: nextResources.science,
          armor: nextResources.armor,
          time: nextResources.time,
          risk: nextResources.risk,
          squadSize: state.squad.length,
          rescued
        });
        return {
          ...state, resources: nextResources, log, phase: GAME_PHASES.REPORT,
          rescued,
          failureReason: rescued ? null : 'The rescue beacon could not be synchronized with Miko’s signal.',
          finalScore: scoreBreakdown.finalScore,
          scoreBreakdown,
          alerts: [{ id: Date.now(), type: rescued ? 'success' : 'danger', text: rescued ? 'RESCUE CONFIRMED' : 'RESCUE SIGNAL LOST' }]
        };
      }
      return {
        ...state,
        resources: nextResources,
        log,
        levelIndex: state.levelIndex + 1,
        phase: GAME_PHASES.TRAVELING,
        miniGameBonus: null,
        alerts: [{ id: Date.now(), type: 'success', text: `${level.name.toUpperCase()} COMPLETE` }]
      };
    }
    case 'RESTART':
      return { ...initialGameState };
    default:
      return state;
  }
}
