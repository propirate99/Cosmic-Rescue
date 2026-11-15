import MissionHUD from './MissionHUD.jsx';
import NasaMissionIntel from './NasaMissionIntel.jsx';
import SolarMap from './SolarMap.jsx';
import AsteroidDodger from './AsteroidDodger.jsx';
import { sound } from '../audio/SoundEngine.js';

export default function MissionScreen({ state, level, onChoose, onMiniGameResult }) {
  return <main className="screen-shell mission-shell fade-in">
    <MissionHUD state={state} />
    <SolarMap levelIndex={state.levelIndex} />
    <div className="mission-title-block"><div><p className="micro-label">{level.kicker}</p><h1>{level.name}<em>.</em></h1></div><div className="mission-number"><strong>{String(state.levelIndex + 1).padStart(2, '0')}</strong><span>OF 06<br />WAYPOINTS</span></div></div>
    <div className="mission-layout">
      <section className="mission-main">
        <div className="story-panel panel-surface"><div className="story-visual"><span className={`story-planet planet-${level.planetId}`}>{level.planetId === 'earthOrbit' ? '◉' : level.planetId === 'moon' ? '◌' : level.planetId === 'mars' ? '●' : level.planetId === 'asteroidBelt' ? '✣' : level.planetId === 'saturn' ? '♄' : '✧'}</span><span className="orbit-ring ring-one" /><span className="orbit-ring ring-two" /><div className="story-ship">◆</div></div>
          <div className="story-copy"><span className="signal-label"><i /> INCOMING FIELD REPORT</span><h2>{level.objective}</h2><p>{level.intro}</p><div className="clue-box"><span>◈ MISSION INTEL</span><p>{level.clue}</p></div></div></div>
        {level.planetId === 'asteroidBelt' && <AsteroidDodger onResult={onMiniGameResult} />}
        <div className="choice-heading"><div><p className="micro-label">TACTICAL DECISION</p><h2>Choose your <em>approach.</em></h2></div><span className="counter-pill">SELECT ONE ACTION</span></div>
        <div className="choice-grid">{level.choices.map((choice, index) => <button className="choice-card" key={choice.id} onClick={() => { sound.select(); onChoose(choice.id); }}>
          <div className="choice-top"><span className="choice-index">0{index + 1}</span><span className="choice-tag">{choice.tag}</span></div><h3>{choice.title}</h3><p>{choice.body}</p><div className="effect-list">{Object.entries(choice.effects).map(([key, value]) => { const beneficial = key === 'risk' || key === 'time' ? value < 0 : value > 0; const costly = key === 'risk' || key === 'time' ? value > 0 : value < 0; return <span key={key} className={beneficial ? 'effect-good' : costly ? 'effect-cost' : ''}>{key.toUpperCase()} {value > 0 ? '+' : ''}{value}</span>; })}</div><div className="choose-link">COMMIT TO ACTION <span>→</span></div>
        </button>)}</div>
      </section>
      <aside className="mission-aside"><NasaMissionIntel level={level} /><div className="squad-brief panel-surface"><p className="micro-label">ACTIVE CREW</p><div className="crew-brief-list">{state.squad.map((role) => <span key={role}>{role === 'commander' ? '✦' : role === 'engineer' ? '⌘' : role === 'scientist' ? '⌬' : '⌁'} {role.toUpperCase()}</span>)}</div><small>Shared command channel · Local co-op</small></div></aside>
    </div>
  </main>;
}
