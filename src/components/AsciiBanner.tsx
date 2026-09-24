import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ── ASCII canvas (DOTCROSS · Helvetica Neue · noise · attract) ───── */
const ASCII_COLS = 150;
const ASCII_ROWS = 42;
const ASCII_FPS = 60;
const ASCII_FLICKER = 0.18;
const ASCII_ATTRACT_R = 190;
const ASCII_ATTRACT_BOOST = 0.9;
const ASCII_RAMP = ' .:+xX#';
const ASCII_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const AsciiBanner: React.FC<{ text?: string; className?: string; outline?: boolean; tight?: boolean }> = ({
  text = 'CERTIFICATION',
  className = '',
  outline = false,
  tight = false,
}) => {
  const { isDark } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);
  const mouse = useRef({ x: -99999, y: -99999 });
  const densityRef = useRef<Float32Array | null>(null);
  const noiseRef = useRef<Float32Array | null>(null);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Rasterise the word on a hi-res grid, then measure each cell's glyph density.
    const W = 1500;
    const H = Math.round((ASCII_ROWS / ASCII_COLS) * W);
    const off = document.createElement('canvas');
    off.width = W;
    off.height = H;
    const oc = off.getContext('2d');
    if (!oc) return;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillStyle = '#fff';
    let size = 200;
    for (let s = 200; s >= 40; s -= 2) {
      oc.font = `900 ${s}px ${ASCII_FONT}`;
      if (oc.measureText(text).width <= W * 0.94 && s * 1.2 <= H) {
        size = s;
        break;
      }
    }
    oc.font = `900 ${size}px ${ASCII_FONT}`;
    if (outline) {
      oc.strokeStyle = '#fff';
      oc.lineWidth = Math.max(8, size * 0.08);
      oc.lineJoin = 'round';
      oc.strokeText(text, W / 2, H / 2);
    } else {
      oc.fillText(text, W / 2, H / 2);
    }
    const img = oc.getImageData(0, 0, W, H).data;

    const crop = outline || tight;
    let minX = 0;
    let maxX = W - 1;
    let minY = 0;
    let maxY = H - 1;
    if (crop) {
      minX = Infinity;
      maxX = -1;
      minY = Infinity;
      maxY = -1;
      for (let y = 0; y < H; y++) {
        let hit = false;
        for (let x = 0; x < W; x++) {
          if (img[(y * W + x) * 4 + 3] > 128) {
            hit = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
        }
        if (hit) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      if (maxX < 0) {
        minX = 0;
        maxX = W - 1;
        minY = 0;
        maxY = H - 1;
      }
    }

    const xPad = Math.max(12, Math.round(0.03 * W));
    const yPad = Math.max(8, Math.round(0.06 * H));
    const x0g = crop ? Math.max(0, minX - xPad) : 0;
    const x1g = crop ? Math.min(W, maxX + xPad) : W;
    const y0g = crop ? Math.max(0, minY - yPad) : 0;
    const y1g = crop ? Math.min(H, maxY + yPad) : H;
    const gridW = x1g - x0g;
    const gridH = y1g - y0g;
    const gridCols = crop ? Math.max(20, Math.round((gridW / W) * ASCII_COLS)) : ASCII_COLS;
    const gridRows = crop ? Math.max(8, Math.round((gridH / H) * ASCII_ROWS)) : ASCII_ROWS;
    canvas.style.aspectRatio = `${gridCols} / ${Math.round((gridRows * 11) / 9)}`;

    const density = new Float32Array(gridCols * gridRows);
    const noise = new Float32Array(gridCols * gridRows);
    const sub = 4;
    const cw = gridW / gridCols;
    const ch = gridH / gridRows;
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x0 = x0g + c * cw;
        const y0 = y0g + r * ch;
        let hits = 0;
        for (let sy = 0; sy < sub; sy++) {
          for (let sx = 0; sx < sub; sx++) {
            const px = Math.min(W - 1, Math.floor(x0 + ((sx + 0.5) / sub) * cw));
            const py = Math.min(H - 1, Math.floor(y0 + ((sy + 0.5) / sub) * ch));
            if (img[(py * W + px) * 4 + 3] > 128) hits++;
          }
        }
        const i = r * gridCols + c;
        density[i] = hits / (sub * sub);
        noise[i] = Math.random();
      }
    }
    densityRef.current = density;
    noiseRef.current = noise;

    let raf = 0;
    let visible = true;
    let last = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Per-tick: re-roll a flicker share of the cell thresholds → dither shimmer.
    const step = () => {
      const d = densityRef.current;
      const n = noiseRef.current;
      if (!d || !n) return;
      for (let i = 0; i < n.length; i++) {
        if (d[i] > 0 && Math.random() < ASCII_FLICKER) n[i] = Math.random();
      }
    };

    const draw = () => {
      const d = densityRef.current;
      const n = noiseRef.current;
      if (!d || !n) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cellW = w / gridCols;
      const cellH = h / gridRows;
      ctx.font = `${cellW / 0.52}px ${ASCII_FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const rect = canvas.getBoundingClientRect();
      const mx = mouse.current.x - rect.left;
      const my = mouse.current.y - rect.top;
      const len = ASCII_RAMP.length;
      const base = isDarkRef.current ? 230 : 45;
      const spread = isDarkRef.current ? 25 : 55;

      for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
          const i = r * gridCols + c;
          const dens = d[i];
          if (dens <= 0) continue;
          const cx = (c + 0.5) * cellW;
          const cy = (r + 0.5) * cellH;

          let t = n[i];
          // Mouse attract: cells near the cursor densify toward heavier glyphs.
          const dx = cx - mx;
          const dy = cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < ASCII_ATTRACT_R) {
            t = Math.min(1, t + (1 - dist / ASCII_ATTRACT_R) * ASCII_ATTRACT_BOOST);
          }

          const g = Math.min(len - 1, Math.floor(dens * len + t));
          if (g <= 0) continue;
          const gNorm = g / (len - 1);
          const grey = Math.round(base + spread * gNorm * 0.55);
          ctx.fillStyle = `rgba(${grey},${grey},${grey},${(0.66 + 0.34 * gNorm).toFixed(2)})`;
          ctx.fillText(ASCII_RAMP[g], cx, cy);
        }
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - last < 1000 / ASCII_FPS) return;
      last = now;
      step();
      draw();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);

    let io: IntersectionObserver | undefined;
    if (!reduced) {
      io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(canvas);
      raf = requestAnimationFrame(frame);
    }

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        mouse.current.x = -99999;
        mouse.current.y = -99999;
      } else {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    };
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, [text, outline, tight]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Animated ASCII dither reading ${text}`}
      className={`block w-full select-none pointer-events-none ${className}`}
    />
  );
};

export default AsciiBanner;