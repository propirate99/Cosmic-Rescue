import { evaluateDesign } from '../data/components.js';
const RESOURCE_META = [
  { id: 'fuel', label: 'PROPELLANT', tone: 'cyan', suffix: '%' },
  { id: 'power', label: 'POWER', tone: 'amber', suffix: '%' },
  { id: 'data', label: 'DATA BUFFER', tone: 'violet', suffix: ' GB' },
  { id: 'armor', label: 'HULL INTEGRITY', tone: 'green', suffix: '%' },
  { id: 'risk', label: 'MISSION RISK', tone: 'red', suffix: '%' }
];
export default function MissionHUD({ state }) {
  const storage = state.design ? evaluateDesign(state.design).storage : 1;
  return <section className="mission-hud panel-surface">
    <div className="hud-identity"><span className="hud-emblem">CR</span><div><b>MISSION STATUS</b><small>LIVE TELEMETRY</small></div></div>
    <div className="hud-resources">{RESOURCE_META.map((item) => { const value = state.resources[item.id]; const max = item.id === 'data' ? storage : 100; return <div className="hud-resource" key={item.id}><div><span>{item.label}</span><b>{Math.round(value)}{item.suffix}</b></div><div className="hud-track"><i className={item.tone} style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%` }} /></div></div>; })}</div>
    <div className="hud-metrics"><div><small>SCIENCE</small><b>{state.resources.science}</b></div><div><small>RESCUE</small><b>{state.resources.rescue}</b></div><div><small>ELAPSED</small><b>{state.resources.time} <small>UNITS</small></b></div></div>
  </section>;
}
