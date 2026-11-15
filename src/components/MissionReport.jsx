import { useEffect } from 'react';
import { getRank } from '../engine/scoring.js';
import { sound } from '../audio/SoundEngine.js';
import VictoryParticles from './VictoryParticles.jsx';

const formatEffect = (effects = {}) => Object.entries(effects).map(([key, value]) => `${key} ${value > 0 ? '+' : ''}${value}`).join(' · ');
export default function MissionReport({ state, onRestart }) {
  useEffect(() => { if (state.rescued) sound.rescue(); else sound.error(); }, [state.rescued]);
  const rank = getRank(state.finalScore);
  const resources = state.resources;
  return <main className="screen-shell report-shell fade-in">
    <div className="eyebrow"><span className="eyebrow-line" /> FINAL DEBRIEF / MISSION COMPLETE <span className="eyebrow-line" /></div>
    <section className={`report-hero panel-surface ${state.rescued ? 'report-success' : 'report-failure'}`}>
      <div className="report-status"><span className="status-symbol">{state.rescued ? '✦' : '!'}</span><span>{state.rescued ? 'MISSION SUCCESS' : 'MISSION FAILURE'}</span></div>
      <h1>{state.rescued ? 'Signal recovered.' : 'Signal lost.'}</h1>
      <p>{state.rescued ? 'Miko is safe. Your crew brought the spacecraft home with a complete mission record.' : state.failureReason || 'The rescue mission could not be completed.'}</p>
      {state.rescued && <VictoryParticles />}
      <div className="report-score"><div><span>FINAL SCORE</span><strong>{state.finalScore.toLocaleString()}</strong></div><div><span>CREW RANK</span><strong>{rank.title}</strong></div></div>
    </section>
    <div className="report-grid">
      <section className="panel-surface report-card"><div className="panel-heading compact"><div><p className="micro-label">FLIGHT DATA</p><h2>Final telemetry</h2></div></div><div className="final-metrics">
        {Object.entries({ 'Rescue value': resources.rescue, 'Science value': resources.science, 'Fuel remaining': `${resources.fuel}%`, 'Power remaining': `${resources.power}%`, 'Hull integrity': `${resources.armor}%`, 'Mission risk': `${resources.risk}%`, 'Mission time': `${resources.time} units` }).map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}
      </div></section>
      <section className="panel-surface report-card"><div className="panel-heading compact"><div><p className="micro-label">SCORING MODEL</p><h2>Score breakdown</h2></div></div><div className="score-lines">{Object.entries(state.scoreBreakdown || {}).filter(([key]) => key !== 'finalScore').map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}</span><b>{value}</b></div>)}{!state.rescued && <p className="muted small">A rescue failure receives no mission completion score.</p>}</div></section>
    </div>
    <section className="panel-surface decision-log"><div className="panel-heading compact"><div><p className="micro-label">BLACK BOX RECORDING</p><h2>Decision log</h2></div><span className="counter-pill">{state.log.length} ENTRIES</span></div>
      <div className="log-list">{state.log.map((entry, index) => <article key={`${entry.level}-${index}`} className="log-entry"><span className="log-index">{String(index + 1).padStart(2, '0')}</span><div><small>{entry.level}</small><b>{entry.choice}</b><p>{entry.result}</p>{entry.effects && Object.keys(entry.effects).length > 0 && <span className="log-effects">{formatEffect(entry.effects)}</span>}</div></article>)}</div>
    </section>
    <div className="report-footer"><p className="muted small">Every rescue gadget has an engineering cost. Every choice is part of the mission record.</p><button className="button button-primary" onClick={() => { sound.click(); onRestart(); }}>↻ RESTART MISSION</button></div>
  </main>;
}
