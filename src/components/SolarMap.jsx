import { useEffect, useRef, useState } from 'react';
import { LEVELS } from '../data/levels.js';

const OBJECTS = [
  { id: 'sun', name: 'Sun', x: 52, y: 108, radius: 16, note: 'The star at the centre of the solar system.', context: true },
  { id: 'mercury', name: 'Mercury', x: 112, y: 130, radius: 4, note: 'Inner-planet reference waypoint.', context: true },
  { id: 'venus', name: 'Venus', x: 175, y: 63, radius: 7, note: 'Inner-planet reference waypoint.', context: true },
  { id: 'earth', name: 'Earth Orbit', x: 244, y: 116, radius: 10, levelIndex: 0, note: 'Departure orbit and mission start.' },
  { id: 'moon', name: 'Moon', x: 297, y: 65, radius: 5, levelIndex: 1, note: 'Thermal management and communications waypoint.' },
  { id: 'mars', name: 'Mars', x: 390, y: 150, radius: 8, levelIndex: 2, note: 'Dust, power, and science data waypoint.' },
  { id: 'belt', name: 'Asteroid Belt', x: 505, y: 72, radius: 9, levelIndex: 3, note: 'Debris-navigation waypoint.' },
  { id: 'jupiter', name: 'Jupiter', x: 650, y: 154, radius: 14, note: 'Gas-giant reference point.', context: true },
  { id: 'saturn', name: 'Saturn', x: 770, y: 89, radius: 13, levelIndex: 4, note: 'Outer-planet power and ring-navigation waypoint.' },
  { id: 'base', name: 'Alien Base', x: 930, y: 132, radius: 11, levelIndex: 5, note: 'Final extraction beyond Saturn.' }
];

function drawPlanet(ctx, point, active, visited, time) {
  const { x, y, radius, id } = point;
  if (id === 'sun') {
    const glow = ctx.createRadialGradient(x, y, 2, x, y, 37);
    glow.addColorStop(0, 'rgba(255,211,125,.85)'); glow.addColorStop(.35, 'rgba(243,164,77,.22)'); glow.addColorStop(1, 'rgba(243,164,77,0)');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, 37, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd68e'; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'belt') {
    for (let i = 0; i < 20; i += 1) {
      const a = (i / 20) * Math.PI * 2;
      const r = radius + (i % 3) * 4;
      ctx.fillStyle = i % 2 ? 'rgba(190,203,216,.78)' : 'rgba(119,144,164,.8)';
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .78, i % 4 === 0 ? 2 : 1.1, 0, Math.PI * 2); ctx.fill();
    }
  } else if (id === 'saturn') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-.22); ctx.strokeStyle = '#c8ad85'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(0, 0, 23, 7, 0, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = '#d4bd93'; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  } else if (id === 'base') {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.strokeStyle = '#c2a9ff'; ctx.lineWidth = 1.4; ctx.strokeRect(-radius * .72, -radius * .72, radius * 1.44, radius * 1.44); ctx.restore();
    ctx.fillStyle = 'rgba(186,163,255,.15)'; ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
  } else {
    const palette = { mercury: ['#a7a6a0', '#555e66'], venus: ['#ebc58b', '#916f4e'], earth: ['#7cd9ef', '#275c8b'], moon: ['#e0e1dc', '#7a8590'], mars: ['#f1a07d', '#8b443d'], jupiter: ['#e5c19a', '#906d57'] };
    const colors = palette[id] || ['#95bdd1', '#35566d'];
    const gradient = ctx.createRadialGradient(x - radius * .35, y - radius * .4, 1, x, y, radius * 1.3);
    gradient.addColorStop(0, colors[0]); gradient.addColorStop(1, colors[1]);
    ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  }
  if (active) {
    const pulse = 18 + Math.sin(time * .004) * 3;
    ctx.strokeStyle = 'rgba(84,216,243,.7)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, pulse, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(84,216,243,.12)'; ctx.beginPath(); ctx.arc(x, y, pulse + 5, 0, Math.PI * 2); ctx.fill();
  } else if (visited) {
    ctx.strokeStyle = 'rgba(127,224,174,.55)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, radius + 5, 0, Math.PI * 2); ctx.stroke();
  }
}

export default function SolarMap({ levelIndex }) {
  const canvasRef = useRef(null);
  const [selected, setSelected] = useState(OBJECTS.find((point) => point.levelIndex === levelIndex)?.id || 'earth');
  const selectedPoint = OBJECTS.find((point) => point.id === selected) || OBJECTS[3];
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = 1000 * ratio; canvas.height = 220 * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    let raf = 0;
    const waypoints = OBJECTS.filter((point) => Number.isInteger(point.levelIndex));
    const draw = (time) => {
      ctx.clearRect(0, 0, 1000, 220);
      ctx.fillStyle = '#081321'; ctx.fillRect(0, 0, 1000, 220);
      const backGlow = ctx.createRadialGradient(620, 120, 12, 620, 120, 470);
      backGlow.addColorStop(0, 'rgba(43,95,125,.15)'); backGlow.addColorStop(1, 'rgba(4,9,17,0)'); ctx.fillStyle = backGlow; ctx.fillRect(0, 0, 1000, 220);
      ctx.strokeStyle = 'rgba(104,154,189,.16)'; ctx.lineWidth = 1;
      [110, 205, 310, 435, 570, 730, 900].forEach((radius) => { ctx.beginPath(); ctx.ellipse(52, 108, radius, radius * .23, 0, 0, Math.PI * 2); ctx.stroke(); });
      const route = waypoints.map((p) => [p.x, p.y]);
      ctx.save(); ctx.setLineDash([5, 7]); ctx.strokeStyle = 'rgba(94,181,211,.38)'; ctx.lineWidth = 1.3; ctx.beginPath(); route.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = 'rgba(127,224,174,.65)'; ctx.lineWidth = 2; ctx.beginPath(); route.slice(0, levelIndex + 1).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      OBJECTS.forEach((point) => {
        const active = point.levelIndex === levelIndex;
        const visited = Number.isInteger(point.levelIndex) && point.levelIndex < levelIndex;
        drawPlanet(ctx, point, active, visited, time);
        ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = active ? '#83e7fb' : visited ? '#83d5ac' : '#8095a9';
        ctx.fillText(point.name.toUpperCase(), point.x, point.y + (point.radius || 8) + (point.id === 'saturn' ? 22 : 18));
      });
      const activePoint = waypoints[levelIndex] || waypoints[0];
      const bob = Math.sin(time * .003) * 3;
      ctx.save(); ctx.translate(activePoint.x + 25, activePoint.y - 28 + bob); ctx.fillStyle = '#f3c77b'; ctx.shadowColor = '#f3c77b'; ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(7, 5); ctx.lineTo(-7, 5); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.font = '8px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#607d96'; ctx.fillText('SOLAR SYSTEM / NOT TO SCALE', 15, 18);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [levelIndex]);

  const handleCanvasClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (1000 / rect.width);
    const y = (event.clientY - rect.top) * (220 / rect.height);
    const nearest = OBJECTS.map((point) => ({ point, distance: Math.hypot(point.x - x, point.y - y) })).sort((a, b) => a.distance - b.distance)[0];
    if (nearest && nearest.distance < 40) setSelected(nearest.point.id);
  };

  return <section className="panel-surface route-panel solar-map-panel">
    <div className="panel-heading compact"><div><p className="micro-label">TRAJECTORY TRACKER</p><h2>Solar system route</h2></div><span className="route-progress">{String(levelIndex + 1).padStart(2, '0')} / 06</span></div>
    <canvas ref={canvasRef} className="solar-map-canvas" onClick={handleCanvasClick} role="img" aria-label="Interactive solar system map. Select a planet to read its mission note." />
    <div className="map-waypoint-buttons">{LEVELS.map((level, index) => <button type="button" key={level.id} className={index === levelIndex ? 'current' : index < levelIndex ? 'visited' : ''} onClick={() => setSelected(OBJECTS.find((point) => point.levelIndex === index)?.id || 'earth')}>{level.name}</button>)}</div>
    <div className="map-selected-note"><b>{selectedPoint.name.toUpperCase()}</b><span>{selectedPoint.note}</span></div>
  </section>;
}
