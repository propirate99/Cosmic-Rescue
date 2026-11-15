import { useEffect, useMemo, useState } from 'react';
import { BUDGET, COMPONENTS, DEFAULT_DESIGN, evaluateDesign } from '../data/components.js';
import { sound } from '../audio/SoundEngine.js';

function PartSelect({ title, category, value, onChange }) {
  return <label className="field-block"><span className="field-title">{title}</span><select value={value} onChange={(event) => { sound.select(); onChange(event.target.value); }}>
    {COMPONENTS[category].map((part) => <option key={part.id} value={part.id}>{part.name} · ${part.cost}</option>)}
  </select><span className="field-hint">{COMPONENTS[category].find((part) => part.id === value)?.description}</span></label>;
}

export default function SpacecraftBuilder({ onLaunch, onDesignChange }) {
  const [design, setDesign] = useState(DEFAULT_DESIGN);
  const metrics = useMemo(() => evaluateDesign(design), [design]);
  useEffect(() => onDesignChange(design), [design, onDesignChange]);
  const update = (key, value) => setDesign((current) => ({ ...current, [key]: value }));
  const toggleInstrument = (id) => setDesign((current) => ({ ...current, instruments: current.instruments.includes(id) ? current.instruments.filter((item) => item !== id) : [...current.instruments, id] }));
  const pct = (value, max) => `${Math.min(100, (value / max) * 100)}%`;
  return <main className="screen-shell builder-shell fade-in">
    <div className="eyebrow"><span className="eyebrow-line" /> PHASE 02 / SYSTEMS ENGINEERING <span className="eyebrow-line" /></div>
    <div className="section-heading"><div><p className="micro-label">SPACECRAFT CONFIGURATION</p><h1>Build for the <em>unknown.</em></h1><p className="muted">Every component is a trade-off. Keep the ship light, powered, connected and capable.</p></div><div className="budget-chip"><span>MISSION BUDGET</span><strong>${BUDGET.toLocaleString()}</strong><small>USD / ALLOCATION</small></div></div>
    <div className="builder-layout">
      <section className="builder-controls panel-surface">
        <div className="panel-heading"><span className="number-tag">01</span><div><h2>Primary systems</h2><p>Choose one component per subsystem.</p></div></div>
        <div className="select-grid">
          <PartSelect title="01 / HULL" category="hull" value={design.hull} onChange={(v) => update('hull', v)} />
          <PartSelect title="02 / PROPULSION" category="propulsion" value={design.propulsion} onChange={(v) => update('propulsion', v)} />
          <PartSelect title="03 / POWER" category="power" value={design.power} onChange={(v) => update('power', v)} />
          <PartSelect title="04 / ANTENNA" category="antenna" value={design.antenna} onChange={(v) => update('antenna', v)} />
          <PartSelect title="05 / LAUNCH VEHICLE" category="launch" value={design.launch} onChange={(v) => update('launch', v)} />
        </div>
        <div className="subsection-heading"><div><span className="number-tag">06</span><div><h2>Scientific payload</h2><p>Install one or more instruments.</p></div></div><span className="counter-pill">{design.instruments.length} INSTALLED</span></div>
        <div className="instrument-grid">
          {COMPONENTS.instruments.map((instrument) => <button key={instrument.id} type="button" className={`instrument-card ${design.instruments.includes(instrument.id) ? 'selected' : ''}`} onClick={() => { sound.click(); toggleInstrument(instrument.id); }} aria-pressed={design.instruments.includes(instrument.id)}>
            <span className="instrument-check">{design.instruments.includes(instrument.id) ? '✓' : '+'}</span><b>{instrument.name}</b><small>{instrument.description}</small><span className="instrument-stats">{instrument.mass} t · ${instrument.cost} · {instrument.power} PWR</span>
          </button>)}
        </div>
      </section>
      <aside className="builder-aside">
        <div className="panel-surface readout-panel">
          <div className="panel-heading compact"><span className="live-dot" /><div><h2>Live telemetry</h2><p>DESIGN VALIDATION / REAL TIME</p></div></div>
          <div className="readout-grid">
            <div className="readout"><span>DRY MASS</span><strong>{metrics.mass}<small> t</small></strong><div className="mini-track"><i style={{ width: pct(metrics.mass, metrics.parts.launch.capacity) }} /></div><small>{metrics.parts.launch.capacity} t max</small></div>
            <div className="readout"><span>PROJECT COST</span><strong>${metrics.cost.toLocaleString()}</strong><div className="mini-track amber"><i style={{ width: pct(metrics.cost, BUDGET) }} /></div><small>${BUDGET.toLocaleString()} budget</small></div>
            <div className="readout"><span>POWER DRAW</span><strong>{metrics.powerDemand}<small> / {metrics.powerOutput}</small></strong><div className="mini-track green"><i style={{ width: pct(metrics.powerDemand, metrics.powerOutput) }} /></div><small>Demand / output</small></div>
            <div className="readout"><span>DATA LOAD</span><strong>{metrics.dataLoad}<small> / {metrics.storage}</small></strong><div className="mini-track violet"><i style={{ width: pct(metrics.dataLoad, metrics.storage) }} /></div><small>GB / buffer</small></div>
          </div>
          <div className="metric-divider" />
          <div className="capability-row"><span>RESCUE CAPABILITY</span><b>{metrics.rescue} <small>PTS</small></b></div>
          <div className="capability-row"><span>SCIENCE POTENTIAL</span><b>{metrics.science} <small>PTS</small></b></div>
          <div className="capability-row"><span>HULL ARMOR</span><b>{metrics.armor} <small>/ 100</small></b></div>
          <div className="capability-row"><span>DESIGN EFFICIENCY</span><b>{metrics.efficiency}<small> / 100</small></b></div>
          <div className="capability-row forecast-row"><span>PROJECTED SCORE</span><b>{metrics.projectedScore}<small> PTS</small></b></div>
          <div className="destination-note"><span>MISSION DESTINATION</span><b>ALIEN BASE / BEYOND SATURN</b><small>6 WAYPOINTS · RESCUE OBJECTIVE: MIKO</small></div>
        </div>
        <div className="panel-surface validation-panel">
          <div className="panel-heading compact"><div><h2>Launch checklist</h2><p>{metrics.checks.filter((check) => check.ok).length} OF 6 SYSTEMS GREEN</p></div><span className={`status-pill ${metrics.valid ? 'status-good' : 'status-warn'}`}>{metrics.valid ? 'READY' : 'ACTION'}</span></div>
          <div className="check-list">{metrics.checks.map((check) => <div className={`check-row ${check.ok ? 'ok' : 'bad'}`} key={check.label}><span className="check-icon">{check.ok ? '✓' : '!'}</span><span>{check.label}</span><small>{check.detail}</small></div>)}</div>
          {!metrics.valid && <p className="validation-note">Resolve every red item before launch authorization.</p>}
          <button className="button button-primary launch-button" disabled={!metrics.valid} onClick={() => { sound.launch(); onLaunch(); }}>AUTHORIZE LAUNCH <span>↗</span></button>
        </div>
      </aside>
    </div>
  </main>;
}
