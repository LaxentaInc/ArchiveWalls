import React, { useEffect, useRef } from 'react';

export const AuroraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', onResize);

    let time = 0;
    const drawWave = (
      baseY: number,
      startX: number,
      endX: number,
      colorStops: [number, string][],
      waveConfig: {
        a1: number;
        k1: number;
        s1: number;
        a2: number;
        k2: number;
        s2: number;
        a3: number;
        k3: number;
        s3: number;
        phase: number;
        strokeWidth: number;
        blur: number;
      }
    ) => {
      ctx.save();
      ctx.shadowBlur = waveConfig.blur;

      const grad = ctx.createLinearGradient(startX, baseY - 100, endX, baseY + 100);
      colorStops.forEach(([pos, col]) => grad.addColorStop(pos, col));

      ctx.strokeStyle = grad;
      ctx.shadowColor = colorStops[1] ? colorStops[1][1] : '#22d3ee';
      ctx.lineWidth = waveConfig.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      const step = 8;
      let first = true;

      for (let x = startX; x <= endX; x += step) {
        const y =
          baseY +
          Math.cos(x * waveConfig.k1 + time * waveConfig.s1 + waveConfig.phase) * waveConfig.a1 +
          Math.sin(x * waveConfig.k2 + time * waveConfig.s2) * waveConfig.a2 +
          Math.cos(x * waveConfig.k3 - time * waveConfig.s3) * waveConfig.a3;

        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.012;

      // use screen blending so overlapping wave crests naturally bloom in brightness
      ctx.globalCompositeOperation = 'screen';

      // ========================================================
      // TOP-LEFT
      // ========================================================
      const topBaseY = height * 0.22;
      const topEndX = width * 0.65;

      // top layer 1: wide diffused aqua veil
      drawWave(
        topBaseY - 30,
        -50,
        topEndX,
        [
          [0.0, 'rgba(6, 182, 212, 0.0)'],
          [0.3, 'rgba(34, 211, 238, 0.25)'],
          [0.7, 'rgba(45, 212, 191, 0.18)'],
          [1.0, 'rgba(16, 185, 129, 0.0)'],
        ],
        {
          a1: 55,
          k1: 0.0032,
          s1: 0.8,
          a2: 35,
          k2: 0.0068,
          s2: 1.1,
          a3: 20,
          k3: 0.0014,
          s3: 0.5,
          phase: 0.2,
          strokeWidth: 70,
          blur: 50,
        }
      );

      // top layer 2: brighter undulating core ribbon
      drawWave(
        topBaseY,
        -30,
        topEndX - 40,
        [
          [0.0, 'rgba(34, 211, 238, 0.0)'],
          [0.35, 'rgba(34, 211, 238, 0.55)'],
          [0.75, 'rgba(74, 222, 128, 0.45)'],
          [1.0, 'rgba(16, 185, 129, 0.0)'],
        ],
        {
          a1: 45,
          k1: 0.0041,
          s1: 1.0,
          a2: 28,
          k2: 0.0075,
          s2: 0.9,
          a3: 18,
          k3: 0.0022,
          s3: 0.6,
          phase: 1.4,
          strokeWidth: 26,
          blur: 24,
        }
      );

      // ========================================================
      // BOTTOM-RIGHT
      // ========================================================
      const btmBaseY = height * 0.78;
      const btmStartX = width * 0.35;
      const btmEndX = width + 80;

      // bottom layer 1: wide diffused emerald atmospheric veil
      drawWave(
        btmBaseY + 20,
        btmStartX,
        btmEndX,
        [
          [0.0, 'rgba(16, 185, 129, 0.0)'],
          [0.25, 'rgba(45, 212, 191, 0.22)'],
          [0.65, 'rgba(74, 222, 128, 0.26)'],
          [1.0, 'rgba(6, 182, 212, 0.0)'],
        ],
        {
          a1: 65,
          k1: 0.0028,
          s1: 0.7,
          a2: 38,
          k2: 0.0055,
          s2: 1.3,
          a3: 25,
          k3: 0.0016,
          s3: 0.4,
          phase: 2.1,
          strokeWidth: 80,
          blur: 55,
        }
      );

      // bottom layer 2: crisp glowing cosine wave ribbon
      drawWave(
        btmBaseY,
        btmStartX + 40,
        btmEndX,
        [
          [0.0, 'rgba(45, 212, 191, 0.0)'],
          [0.3, 'rgba(34, 211, 238, 0.50)'],
          [0.7, 'rgba(74, 222, 128, 0.60)'],
          [1.0, 'rgba(16, 185, 129, 0.0)'],
        ],
        {
          a1: 50,
          k1: 0.0036,
          s1: 0.9,
          a2: 30,
          k2: 0.0082,
          s2: 1.2,
          a3: 22,
          k3: 0.0025,
          s3: 0.7,
          phase: 0.8,
          strokeWidth: 32,
          blur: 28,
        }
      );

      // bottom layer 3: subtle secondary harmonic filament
      drawWave(
        btmBaseY - 15,
        btmStartX + 80,
        btmEndX - 20,
        [
          [0.0, 'rgba(110, 231, 183, 0.0)'],
          [0.4, 'rgba(45, 212, 191, 0.35)'],
          [0.8, 'rgba(52, 211, 153, 0.30)'],
          [1.0, 'rgba(4, 120, 87, 0.0)'],
        ],
        {
          a1: 38,
          k1: 0.0048,
          s1: 1.1,
          a2: 22,
          k2: 0.0092,
          s2: 0.8,
          a3: 16,
          k3: 0.0031,
          s3: 0.5,
          phase: 3.5,
          strokeWidth: 16,
          blur: 18,
        }
      );

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1] transition-opacity duration-700"
      style={{
        opacity: 'var(--green-factor, 0)',
      }}
    />
  );
};

export default AuroraCanvas;
