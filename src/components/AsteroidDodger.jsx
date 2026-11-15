import { useEffect, useRef, useState } from 'react';

export default function AsteroidDodger({ onResult }) {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [lane, setLane] = useState(1);
  const [result, setResult] = useState(null);
  const laneRef = useRef(1);
  useEffect(() => { laneRef.current = lane; }, [lane]);

  useEffect(() => {
    if (!playing) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let spawn = 0;
    let hits = 0;
    let asteroids = [];
    let ended = false;
    const finish = (success) => {
      if (ended) return;
      ended = true;
      setPlaying(false);
      setResult(success ? 'success' : 'miss');
      onResult(success);
    };
    const draw = (time) => {
      const dt = Math.min(0.04, (time - (last || time)) / 1000);
      last = time; elapsed += dt; spawn += dt;
      if (spawn > 0.52) { spawn = 0; asteroids.push({ x: 640, lane: Math.floor(Math.random() * 3), size: 8 + Math.random() * 9 }); }
      asteroids = asteroids.filter((rock) => rock.x > -30);
      asteroids.forEach((rock) => { rock.x -= 240 * dt; if (rock.lane === laneRef.current && rock.x < 144 && rock.x > 78) { hits += 1; rock.x = -50; } });
      ctx.clearRect(0, 0, 640, 210);
      ctx.fillStyle = '#080e1c'; ctx.fillRect(0, 0, 640, 210);
      ctx.strokeStyle = 'rgba(102,171,211,.17)'; ctx.lineWidth = 1;
      [45, 105, 165].forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(640, y); ctx.stroke(); });
      ctx.setLineDash([5, 9]); ctx.strokeStyle = 'rgba(69,197,236,.22)'; ctx.beginPath(); ctx.moveTo(130, 0); ctx.lineTo(130, 210); ctx.stroke(); ctx.setLineDash([]);
      asteroids.forEach((rock) => { ctx.fillStyle = '#9a8c80'; ctx.beginPath(); ctx.arc(rock.x, 45 + rock.lane * 60, rock.size, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#e4c7a0'; ctx.stroke(); });
      const shipY = 45 + laneRef.current * 60;
      ctx.fillStyle = '#55dbff'; ctx.shadowBlur = 12; ctx.shadowColor = '#55dbff'; ctx.beginPath(); ctx.moveTo(116, shipY); ctx.lineTo(91, shipY - 10); ctx.lineTo(96, shipY); ctx.lineTo(91, shipY + 10); ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = '#d9e9f5'; ctx.font = '11px monospace'; ctx.fillText(`EVASION WINDOW  ${Math.max(0, 8 - elapsed).toFixed(1)}s`, 16, 20); ctx.fillText(`IMPACT COUNT  ${hits}`, 500, 20);
      if (hits >= 3) return finish(false);
      if (elapsed >= 8) return finish(true);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing, onResult]);

  useEffect(() => {
    const keydown = (event) => {
      if (!playing || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') setLane((current) => Math.max(0, current - 1));
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') setLane((current) => Math.min(2, current + 1));
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [playing]);

  return <div className="dodger-card"><div className="dodger-header"><div><span className="micro-label">OPTIONAL SKILL CHECK</span><h3>Asteroid evasion drill</h3></div><span className="counter-pill">3 IMPACTS = FAIL</span></div><canvas ref={canvasRef} width="640" height="210" className="dodger-canvas" aria-label="Asteroid evasion game canvas" />
    <div className="dodger-controls"><p>{playing ? 'Move between lanes using arrow keys or the controls.' : result === 'success' ? 'Clean flight path. Navigation bonus ready.' : result === 'miss' ? 'Too many impacts. The crossing is still possible, but riskier.' : 'Survive eight seconds. This drill can improve your next maneuver.'}</p><div className="dodger-actions"><button className="mini-control" disabled={!playing} onClick={() => setLane((current) => Math.max(0, current - 1))}>↑</button><button className="mini-control" disabled={!playing} onClick={() => setLane((current) => Math.min(2, current + 1))}>↓</button><button className="button button-small" disabled={playing} onClick={() => { setLane(1); laneRef.current = 1; setResult(null); setPlaying(true); }}> {result ? 'RUN AGAIN' : 'START DRILL'} </button></div></div>
  </div>;
}
