import { useEffect, useRef } from 'react';

interface DotTextProps {
  text?: string;
  color?: string;
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const value = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const num = parseInt(value, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export default function DotText({ text = 'GITHUB', color = '#ffffff', className }: DotTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const sampleRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const sample = sampleRef.current;
    const canvas = canvasRef.current;
    if (!root || !sample || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [cr, cg, cb] = hexToRgb(color);
    let cells: { gx: number; gy: number; x: number; y: number; r: number }[] = [];
    let step = 8;
    let W = 0;
    let H = 0;
    let scale = 1;
    let handle = 0;

    const compute = () => {
      const style = window.getComputedStyle(sample);
      const font = style.font;
      const sampler = document.createElement('canvas');
      const sctx = sampler.getContext('2d', { willReadFrequently: true });
      if (!sctx) return;

      sctx.font = font;
      try {
        sctx.letterSpacing = style.letterSpacing;
      } catch {
        // letterSpacing not supported on this canvas impl — fall back to glyph defaults
      }
      const m = sctx.measureText(text);
      const ascent = m.actualBoundingBoxAscent || 0;
      const descent = m.actualBoundingBoxDescent || 0;
      const glyphW = m.width || root.clientWidth;
      const glyphH = Math.max(1, ascent + descent);

      W = Math.max(1, Math.ceil(glyphW));
      H = Math.max(1, Math.ceil(glyphH));
      sampler.width = W;
      sampler.height = H;
      sctx.font = font;
      try {
        sctx.letterSpacing = style.letterSpacing;
      } catch {
        // ignore
      }
      sctx.textBaseline = 'alphabetic';
      sctx.textAlign = 'left';
      sctx.fillStyle = '#fff';
      sctx.fillText(text, 0, ascent);

      step = Math.max(2, Math.round(H * 0.03));
      const data = sctx.getImageData(0, 0, W, H).data;
      cells = [];
      for (let y = step / 2; y < H; y += step) {
        for (let x = step / 2; x < W; x += step) {
          const px = Math.min(W - 1, Math.round(x));
          const py = Math.min(H - 1, Math.round(y));
          if (data[(py * W + px) * 4 + 3] > 128) {
            cells.push({ gx: x, gy: y, x, y, r: step * 0.3 });
          }
        }
      }

      scale = Math.min(2, window.devicePixelRatio || 1);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      canvas.width = Math.max(1, Math.round(W * scale));
      canvas.height = Math.max(1, Math.round(H * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const draw = () => {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},0.92)`;
      for (const c of cells) {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      handle = requestAnimationFrame(loop);
    };

    compute();
    loop();

    const observer = new ResizeObserver(() => compute());
    observer.observe(root);

    let ready = true;
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(() => {
        if (ready) compute();
      });
    }

    return () => {
      ready = false;
      cancelAnimationFrame(handle);
      observer.disconnect();
    };
  }, [color, text]);

  return (
    <span ref={rootRef} className={`relative inline-block whitespace-nowrap ${className ?? ''}`}>
      <span ref={sampleRef} aria-hidden="true" className="invisible select-none">
        {text}
      </span>
      <canvas ref={canvasRef} className="absolute left-0 top-0 pointer-events-none" />
    </span>
  );
}