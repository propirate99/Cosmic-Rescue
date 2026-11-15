import { useEffect, useRef } from 'react';
export default function VictoryParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;
    let raf = 0;
    const particles = Array.from({ length: 90 }, () => ({ x: Math.random() * 700, y: Math.random() * 180 - 180, vx: (Math.random() - 0.5) * 1.7, vy: Math.random() * 2.3 + 0.8, size: Math.random() * 4 + 2, hue: Math.random() * 100 + 160 }));
    const draw = () => {
      ctx.clearRect(0, 0, 700, 210);
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.y > 220) { p.y = -10; p.x = Math.random() * 700; } ctx.fillStyle = `hsl(${p.hue}, 90%, 68%)`; ctx.fillRect(p.x, p.y, p.size, p.size * 1.7); });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div className="victory-art"><canvas ref={canvasRef} width="700" height="210" /><div className="rescued-portrait"><span>✦</span><b>MIKO</b><small>CREW MEMBER RECOVERED</small></div></div>;
}
