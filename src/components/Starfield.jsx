import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;
    let frame = 0;
    let width = 0;
    let height = 0;
    const stars = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), size: Math.random() * 1.6 + 0.25, speed: Math.random() * 0.00016 + 0.000025, phase: Math.random() * Math.PI * 2 }));
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.y += star.speed * 16;
        if (star.y > 1) star.y = 0;
        const pulse = 0.45 + Math.sin(time * 0.001 + star.phase) * 0.3;
        context.globalAlpha = pulse;
        context.fillStyle = '#d7efff';
        context.fillRect(star.x * width, star.y * height, star.size, star.size);
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
