import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { gameplayReducer, GAME_PHASES, initialGameState } from './engine/gameplayReducer.js';
import { LEVELS } from './data/levels.js';
import { sound } from './audio/SoundEngine.js';
import Starfield from './components/Starfield.jsx';
import SoundToggle from './components/SoundToggle.jsx';
import SquadSelect from './components/SquadSelect.jsx';
import SpacecraftBuilder from './components/SpacecraftBuilder.jsx';
import MissionScreen from './components/MissionScreen.jsx';
import MissionReport from './components/MissionReport.jsx';

function StartScreen({ onStart }) {
  return <main className="start-shell fade-in">
    <div className="start-orbit orbit-a" /><div className="start-orbit orbit-b" />
    <div className="start-copy"><div className="eyebrow"><span className="eyebrow-line" /> A DEEP SPACE RESCUE SIMULATOR <span className="eyebrow-line" /></div>
      <div className="title-mark"><span className="title-mark-star">✦</span><span>INDEPENDENT SPACE COMMAND</span></div>
      <h1>COSMIC<br /><em>RESCUE</em></h1>
      <p className="start-subtitle">THE LITTLE SPACE WAR</p>
      <p className="start-description">Vortex has taken your friend Miko beyond Saturn. Build the ship, assemble your crew, and bring them home. Every decision has a cost.</p>
      <button className="button button-primary start-button" onClick={() => { sound.click(); sound.startAmbient(); onStart(); }}>BEGIN RESCUE OPERATION <span>→</span></button>
      <div className="start-meta"><span><i /> SIX MISSION ZONES</span><span>1–4 LOCAL CREW</span><span>ENGINEERING / STRATEGY</span></div>
    </div>
    <div className="start-planet-system" aria-hidden="true"><div className="hero-planet"><div className="planet-crater crater-one" /><div className="planet-crater crater-two" /><div className="planet-crater crater-three" /></div><div className="planet-glow" /><div className="moon-orbit"><span className="moon-dot" /></div><div className="hero-satellite">◇</div><div className="hero-route" /></div>
    <div className="start-bottom"><span>CALLSIGN: LITTLE WAR / 07</span><span>DATA & IMAGERY COURTESY OF NASA</span><span>EDITION 1.0.0</span></div>
    <div className="start-story-card"><span className="micro-label">DISTRESS TRANSMISSION / 00:04:18 AGO</span><b>“...Vortex has the station. I can still see Saturn. Please—”</b><small>UNKNOWN SOURCE · BEACON LOCK ACQUIRED</small></div>
  </main>;
}

function LaunchSequence({ onComplete }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count === 0) {
      sound.launch();
      const timer = setTimeout(onComplete, 600);
      return () => clearTimeout(timer);
    }
    sound.click();
    const timer = setTimeout(() => setCount((current) => current - 1), 850);
    return () => clearTimeout(timer);
  }, [count, onComplete]);
  return <main className="interstitial-screen"><div className="launch-rings"><span /><span /><span /></div><div className="launch-panel"><p className="micro-label">FLIGHT CONTROL / SEQUENCE ARMED</p><strong>{count || 'LIFTOFF'}</strong><h1>{count ? 'Ignition in progress' : 'We have liftoff.'}</h1><p>Propulsion nominal · Guidance locked · Rescue beacon online</p><div className="launch-progress"><i style={{ width: `${((3 - count) / 3) * 100}%` }} /></div><small>ALL SYSTEMS GO</small></div></main>;
}

function TravelScreen({ state }) {
  const next = LEVELS[state.levelIndex];
  return <main className="interstitial-screen travel-screen"><div className="travel-window"><div className="travel-star travel-star-one" /><div className="travel-star travel-star-two" /><div className="travel-planet" /><div className="travel-ship"><span /></div><div className="travel-trail" /></div><div className="travel-copy"><p className="micro-label">DEEP SPACE TRANSIT / NAVIGATION LOCKED</p><h1>En route to <em>{next.name}.</em></h1><p>Autopilot is plotting the next waypoint. Telemetry remains within operating parameters.</p><div className="travel-status"><span>ROUTE PROGRESS</span><b>{String(state.levelIndex + 1).padStart(2, '0')} / 06</b></div></div></main>;
}

function AppHeader({ phase }) {
  return <header className="app-header"><a href="#top" className="brand-lockup" aria-label="Cosmic Rescue home"><span className="brand-symbol">CR</span><span>COSMIC <b>RESCUE</b><small>MISSION CONTROL</small></span></a><div className="header-center"><span className="header-live"><i /> SYSTEMS ONLINE</span><span className="header-phase">{phase.replaceAll('_', ' ')}</span></div><SoundToggle /></header>;
}

class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('Cosmic Rescue UI error:', error); }
  render() {
    if (this.state.hasError) return <div className="error-boundary"><h1>Signal interrupted.</h1><p>A display module failed. Restart the mission interface to recover.</p><button className="button button-primary" onClick={() => window.location.reload()}>RELOAD INTERFACE</button></div>;
    return this.props.children;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(gameplayReducer, initialGameState);
  const [toast, setToast] = useState(null);
  const onDesignChange = useCallback((design) => dispatch({ type: 'SET_DESIGN', design }), []);
  const onLaunchComplete = useCallback(() => dispatch({ type: 'FINISH_LAUNCH' }), []);
  const onChoose = useCallback((choiceId) => dispatch({ type: 'CHOOSE_OPTION', choiceId }), []);
  const onMiniGameResult = useCallback((success) => dispatch({ type: 'MINIGAME_RESULT', success }), []);

  useEffect(() => {
    if (state.phase !== GAME_PHASES.TRAVELING) return undefined;
    const timer = setTimeout(() => dispatch({ type: 'TRAVEL_ARRIVED' }), 2350);
    return () => clearTimeout(timer);
  }, [state.phase, state.levelIndex]);

  useEffect(() => {
    const latest = state.alerts[state.alerts.length - 1];
    if (!latest) return undefined;
    setToast(latest);
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [state.alerts]);

  const phase = state.phase;
  const level = LEVELS[state.levelIndex];
  return <AppErrorBoundary><div className="app-root" id="top"><Starfield /><div className="scanline-overlay" /><div className="ambient-glow glow-one" /><div className="ambient-glow glow-two" />
    {phase !== GAME_PHASES.START && phase !== GAME_PHASES.LAUNCHING && phase !== GAME_PHASES.TRAVELING && <AppHeader phase={phase} />}
    {phase === GAME_PHASES.START && <StartScreen onStart={() => dispatch({ type: 'GO_TO_SQUAD' })} />}
    {phase === GAME_PHASES.SQUAD && <SquadSelect onStart={(squad) => dispatch({ type: 'SET_SQUAD', squad })} />}
    {phase === GAME_PHASES.BUILDER && <SpacecraftBuilder onLaunch={() => dispatch({ type: 'START_LAUNCH' })} onDesignChange={onDesignChange} />}
    {phase === GAME_PHASES.LAUNCHING && <LaunchSequence onComplete={onLaunchComplete} />}
    {phase === GAME_PHASES.TRAVELING && <TravelScreen state={state} />}
    {phase === GAME_PHASES.EVENT && <MissionScreen state={state} level={level} onChoose={onChoose} onMiniGameResult={onMiniGameResult} />}
    {phase === GAME_PHASES.REPORT && <MissionReport state={state} onRestart={() => { setToast(null); dispatch({ type: 'RESTART' }); }} />}
    {toast && phase !== GAME_PHASES.START && <div className={`global-toast ${toast.type}`} role="status"><i />{toast.text}</div>}
    <footer className="global-footer"><span>COSMIC RESCUE / ORIGINAL EDUCATIONAL GAME</span><span>NOT AFFILIATED WITH OR ENDORSED BY NASA</span></footer>
  </div></AppErrorBoundary>;
}
