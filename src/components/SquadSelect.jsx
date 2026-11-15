import { useState } from 'react';
import { sound } from '../audio/SoundEngine.js';

const ROLES = [
  { id: 'commander', icon: '✦', name: 'Commander', detail: 'Mission priorities & final calls', skill: 'Strategic choices', color: 'violet' },
  { id: 'engineer', icon: '⌘', name: 'Engineer', detail: 'Hull, propulsion & repairs', skill: 'Damage control', color: 'cyan' },
  { id: 'scientist', icon: '⌬', name: 'Scientist', detail: 'Instruments & discoveries', skill: 'Research insight', color: 'green' },
  { id: 'comms', icon: '⌁', name: 'Comms Officer', detail: 'Signal, data & navigation links', skill: 'Signal efficiency', color: 'amber' }
];

export default function SquadSelect({ onStart }) {
  const [selected, setSelected] = useState(['commander']);
  const toggle = (id) => {
    sound.click();
    setSelected((current) => current.includes(id) ? (current.length > 1 ? current.filter((item) => item !== id) : current) : current.length < 4 ? [...current, id] : current);
  };
  return <main className="screen-shell narrow-shell fade-in">
    <div className="eyebrow"><span className="eyebrow-line" /> PHASE 01 / PERSONNEL <span className="eyebrow-line" /></div>
    <div className="section-heading"><div><p className="micro-label">MISSION CONTROL</p><h1>Assemble your <em>crew.</em></h1><p className="muted">One to four roles. Every perspective matters when the margin for error is thin.</p></div><div className="crew-count"><strong>{selected.length}</strong><span>/ 4<br />ROLES</span></div></div>
    <div className="role-grid">
      {ROLES.map((role) => <button key={role.id} className={`role-card ${role.color} ${selected.includes(role.id) ? 'selected' : ''}`} onClick={() => toggle(role.id)} aria-pressed={selected.includes(role.id)}>
        <div className="role-top"><span className="role-icon">{role.icon}</span><span className="check-mark">{selected.includes(role.id) ? '✓' : '+'}</span></div>
        <h3>{role.name}</h3><p>{role.detail}</p><div className="role-skill"><span>CORE STRENGTH</span><b>{role.skill}</b></div>
      </button>)}
    </div>
    <div className="step-footer"><p className="muted small">Crew members share one command station. Select at least one role.</p><button className="button button-primary" onClick={() => { sound.success(); onStart(selected); }}>CONTINUE TO ENGINEERING <span>→</span></button></div>
  </main>;
}
